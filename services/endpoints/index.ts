export const PRODUCTS_ENDPOINTS = (id?: string) => ({
  PRODUCTS: id ? `/product/${id}` : `/product`,
  CREATE_PRODUCT: `/product`,
  UPDATE_PRODUCT: `/product/${id}`,
  DELETE_PRODUCT: `/product/${id}`,
});
