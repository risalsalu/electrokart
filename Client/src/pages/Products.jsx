import React, { useState, useEffect, useContext } from "react";
import { useLocation, Link } from "react-router-dom";
import { toast } from "react-hot-toast";
import { Heart } from "lucide-react";
import { useWishlist } from "../contexttemp/WishlistContext";
import { useCart } from "../contexttemp/CartContext";
import { AuthContext } from "../contexttemp/AuthContext";
import api from "../services/api";

const Products = () => {
  const [products, setProducts] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [category, setCategory] = useState("all");
  const [sort, setSort] = useState("none");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [modalImage, setModalImage] = useState(null);

  const { wishlist, addToWishlist, removeFromWishlist } = useWishlist();
  const { addToCart } = useCart();
  const { isLoggedIn } = useContext(AuthContext);
  const location = useLocation();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const res = await api.get("/Products");
        const data = res.data?.data || res.data;
        setProducts(Array.isArray(data) ? data : []);
      } catch {
        setError("Failed to load products.");
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const cat = params.get("category");
    if (cat) setCategory(cat.toLowerCase());
  }, [location.search]);

  useEffect(() => {
    let data = [...products];
    if (category !== "all") {
      data = data.filter((p) => p.categoryName?.toLowerCase() === category);
    }
    if (sort === "high") data.sort((a, b) => b.price - a.price);
    if (sort === "low") data.sort((a, b) => a.price - b.price);
    setFiltered(data);
  }, [category, products, sort]);

  const handleAddToCart = (p) => {
    if (!isLoggedIn) return toast.error("Please log in to add products.");
    addToCart(p);
  };

  const toggleWishlist = (p) => {
    if (!isLoggedIn) return toast.error("Please log in to use wishlist.");
    const exists = wishlist.some((i) => i.productId === p.id || i.id === p.id);
    exists ? removeFromWishlist(p.id) : addToWishlist(p);
  };

  if (loading)
    return <p className="text-center py-12">Loading products...</p>;
  if (error)
    return <p className="text-center py-12 text-red-600">{error}</p>;

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Our Products</h1>

      <div className="flex flex-wrap justify-between items-center mb-6 gap-4">
        <div className="flex flex-wrap gap-3">
          {["all", "mobile", "laptop", "tv", "headphones"].map((key) => (
            <button
              key={key}
              onClick={() => setCategory(key)}
              className={`px-4 py-2 rounded-full ${
                category === key
                  ? "bg-blue-600 text-white"
                  : "bg-gray-200 text-gray-800 hover:bg-gray-300"
              }`}
            >
              {key === "all"
                ? "All Products"
                : key.charAt(0).toUpperCase() + key.slice(1)}
            </button>
          ))}
        </div>

        <select
          value={sort}
          onChange={(e) => setSort(e.target.value)}
          className="border px-3 py-2 rounded-md"
        >
          <option value="none">Sort by</option>
          <option value="high">Price: High to Low</option>
          <option value="low">Price: Low to High</option>
        </select>
      </div>

      {/* Product Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {filtered.length ? (
          filtered.map((p) => {
            const isWishlisted = wishlist.some(
              (i) => i.productId === p.id || i.id === p.id
            );
            return (
              <div
                key={p.id}
                className="relative border rounded-xl overflow-hidden shadow hover:shadow-lg transition"
              >
                {/* Wishlist Heart */}
                <button
                  onClick={() => toggleWishlist(p)}
                  className="absolute top-3 right-3 bg-white rounded-full p-1.5 shadow hover:scale-110 transition"
                >
                  <Heart
                    size={22}
                    className={
                      isWishlisted
                        ? "text-red-500 fill-red-500"
                        : "text-gray-500"
                    }
                  />
                </button>

                {/* Product Image */}
                <div
                  className="h-48 bg-gray-100 flex items-center justify-center cursor-pointer"
                  onClick={() =>
                    setModalImage(p.imageUrl || "/images/placeholder.jpg")
                  }
                >
                  <img
                    src={p.imageUrl || "/images/placeholder.jpg"}
                    alt={p.name}
                    className="h-full object-contain"
                    onError={(e) =>
                      (e.target.src = "/images/placeholder.jpg")
                    }
                  />
                </div>

                {/* Product Details */}
                <div className="p-4">
                  <Link to={`/products/${p.id}`}>
                    <h3 className="font-semibold text-lg mb-1 hover:text-blue-600">
                      {p.name}
                    </h3>
                  </Link>
                  <p className="text-gray-600 mb-2">
                    ₹{Number(p.price).toFixed(2)}
                  </p>
                  <button
                    onClick={() => handleAddToCart(p)}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
                  >
                    Add to Cart
                  </button>
                </div>
              </div>
            );
          })
        ) : (
          <div className="col-span-full text-center py-12">
            <p className="text-gray-600">No products found.</p>
          </div>
        )}
      </div>

      {/* Image Modal */}
      {modalImage && (
        <div
          className="fixed inset-0 bg-black/40 flex items-center justify-center z-50"
          onClick={() => setModalImage(null)}
        >
          <div
            className="bg-white p-4 rounded-xl shadow-2xl max-w-[90%] max-h-[90%]"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={modalImage}
              alt="Preview"
              className="max-h-[70vh] max-w-full object-contain"
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default Products;
