import { z } from "zod";

export const productSchema = z.object({
  name: z.string().min(1, "Product name is required"),

  subDescription: z.string().min(1, "Sub description is required"),

  content: z.string().min(1, "Product content is required"),

  images: z.array(z.string()).min(2, "At least 2 images are required"),

  gender: z
    .array(z.enum(["male", "female", "kids"]))
    .min(1, "At least one gender is required"),

  isOnSale: z.boolean(),
  isNew: z.boolean(),

  regularPrice: z.number().positive("Regular price must be greater than 0"),

  salePrice: z
    .number()
    .positive("Sale price must be greater than 0")
    .optional(),

  priceIncludesTax: z.boolean(),

  taxPercentage: z
    .number()
    .min(0, "Tax cannot be negative")
    .max(100, "Tax cannot exceed 100")
    .optional(),

  productCode: z.string().min(1, "Product code is required"),

  sku: z.string().min(1, "SKU is required"),

  quantity: z.number().int().min(0, "Quantity cannot be negative"),

  category: z.string().min(1, "Category is required"),

  colors: z.array(z.string()).min(1, "At least one color is required"),

  sizes: z.array(z.string()).min(1, "At least one size is required"),

  tags: z.array(z.string()).optional(),
  isPublished: z.boolean().default(false).optional(),
});

export type ProductFormValues = z.infer<typeof productSchema>;
