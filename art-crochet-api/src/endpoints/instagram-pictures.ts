import { OpenAPIRoute } from "chanfana";
import { Context } from "hono";
import { z } from "zod";

type AppContext = Context<{ Bindings: Env }>;

type ProductType =
  | "bag"
  | "bucket-hat"
  | "coaster"
  | "lipbalm-holder"
  | "others";

const productTypeMatchers: ReadonlyArray<{
  productType: ProductType;
  keywords: string[];
}> = [
  {
    productType: "bucket-hat",
    keywords: ["bucket hat", "buckethat", "crochet bucket hat"],
  },
  {
    productType: "lipbalm-holder",
    keywords: [
      "lipbalm",
      "lip balm",
      "lipbalm holder",
      "lipbalm case",
      "lipbalm pouch",
      "inhaler",
      "inhaler holder",
      "inhaler case",
      "inhaler pouch",
    ],
  },
  {
    productType: "coaster",
    keywords: ["coaster", "coasters"],
  },
  {
    productType: "bag",
    keywords: ["crochet bag", "tote bag", "shoulder bag", "handbag", "bag"],
  },
];

function normalizeText(value: string): string {
  return ` ${value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, " ")
    .trim()} `;
}

function classifyProductType(caption?: string | null): ProductType {
  if (!caption) {
    return "others";
  }

  const normalizedCaption = normalizeText(caption);

  for (const matcher of productTypeMatchers) {
    if (
      matcher.keywords.some((keyword) =>
        normalizedCaption.includes(normalizeText(keyword)),
      )
    ) {
      return matcher.productType;
    }
  }

  return "others";
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
  product_type: z.enum([
    "bag",
    "bucket-hat",
    "coaster",
    "lipbalm-holder",
    "others",
  ]),
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
        source: "instagram_graph_api" as const,
        picture_url: picture.media_url || picture.thumbnail_url || "",
        permalink: picture.permalink,
        caption: picture.caption,
        timestamp: picture.timestamp,
        media_type: picture.media_type,
        product_type: classifyProductType(picture.caption),
      }));

    return {
      pictures,
    };
  }
}
