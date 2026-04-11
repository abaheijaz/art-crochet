import { OpenAPIRoute } from "chanfana";
import { Context } from "hono";
import { z } from "zod";

type AppContext = Context<{ Bindings: Env }>;

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

export class InstagramPicture extends OpenAPIRoute {
	schema = {
		tags: ["Instagram"],
		summary: "Get latest picture from Instagram professional account",
		responses: {
			"200": {
				description: "Returns latest image details from Instagram Graph API",
				content: {
					"application/json": {
						schema: z.object({
							source: z.literal("instagram_graph_api"),
							picture_url: z.string().url(),
							permalink: z.string().url(),
							caption: z.string().nullable().optional(),
							timestamp: z.string(),
							media_type: z.string(),
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
		if (!c.env.INSTAGRAM_BUSINESS_ACCOUNT_ID || !c.env.INSTAGRAM_GRAPH_ACCESS_TOKEN) {
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
		apiUrl.searchParams.set(
			"fields",
			"id,caption,media_type,media_url,thumbnail_url,permalink,timestamp,username",
		);
		apiUrl.searchParams.set("limit", "10");
		apiUrl.searchParams.set("access_token", c.env.INSTAGRAM_GRAPH_ACCESS_TOKEN);

		const response = await fetch(apiUrl.toString());
		if (!response.ok) {
			const errorBody = await response.text();
			return c.json(
				{
					error: `Instagram Graph API error (${response.status}): ${errorBody}`,
				},
				500,
			);
		}

		const payload = (await response.json()) as { data?: unknown[] };
		const mediaItems = z.array(instagramMediaItemSchema).safeParse(payload.data ?? []);
		if (!mediaItems.success) {
			return c.json(
				{
					error: "Instagram Graph API returned an unexpected response format.",
				},
				500,
			);
		}

		const picture = mediaItems.data.find((item) => {
			const mediaType = item.media_type.toUpperCase();
			return mediaType === "IMAGE" || mediaType === "CAROUSEL_ALBUM";
		});

		if (!picture || (!picture.media_url && !picture.thumbnail_url)) {
			return c.json(
				{
					error: "No picture available from Instagram account.",
				},
				500,
			);
		}

		return {
			source: "instagram_graph_api",
			picture_url: picture.media_url || picture.thumbnail_url || "",
			permalink: picture.permalink,
			caption: picture.caption,
			timestamp: picture.timestamp,
			media_type: picture.media_type,
		};
	}
}
