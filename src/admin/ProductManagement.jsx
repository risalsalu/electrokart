import React, { useEffect, useState } from "react";
import axios from "axios";
import {Trash2,Edit,Plus,Search,ChevronLeft, ChevronRight,Image as ImageIcon} from "lucide-react";
import { Toaster, toast } from 'react-hot-toast';

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

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10); 

  // Custom Modal States
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [confirmModalData, setConfirmModalData] = useState({ id: null, title: "", message: "", onConfirm: () => {} });

  const [showPromptModal, setShowPromptModal] = useState(false);
  const [promptModalData, setPromptModalData] = useState({ product: null, defaultValue: 0, title: "", message: "", onConfirm: () => {} });


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

  // Handle delete confirmation
  const handleDeleteClick = (id) => {
    setConfirmModalData({
      id: id,
      title: "Delete Product",
      message: "Are you sure you want to delete this product? This action cannot be undone.",
      onConfirm: () => handleDelete(id),
    });
    setShowConfirmModal(true);
  };

  // Delete product
  const handleDelete = async (id) => {
    setShowConfirmModal(false); // Close modal after confirmation
    try {
      await axios.delete(`http://localhost:3002/products/${id}`);
      toast.success("Product deleted successfully");
      fetchProducts();
    } catch (error) {
      console.error("Failed to delete product:", error);
      toast.error("Failed to delete product");
    }
  };

  // Handle stock update prompt
  const handleStockEditClick = (product) => {
    setPromptModalData({
      product: product,
      defaultValue: product.stock || 0,
      title: "Update Stock Quantity",
      message: `Enter new stock quantity for ${product.name}:`,
      onConfirm: (newStock) => handleStockUpdate(product.id, newStock),
    });
    setShowPromptModal(true);
  };

  // Update stock quantity
  const handleStockUpdate = async (id, newStock) => {
    setShowPromptModal(false); // Close modal after confirmation
    const parsedStock = parseInt(newStock, 10);

    if (isNaN(parsedStock) || parsedStock < 0) {
      toast.error("Invalid stock quantity. Please enter a non-negative number.");
      return;
    }

    try {
      await axios.patch(`http://localhost:3002/products/${id}`, { stock: parsedStock });
      toast.success("Stock updated successfully");
      fetchProducts();
    } catch (error) {
      console.error("Failed to update stock:", error);
      toast.error("Failed to update stock");
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
    if (!formData.name || !formData.price || !formData.category || !formData.stock || !formData.brand || !formData.image) {
      toast.error("Please fill in all required fields (marked with *)");
      return;
    }
    if (isNaN(formData.price) || parseFloat(formData.price) < 0) {
      toast.error("Price must be a non-negative number.");
      return;
    }
    if (isNaN(formData.stock) || parseInt(formData.stock) < 0) {
      toast.error("Stock must be a non-negative integer.");
      return;
    }
    if (formData.discount && (isNaN(formData.discount) || parseFloat(formData.discount) < 0 || parseFloat(formData.discount) > 100)) {
        toast.error("Discount must be a number between 0 and 100.");
        return;
    }

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

  // Pagination Logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredProducts.slice(indexOfFirstItem, indexOfLastItem);

  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);

  const paginate = (pageNumber) => {
    if (pageNumber < 1 || pageNumber > totalPages) return; // Prevent invalid page numbers
    setCurrentPage(pageNumber);
  };

  useEffect(() => {
    fetchProducts();
  }, []);
  const ConfirmModal = ({ show, title, message, onConfirm, onCancel }) => {
  if (!show) return null;

  return (
<div className="fixed inset-0 bg-white/10 backdrop-blur-md flex items-center justify-center z-50 p-4 font-sans">
      <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-sm">
        <h3 className="text-lg font-semibold text-gray-900 mb-3">{title}</h3>
        <p className="text-gray-700 mb-6">{message}</p>
        <div className="flex justify-end space-x-3">
          <button
            onClick={onCancel}
            className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors"
          >
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
};

// Custom Prompt Modal Component
const PromptModal = ({ show, title, message, defaultValue, onConfirm, onCancel }) => {
  const [inputValue, setInputValue] = useState(defaultValue);

  useEffect(() => {
    setInputValue(defaultValue); // Reset input value when defaultValue changes
  }, [defaultValue]);

  if (!show) return null;

  return (
<div className="fixed inset-0 bg-white/10 backdrop-blur-md flex items-center justify-center z-50 p-4 font-sans">
      <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-sm">
        <h3 className="text-lg font-semibold text-gray-900 mb-3">{title}</h3>
        <p className="text-gray-700 mb-4">{message}</p>
        <input
          type="number"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          className="w-full border border-gray-300 px-4 py-2 rounded-md focus:ring-indigo-500 focus:border-indigo-500 mb-6"
          min="0"
          required
        />
        <div className="flex justify-end space-x-3">
          <button
            onClick={onCancel}
            className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={() => onConfirm(inputValue)}
            className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
          >
            Update
          </button>
        </div>
      </div>
    </div>
  );
};

  return (
    <div className="min-h-screen bg-gray-50 p-6 font-sans">
     <Toaster position="top-center"/>
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <div>
            <h2 className="text-2xl md:text-3xl font-bold text-gray-800">Product Management</h2>
            <p className="text-gray-600 mt-1">Manage your product inventory</p>
          </div>
          <button
            onClick={openAddForm}
            className="mt-4 md:mt-0 px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors flex items-center gap-2 shadow-md"
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
                  onChange={(e) => {
                    setSearchTerm(e.target.value);
                    setCurrentPage(1); // Reset to first page on search
                  }}
                />
              </div>
            </div>
            <div>
              <label htmlFor="category-filter" className="block text-sm font-medium text-gray-700 mb-1">Filter by Category</label>
              <select
                id="category-filter"
                className="block w-full pl-3 pr-10 py-2 text-base border border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                onChange={(e) => {
                  setSearchTerm(e.target.value); // Use search term for category filter too
                  setCurrentPage(1); // Reset to first page on filter change
                }}
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
                {searchTerm ? "Try adjusting your search criteria or clear the search" : "There are currently no products in your inventory"}
              </p>
              <button
                onClick={openAddForm}
                className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors shadow-sm"
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
                    {currentItems.map((product) => (
                      <tr key={product.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="flex-shrink-0 h-10 w-10">
                              {product.image ? (
                                <img
                                  className="h-10 w-10 rounded-md object-cover"
                                  src={product.image}
                                  alt={product.name}
                                  onError={(e) => { e.target.onerror = null; e.target.src = `https://placehold.co/40x40/cbd5e1/475569?text=No+Image`; }}
                                />
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
                            ${parseFloat(product.price).toFixed(2)}
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
                              onClick={() => handleStockEditClick(product)}
                              className="ml-2 text-xs text-indigo-600 hover:text-indigo-900 font-medium"
                            >
                              Edit
                            </button>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <div className="flex justify-end space-x-2">
                            <button
                              onClick={() => openEditForm(product)}
                              className="text-indigo-600 hover:text-indigo-900 bg-indigo-50 px-3 py-1 rounded-md hover:bg-indigo-100 transition-colors shadow-sm"
                              title="Edit product"
                            >
                              <Edit className="h-4 w-4" />
                            </button>
                            <button
                              onClick={() => handleDeleteClick(product.id)}
                              className="text-red-600 hover:text-red-900 bg-red-50 px-3 py-1 rounded-md hover:bg-red-100 transition-colors shadow-sm"
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
                <div className="flex-1 flex justify-between sm:hidden">
                  <button
                    onClick={() => paginate(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Previous
                  </button>
                  <button
                    onClick={() => paginate(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Next
                  </button>
                </div>
                <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                  <div>
                    <p className="text-sm text-gray-700">
                      Showing <span className="font-medium">{indexOfFirstItem + 1}</span> to <span className="font-medium">{Math.min(indexOfLastItem, filteredProducts.length)}</span> of{' '}
                      <span className="font-medium">{filteredProducts.length}</span> products
                    </p>
                  </div>
                  <div>
                    <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                      <button
                        onClick={() => paginate(currentPage - 1)}
                        disabled={currentPage === 1}
                        className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <span className="sr-only">Previous</span>
                        <ChevronLeft className="h-5 w-5" />
                      </button>
                      {Array.from({ length: totalPages }, (_, i) => (
                        <button
                          key={i + 1}
                          onClick={() => paginate(i + 1)}
                          aria-current={currentPage === i + 1 ? "page" : undefined}
                          className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium
                            ${currentPage === i + 1 ? 'z-10 bg-indigo-50 border-indigo-500 text-indigo-600' : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'}`}
                        >
                          {i + 1}
                        </button>
                      ))}
                      <button
                        onClick={() => paginate(currentPage + 1)}
                        disabled={currentPage === totalPages}
                        className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <span className="sr-only">Next</span>
                        <ChevronRight className="h-5 w-5" />
                      </button>
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
      <div className="fixed inset-0 bg-white/10 backdrop-blur-md flex items-center justify-center z-50 p-4 font-sans">
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
                className="text-gray-400 hover:text-gray-500 p-1 rounded-full hover:bg-gray-100 transition-colors"
              >
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">Product Name <span className="text-red-500">*</span></label>
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
                  <label htmlFor="brand" className="block text-sm font-medium text-gray-700 mb-1">Brand <span className="text-red-500">*</span></label>
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
                  <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-1">Price <span className="text-red-500">*</span></label>
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
                  <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">Category <span className="text-red-500">*</span></label>
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
                  <label htmlFor="stock" className="block text-sm font-medium text-gray-700 mb-1">Stock Quantity <span className="text-red-500">*</span></label>
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
                  <label htmlFor="image" className="block text-sm font-medium text-gray-700 mb-1">Image URL <span className="text-red-500">*</span></label>
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
                  className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors shadow-sm"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
                >
                  {editingProduct ? "Update Product" : "Add Product"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Render Custom Modals */}
      <ConfirmModal
        show={showConfirmModal}
        title={confirmModalData.title}
        message={confirmModalData.message}
        onConfirm={confirmModalData.onConfirm}
        onCancel={() => setShowConfirmModal(false)}
      />

      <PromptModal
        show={showPromptModal}
        title={promptModalData.title}
        message={promptModalData.message}
        defaultValue={promptModalData.defaultValue}
        onConfirm={promptModalData.onConfirm}
        onCancel={() => setShowPromptModal(false)}
      />
    </div>
  );
};

export default ProductManagement;
