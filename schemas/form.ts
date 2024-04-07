import * as z from "zod";

export const formSchema = z.object({
    name: z.string().min(4, { message: "Строка должна содержать не менее 4 символов" }),
    description: z.string().optional()
});

export type formSchemaType = z.infer<typeof formSchema>;
