import api from "./api";

export const getAllProducts = async () => {
  try {
    const response = await api.get("/Products");
    return response.data;
  } catch (error) {
    if (error.response) throw new Error(error.response.data.message || "Failed to fetch products");
    else throw new Error("Network error");
  }
};

export const getProductById = async (id) => {
  try {
    const response = await api.get(`/Products/${id}`);
    return response.data;
  } catch (error) {
    if (error.response) throw new Error(error.response.data.message || "Failed to fetch product");
    else throw new Error("Network error");
  }
};

export const getProductsByCategory = async (categoryId) => {
  try {
    const response = await api.get(`/Products/category/${categoryId}`);
    return response.data;
  } catch (error) {
    if (error.response) throw new Error(error.response.data.message || "Failed to fetch products by category");
    else throw new Error("Network error");
  }
};

export const searchProducts = async (query) => {
  try {
    const response = await api.get(`/Products/search`, { params: { query } });
    return response.data;
  } catch (error) {
    if (error.response) throw new Error(error.response.data.message || "Search failed");
    else throw new Error("Network error");
  }
};

export const createProduct = async (productData) => {
  try {
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
  } catch (error) {
    if (error.response) throw new Error(error.response.data.message || "Failed to create product");
    else throw new Error("Network error");
  }
};

export const updateProduct = async (id, productData) => {
  try {
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
  } catch (error) {
    if (error.response) throw new Error(error.response.data.message || "Failed to update product");
    else throw new Error("Network error");
  }
};

export const deleteProduct = async (id) => {
  try {
    const response = await api.delete(`/Products/${id}`);
    return response.data;
  } catch (error) {
    if (error.response) throw new Error(error.response.data.message || "Failed to delete product");
    else throw new Error("Network error");
  }
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
