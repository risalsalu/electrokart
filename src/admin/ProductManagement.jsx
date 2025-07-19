import React, { useEffect, useState } from "react";
import axios from "axios";
import { 
  Trash2, 
  Edit, 
  Plus, 
  Search, 
  ChevronDown,
  Image as ImageIcon
} from "lucide-react";
import { toast } from "react-toastify";

const ProductManagement = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    price: "",
    category: "",
    stock: "",
    image: "",
    brand: "",
    color: "",
    discount: ""
  });

  // Fetch products from API
  const fetchProducts = async () => {
    try {
      setLoading(true);
      const res = await axios.get("http://localhost:3002/products");
      setProducts(res.data);
    } catch (error) {
      console.error("Failed to fetch products:", error);
      toast.error("Failed to load products");
    } finally {
      setLoading(false);
    }
  };

  // Delete product
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this product?")) return;
    
    try {
      await axios.delete(`http://localhost:3002/products/${id}`);
      toast.success("Product deleted successfully");
      fetchProducts();
    } catch (error) {
      console.error("Failed to delete product:", error);
      toast.error("Failed to delete product");
    }
  };

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Submit product form
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      if (editingProduct) {
        // Update existing product
        await axios.put(`http://localhost:3002/products/${editingProduct.id}`, formData);
        toast.success("Product updated successfully");
      } else {
        // Create new product
        await axios.post("http://localhost:3002/products", formData);
        toast.success("Product added successfully");
      }
      
      fetchProducts();
      setShowForm(false);
      setEditingProduct(null);
      setFormData({
        name: "",
        price: "",
        category: "",
        stock: "",
        image: "",
        brand: "",
        color: "",
        discount: ""
      });
    } catch (error) {
      console.error("Form submission error:", error);
      toast.error("Error saving product");
    }
  };

  // Open edit form with product data
  const openEditForm = (product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      price: product.price,
      category: product.category || "",
      stock: product.stock || "",
      image: product.image || "",
      brand: product.brand || "",
      color: product.color || "",
      discount: product.discount || ""
    });
    setShowForm(true);
  };

  // Open empty add form
  const openAddForm = () => {
    setEditingProduct(null);
    setFormData({
      name: "",
      price: "",
      category: "",
      stock: "",
      image: "",
      brand: "",
      color: "",
      discount: ""
    });
    setShowForm(true);
  };

  // Filter products based on search term
  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.category?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.brand?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  useEffect(() => {
    fetchProducts();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <div>
            <h2 className="text-2xl md:text-3xl font-bold text-gray-800">Product Management</h2>
            <p className="text-gray-600 mt-1">Manage your product inventory</p>
          </div>
          <button
            onClick={openAddForm}
            className="mt-4 md:mt-0 px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors flex items-center gap-2"
          >
            <Plus className="w-5 h-5" />
            Add Product
          </button>
        </div>

        {/* Search and Filters */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="md:col-span-2">
              <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-1">Search Products</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  id="search"
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  placeholder="Search by name, brand or category"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
            <div>
              <label htmlFor="category-filter" className="block text-sm font-medium text-gray-700 mb-1">Filter by Category</label>
              <select
                id="category-filter"
                className="block w-full pl-3 pr-10 py-2 text-base border border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                onChange={(e) => setSearchTerm(e.target.value)}
                value={searchTerm}
              >
                <option value="">All Categories</option>
                <option value="mobile">Mobile</option>
                <option value="tv">TV</option>
                <option value="laptops">Laptops</option>
                <option value="headphones">Headphones</option>
              </select>
            </div>
          </div>
        </div>

        {/* Products Table */}
        <div className="bg-white shadow overflow-hidden sm:rounded-lg">
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
            </div>
          ) : filteredProducts.length === 0 ? (
            <div className="bg-white rounded-lg shadow-md p-8 text-center">
              <ImageIcon className="h-16 w-16 mx-auto text-gray-400" />
              <h3 className="mt-4 text-lg font-medium text-gray-900">No products found</h3>
              <p className="mt-1 text-sm text-gray-500">
                {searchTerm ? "Try adjusting your search criteria" : "There are currently no products in your inventory"}
              </p>
              <button
                onClick={openAddForm}
                className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors"
              >
                Add Your First Product
              </button>
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Product
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Brand
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Category
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Price
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Stock
                      </th>
                      <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredProducts.map((product) => (
                      <tr key={product.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="flex-shrink-0 h-10 w-10">
                              {product.image ? (
                                <img className="h-10 w-10 rounded-md object-cover" src={product.image} alt={product.name} />
                              ) : (
                                <div className="h-10 w-10 rounded-md bg-gray-200 flex items-center justify-center text-gray-500">
                                  <ImageIcon className="h-5 w-5" />
                                </div>
                              )}
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900">{product.name}</div>
                              {product.color && (
                                <div className="text-xs text-gray-500">Color: {product.color}</div>
                              )}
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {product.brand || '-'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                            {product.category || 'Uncategorized'}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">
                            ${product.price}
                            {product.discount && (
                              <span className="ml-2 text-xs text-green-600">
                                ({product.discount}% off)
                              </span>
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                              ${product.stock > 10 ? 'bg-green-100 text-green-800' : 
                                product.stock > 0 ? 'bg-yellow-100 text-yellow-800' : 
                                'bg-red-100 text-red-800'}`}>
                              {product.stock || 0}
                            </span>
                            <button 
                              onClick={() => {
                                const newStock = prompt("Enter new stock quantity:", product.stock || 0);
                                if (newStock !== null && !isNaN(newStock)) {
                                  handleInputChange({ target: { name: 'stock', value: newStock } });
                                  axios.patch(`http://localhost:3002/products/${product.id}`, { stock: newStock })
                                    .then(() => {
                                      toast.success("Stock updated successfully");
                                      fetchProducts();
                                    })
                                    .catch(error => {
                                      console.error("Failed to update stock:", error);
                                      toast.error("Failed to update stock");
                                    });
                                }
                              }}
                              className="ml-2 text-xs text-indigo-600 hover:text-indigo-900"
                            >
                              Edit
                            </button>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <div className="flex justify-end space-x-2">
                            <button
                              onClick={() => openEditForm(product)}
                              className="text-indigo-600 hover:text-indigo-900 bg-indigo-50 px-3 py-1 rounded-md hover:bg-indigo-100 transition-colors"
                              title="Edit product"
                            >
                              <Edit className="h-4 w-4" />
                            </button>
                            <button
                              onClick={() => handleDelete(product.id)}
                              className="text-red-600 hover:text-red-900 bg-red-50 px-3 py-1 rounded-md hover:bg-red-100 transition-colors"
                              title="Delete product"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
                <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                  <div>
                    <p className="text-sm text-gray-700">
                      Showing <span className="font-medium">1</span> to <span className="font-medium">{filteredProducts.length}</span> of{' '}
                      <span className="font-medium">{filteredProducts.length}</span> products
                    </p>
                  </div>
                  <div>
                    <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                      <a
                        href="#"
                        className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
                      >
                        <span className="sr-only">Previous</span>
                        <ChevronDown className="h-5 w-5 transform rotate-90" />
                      </a>
                      <a
                        href="#"
                        aria-current="page"
                        className="z-10 bg-indigo-50 border-indigo-500 text-indigo-600 relative inline-flex items-center px-4 py-2 border text-sm font-medium"
                      >
                        1
                      </a>
                      <a
                        href="#"
                        className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
                      >
                        <span className="sr-only">Next</span>
                        <ChevronDown className="h-5 w-5 transform -rotate-90" />
                      </a>
                    </nav>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Product Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50 p-4">
          <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-2xl">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-semibold text-gray-800">
                {editingProduct ? "Edit Product" : "Add New Product"}
              </h3>
              <button
                onClick={() => {
                  setShowForm(false);
                  setEditingProduct(null);
                }}
                className="text-gray-400 hover:text-gray-500"
              >
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">Product Name *</label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    className="w-full border border-gray-300 px-4 py-2 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div>
                  <label htmlFor="brand" className="block text-sm font-medium text-gray-700 mb-1">Brand *</label>
                  <input
                    type="text"
                    id="brand"
                    name="brand"
                    className="w-full border border-gray-300 px-4 py-2 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                    value={formData.brand}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div>
                  <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-1">Price *</label>
                  <input
                    type="number"
                    id="price"
                    name="price"
                    min="0"
                    step="0.01"
                    className="w-full border border-gray-300 px-4 py-2 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                    value={formData.price}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div>
                  <label htmlFor="discount" className="block text-sm font-medium text-gray-700 mb-1">Discount (%)</label>
                  <input
                    type="number"
                    id="discount"
                    name="discount"
                    min="0"
                    max="100"
                    className="w-full border border-gray-300 px-4 py-2 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                    value={formData.discount}
                    onChange={handleInputChange}
                  />
                </div>
                <div>
                  <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">Category *</label>
                  <select
                    id="category"
                    name="category"
                    className="w-full border border-gray-300 px-4 py-2 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                    value={formData.category}
                    onChange={handleInputChange}
                    required
                  >
                    <option value="">Select a category</option>
                    <option value="mobile">Mobile</option>
                    <option value="tv">TV</option>
                    <option value="laptops">Laptops</option>
                    <option value="headphones">Headphones</option>
                  </select>
                </div>
                <div>
                  <label htmlFor="stock" className="block text-sm font-medium text-gray-700 mb-1">Stock Quantity *</label>
                  <input
                    type="number"
                    id="stock"
                    name="stock"
                    min="0"
                    className="w-full border border-gray-300 px-4 py-2 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                    value={formData.stock}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div>
                  <label htmlFor="color" className="block text-sm font-medium text-gray-700 mb-1">Color</label>
                  <input
                    type="text"
                    id="color"
                    name="color"
                    className="w-full border border-gray-300 px-4 py-2 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                    value={formData.color}
                    onChange={handleInputChange}
                  />
                </div>
                <div>
                  <label htmlFor="image" className="block text-sm font-medium text-gray-700 mb-1">Image URL *</label>
                  <input
                    type="text"
                    id="image"
                    name="image"
                    className="w-full border border-gray-300 px-4 py-2 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                    value={formData.image}
                    onChange={handleInputChange}
                    placeholder="https://example.com/image.jpg"
                    required
                  />
                </div>
              </div>
              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setShowForm(false);
                    setEditingProduct(null);
                  }}
                  className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  {editingProduct ? "Update Product" : "Add Product"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductManagement;