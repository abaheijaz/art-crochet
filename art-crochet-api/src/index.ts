import { fromHono } from "chanfana";
import { Hono } from "hono";
import { Hello } from "./endpoints/hello";
import { InstagramPicture } from "./endpoints/instagram-picture";
import { InstagramPictures } from "./endpoints/instagram-pictures";

// Start a Hono app
const app = new Hono<{ Bindings: Env }>();

// Setup OpenAPI registry
const openapi = fromHono(app, {
	docs_url: "/",
});

// Register OpenAPI endpoints
openapi.get("/api/hello", Hello);
openapi.get("/api/instagram/picture", InstagramPicture);
openapi.get("/api/instagram/pictures", InstagramPictures);

// You may also register routes for non OpenAPI directly on Hono
// app.get('/test', (c) => c.text('Hono!'))

// Export the Hono app
export default app;
