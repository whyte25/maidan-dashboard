import { ProductFormValues } from "@/validations/product";

export interface ProductResponse extends ProductFormValues {
  id: string;
  createdAt?: string;
}

export interface GetProductsParams {
  page?: number;
  limit?: number;
  search?: string;
  category?: string;
  rating?: number;
  price?: number;
  sort?: string;
  order?: "asc" | "desc";
  isPublished?: boolean;
}

export interface PaginationMetadata {
  current_page: number;
  total_pages: number;
  total_items: number;
  items_per_page: number;
}

export interface GetProductsResponse {
  data: ProductResponse[];
  pagination: PaginationMetadata;
}
