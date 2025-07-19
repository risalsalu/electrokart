import React, { useEffect, useState } from "react";
import axios from "axios";

import { Trash2 } from "lucide-react";
import { toast } from "react-toastify";

const ProductManagement = () => {
  const [products, setProducts] = useState([]);

  // Fetch products from JSON server
  const fetchProducts = async () => {
    try {
      const res = await axios.get("http://localhost:3002/products");
      setProducts(res.data);
    } catch (error) {
      console.error("Failed to fetch products:", error);
      toast.error("Error fetching products.");
    }
  };

  // Delete product
  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:3002/products/${id}`);
      toast.success("Product deleted successfully!");
      fetchProducts(); // refresh list
    } catch (error) {
      console.error("Failed to delete:", error);
      toast.error("Error deleting product.");
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  return (
    <>
      <h2 className="text-2xl font-bold mb-4">Manage Products</h2>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white rounded-lg shadow">
          <thead className="bg-gray-100">
            <tr>
              <th className="py-2 px-4 text-left">Name</th>
              <th className="py-2 px-4 text-left">Price</th>
              <th className="py-2 px-4 text-left">Stock</th>
              <th className="py-2 px-4 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.length > 0 ? (
              products.map((product) => (
                <tr key={product.id} className="border-b">
                  <td className="py-2 px-4">{product.name}</td>
                  <td className="py-2 px-4">${product.price}</td>
                  <td className="py-2 px-4">{product.stock || 0}</td>
                  <td className="py-2 px-4">
                    <button
                      onClick={() => handleDelete(product.id)}
                      className="text-red-500 hover:text-red-700 flex items-center gap-1"
                    >
                      <Trash2 size={16} />
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4" className="py-4 text-center text-gray-500">
                  No products found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </>
  );
};

export default ProductManagement;
