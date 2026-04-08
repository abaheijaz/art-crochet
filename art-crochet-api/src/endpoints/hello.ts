import { OpenAPIRoute } from "chanfana";
import { z } from "zod";

export class Hello extends OpenAPIRoute {
	schema = {
		tags: ["General"],
		summary: "Hello Aizat handsome",
		responses: {
			"200": {
				description: "Returns a hello Aizat handsome message",
				content: {
					"application/json": {
						schema: z.object({
							message: z.string(),
						}),
					},
				},
			},
		},
	};

	async handle() {
		return { message: "Hello Aizat handsome" };
	}
}
