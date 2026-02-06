import { GetProductsParams, ProductResponse } from "@/types";
import { ProductFormValues } from "@/validations/product";
import { PRODUCTS_ENDPOINTS } from "../endpoints";
import instance from "../instance";

export const createProduct = async (data: ProductFormValues) => {
  const response = await instance.post(
    PRODUCTS_ENDPOINTS().CREATE_PRODUCT,
    data,
  );

  return response.data;
};

export const updateProduct = async (id: string, data: ProductFormValues) => {
  const response = await instance.put(
    PRODUCTS_ENDPOINTS(id).UPDATE_PRODUCT,
    data,
  );

  return response.data;
};

export const deleteProduct = async (id: string) => {
  const response = await instance.delete(PRODUCTS_ENDPOINTS(id).DELETE_PRODUCT);

  return response.data;
};

export const getProducts = async ({
  page,
  limit,
  search,
  category,
  rating,
  price,
  sort,
  order,
}: GetProductsParams): Promise<ProductResponse[]> => {
  const response = await instance.get(PRODUCTS_ENDPOINTS().PRODUCTS, {
    params: {
      page,
      limit,
      search,
      category,
      rating,
      price,
      sortBy: sort || "createdAt",
    },
  });

  return response.data;
};

export const getProductById = async (id: string): Promise<ProductResponse> => {
  const response = await instance.get(PRODUCTS_ENDPOINTS(id).PRODUCTS);

  return Array.isArray(response.data) ? response.data[0] : response.data;
};
