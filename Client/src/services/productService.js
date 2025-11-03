import api from "./api";

export const getAllProducts = async () => {
  const response = await api.get("/Products");
  return response.data;
};

export const getProductById = async (id) => {
  const response = await api.get(`/Products/${id}`);
  return response.data;
};

export const getProductsByCategory = async (categoryId) => {
  const response = await api.get(`/Products/category/${categoryId}`);
  return response.data;
};

export const searchProducts = async (query) => {
  const response = await api.get(`/Products/search`, { params: { query } });
  return response.data;
};

export const createProduct = async (productData) => {
  const formData = new FormData();
  formData.append("Name", productData.Name);
  formData.append("Description", productData.Description || "");
  formData.append("Price", productData.Price);
  formData.append("CategoryId", productData.CategoryId);
  formData.append("IsActive", productData.IsActive ?? true);
  if (productData.Image) formData.append("Image", productData.Image);
  if (productData.ImageUrl) formData.append("ImageUrl", productData.ImageUrl);
  if (productData.ImagePublicId) formData.append("ImagePublicId", productData.ImagePublicId);

  const response = await api.post("/Products", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return response.data;
};

export const updateProduct = async (id, productData) => {
  const formData = new FormData();
  formData.append("Id", productData.Id || id);
  formData.append("Name", productData.Name);
  formData.append("Description", productData.Description || "");
  formData.append("Price", productData.Price);
  formData.append("CategoryId", productData.CategoryId);
  formData.append("IsActive", productData.IsActive ?? true);
  if (productData.Image) formData.append("Image", productData.Image);
  if (productData.ImageUrl) formData.append("ImageUrl", productData.ImageUrl);
  if (productData.ImagePublicId) formData.append("ImagePublicId", productData.ImagePublicId);

  const response = await api.put(`/Products/${id}`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return response.data;
};

export const deleteProduct = async (id) => {
  const response = await api.delete(`/Products/${id}`);
  return response.data;
};

export default {
  getAllProducts,
  getProductById,
  getProductsByCategory,
  searchProducts,
  createProduct,
  updateProduct,
  deleteProduct,
};
