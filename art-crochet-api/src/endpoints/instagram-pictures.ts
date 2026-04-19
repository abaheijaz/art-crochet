import { OpenAPIRoute } from "chanfana";
import { Context } from "hono";
import { z } from "zod";

type AppContext = Context<{ Bindings: Env }>;

function toProductTypeSlug(value: string): string {
  return value
    .replace(/([a-z0-9])([A-Z])/g, "$1 $2")
    .replace(/([A-Z])([A-Z][a-z])/g, "$1 $2")
    .replace(/[^a-zA-Z0-9]+/g, " ")
    .trim()
    .toLowerCase()
    .replace(/\s+/g, "-");
}

function toVariantLabel(value: string): string {
  return value
    .replace(/([a-z0-9])([A-Z])/g, "$1 $2")
    .replace(/([A-Z])([A-Z][a-z])/g, "$1 $2")
    .replace(/[^a-zA-Z0-9]+/g, " ")
    .trim()
    .toLowerCase()
    .replace(/\s+/g, " ")
    .split(" ")
    .filter((segment) => segment.length > 0)
    .map((segment) => segment.charAt(0).toUpperCase() + segment.slice(1))
    .join(" ");
}

interface WebximaTagData {
  productType: string;
  variant?: string;
}

function extractWebximaTagData(caption?: string | null): WebximaTagData[] {
  if (!caption) {
    return [];
  }

  const hashtags = caption.match(/#[\w]+/g) ?? [];
  const tagDataMap = new Map<string, WebximaTagData>();

  for (const hashtag of hashtags) {
    const token = hashtag.slice(1);
    const segments = token.split("_");

    if (segments.length < 3 || segments[0].toLowerCase() !== "ximaweb") {
      continue;
    }

    const productToken = segments[1]?.trim();
    if (!productToken) {
      continue;
    }

    const productType = toProductTypeSlug(productToken);
    if (!productType) {
      continue;
    }

    const variantToken = segments[2]?.trim();
    const variant = variantToken ? toVariantLabel(variantToken) : undefined;
    const key = `${productType}::${variant ?? ""}`;

    if (!tagDataMap.has(key)) {
      tagDataMap.set(key, {
        productType,
        variant,
      });
    }
  }

  return Array.from(tagDataMap.values());
}

function hasExcludedHashtag(caption?: string | null): boolean {
  if (!caption) {
    return false;
  }

  const hashtags = caption.match(/#[\w]+/g) ?? [];
  return hashtags.some((hashtag) => hashtag.toLowerCase().includes("random"));
}

const instagramMediaItemSchema = z.object({
  id: z.string(),
  caption: z.string().nullable().optional(),
  media_type: z.string(),
  media_url: z.string().url().nullable().optional(),
  thumbnail_url: z.string().url().nullable().optional(),
  permalink: z.string().url(),
  timestamp: z.string(),
  username: z.string().optional(),
});

const instagramMediaResponseSchema = z.object({
  data: z.array(instagramMediaItemSchema),
  paging: z
    .object({
      next: z.string().url().optional(),
    })
    .partial()
    .optional(),
});

const pictureSchema = z.object({
  source: z.literal("instagram_graph_api"),
  picture_url: z.string().url(),
  permalink: z.string().url(),
  caption: z.string().nullable().optional(),
  timestamp: z.string(),
  media_type: z.string(),
  product_type: z.string().min(1),
  product_variants: z.array(z.string().min(1)).optional(),
});

export class InstagramPictures extends OpenAPIRoute {
  schema = {
    tags: ["Instagram"],
    summary: "Get latest Instagram pictures classified by product type",
    responses: {
      "200": {
        description: "Returns latest image list from Instagram Graph API",
        content: {
          "application/json": {
            schema: z.object({
              pictures: z.array(pictureSchema),
            }),
          },
        },
      },
      "500": {
        description: "Instagram request failed",
        content: {
          "application/json": {
            schema: z.object({
              error: z.string(),
            }),
          },
        },
      },
    },
  };

  async handle(c: AppContext) {
    if (
      !c.env.INSTAGRAM_BUSINESS_ACCOUNT_ID ||
      !c.env.INSTAGRAM_GRAPH_ACCESS_TOKEN
    ) {
      return c.json(
        {
          error:
            "Missing Instagram configuration. Set INSTAGRAM_BUSINESS_ACCOUNT_ID and INSTAGRAM_GRAPH_ACCESS_TOKEN.",
        },
        500,
      );
    }

    const apiVersion = c.env.INSTAGRAM_GRAPH_API_VERSION || "v23.0";
    const apiUrl = new URL(
      `https://graph.facebook.com/${apiVersion}/${c.env.INSTAGRAM_BUSINESS_ACCOUNT_ID}/media`,
    );
    const seenMediaIds = new Set<string>();
    const mediaItems: z.infer<typeof instagramMediaItemSchema>[] = [];

    apiUrl.searchParams.set(
      "fields",
      "id,caption,media_type,media_url,thumbnail_url,permalink,timestamp,username",
    );
    // Walk several Instagram pages so the UI can progressively reveal the full catalogue.
    apiUrl.searchParams.set("limit", "50");
    apiUrl.searchParams.set("access_token", c.env.INSTAGRAM_GRAPH_ACCESS_TOKEN);

    let nextPageUrl: string | undefined = apiUrl.toString();
    let fetchedPages = 0;

    while (nextPageUrl && fetchedPages < 10) {
      const response = await fetch(nextPageUrl);
      if (!response.ok) {
        const errorBody = await response.text();
        return c.json(
          {
            error: `Instagram Graph API error (${response.status}): ${errorBody}`,
          },
          500,
        );
      }

      const payload = instagramMediaResponseSchema.safeParse(
        await response.json(),
      );
      if (!payload.success) {
        return c.json(
          {
            error:
              "Instagram Graph API returned an unexpected response format.",
          },
          500,
        );
      }

      for (const mediaItem of payload.data.data) {
        if (seenMediaIds.has(mediaItem.id)) {
          continue;
        }

        seenMediaIds.add(mediaItem.id);
        mediaItems.push(mediaItem);
      }

      nextPageUrl = payload.data.paging?.next;
      fetchedPages += 1;
    }

    const pictures = mediaItems
      .filter((item) => {
        const mediaType = item.media_type.toUpperCase();
        return mediaType === "IMAGE" || mediaType === "CAROUSEL_ALBUM";
      })
      .filter((item) => item.media_url || item.thumbnail_url)
      .filter((item) => !hasExcludedHashtag(item.caption))
      .map((picture) => ({
        picture,
        tagData: extractWebximaTagData(picture.caption),
      }))
      .map(({ picture, tagData }) => ({
        picture,
        productTypes: Array.from(new Set(tagData.map((entry) => entry.productType))),
        productVariants: Array.from(
          new Set(
            tagData
              .map((entry) => entry.variant)
              .filter((variant): variant is string => Boolean(variant)),
          ),
        ),
      }))
      .filter(({ productTypes }) => productTypes.length === 1)
      .map(({ picture, productTypes, productVariants }) => {
        const mappedPicture = {
          source: "instagram_graph_api" as const,
          picture_url: picture.media_url || picture.thumbnail_url || "",
          permalink: picture.permalink,
          caption: picture.caption,
          timestamp: picture.timestamp,
          media_type: picture.media_type,
          product_type: productTypes[0],
        };

        if (productVariants.length > 0) {
          return {
            ...mappedPicture,
            product_variants: productVariants,
          };
        }

        return mappedPicture;
      });

    return {
      pictures,
    };
  }
}
