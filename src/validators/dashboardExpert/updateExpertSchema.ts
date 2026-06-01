import { z } from "zod";

export const existingImageSchema = z.object({
    url: z.string(),
    existingFile: z.literal(true),
});

export const updateExpertSchema = z.object({
    full_name: z
        .string()
        .trim()
        .min(1, { message: "Full name is required" })
        .refine(
            (value) => {
                const parts = value.trim().split(/\s+/);
                return parts.length >= 2 && parts.every((p) => p.length >= 2);
            },
            {
                message:
                    "Full name must contain at least two words, each with a minimum of 2 characters",
            }
        ),

    email: z.string().optional(),
    phone_number: z.string().optional(),

    title: z.string().trim().optional(),
    bio: z.string().trim().optional(),
    years_experience: z.coerce
        .number({ message: "Must be a number" })
        .int()
        .min(0, { message: "Cannot be negative" })
        .optional(),

    website: z
        .string()
        .trim()
        .optional()
        .refine((val) => !val || /^https?:\/\//.test(val), {
            message: "Enter a valid URL",
        }),
    linkedin: z
        .string()
        .trim()
        .url({ message: "Enter a valid LinkedIn URL" })
        .or(z.literal(""))
        .optional(),

    languages: z.array(z.number()).min(1, { message: "Select at least one language" }),
    categories: z.array(z.number()).min(1, { message: "Select at least one specialization" }),
    countries: z.array(z.number()).min(1, { message: "Select at least one service area" }),

    certifications: z
        .array(z.object({ cert_name: z.string().trim().min(1) }))
        .optional(),

    photo: z.union([z.instanceof(File), existingImageSchema]).optional(),

    podcast: z.boolean().optional(),
});

export type UpdateExpertValues = z.infer<typeof updateExpertSchema>;
export type ExistingImage = z.infer<typeof existingImageSchema>;
