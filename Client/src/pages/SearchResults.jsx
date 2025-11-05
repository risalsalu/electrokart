import React, { useState, useEffect, useContext } from "react";
import { useLocation, Link, useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import { Heart } from "lucide-react";
import { useWishlist } from "../contexttemp/WishlistContext";
import { useCart } from "../contexttemp/CartContext";
import { AuthContext } from "../contexttemp/AuthContext";
import api from "../services/api";

const SearchResults = () => {
  const [products, setProducts] = useState([]);
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [modalImage, setModalImage] = useState(null);
  const { wishlist, addToWishlist, removeFromWishlist } = useWishlist();
  const { addToCart } = useCart();
  const { isLoggedIn } = useContext(AuthContext);
  const location = useLocation();
  const navigate = useNavigate();

  const searchParams = new URLSearchParams(location.search);
  const query = searchParams.get("q")?.trim() || "";

  useEffect(() => {
    if (!query) {
      navigate("/products");
      return;
    }

    const fetchResults = async () => {
      try {
        setLoading(true);
        setError(null);
        const res = await api.get("/Products");
        const data = res.data?.data || res.data;
        const filtered = (Array.isArray(data) ? data : []).filter(
          (p) =>
            p.name?.toLowerCase().includes(query.toLowerCase()) ||
            p.description?.toLowerCase().includes(query.toLowerCase()) ||
            p.categoryName?.toLowerCase().includes(query.toLowerCase())
        );
        setProducts(filtered);
        if (filtered.length === 0) {
          const fallbackCategories = ["mobile", "laptop", "tv", "headphones"];
          const fallbackResponses = await Promise.all(
            fallbackCategories.map(async (cat) => {
              const res = await api.get(`/Products/category/${cat}`);
              return res.data.slice(0, 2);
            })
          );
          const fallbackProducts = fallbackResponses.flat();
          setSuggestions(fallbackProducts);
        }
      } catch {
        setError("Failed to load search results. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchResults();
  }, [query, navigate]);

  const handleAddToCart = (p) => {
    if (!isLoggedIn) return toast.error("Please log in to add products.");
    addToCart(p);
  };

  const toggleWishlist = (p) => {
    if (!isLoggedIn) return toast.error("Please log in to use wishlist.");
    const exists = wishlist.some((i) => i.productId === p.id || i.id === p.id);
    exists ? removeFromWishlist(p.id) : addToWishlist(p);
  };

  const renderCard = (p) => {
    const isWishlisted = wishlist.some(
      (i) => i.productId === p.id || i.id === p.id
    );
    return (
      <div
        key={p.id}
        className="relative border rounded-xl overflow-hidden shadow hover:shadow-lg transition"
      >
        <button
          onClick={() => toggleWishlist(p)}
          className="absolute top-3 right-3 bg-white rounded-full p-1.5 shadow hover:scale-110 transition"
        >
          <Heart
            size={22}
            className={
              isWishlisted ? "text-red-500 fill-red-500" : "text-gray-500"
            }
          />
        </button>
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
            onError={(e) => (e.target.src = "/images/placeholder.jpg")}
          />
        </div>
        <div className="p-4">
          <Link to={`/products/${p.id}`}>
            <h3 className="font-semibold text-lg mb-1 hover:text-blue-600">
              {p.name}
            </h3>
          </Link>
          <p className="text-gray-600 mb-2">₹{Number(p.price).toFixed(2)}</p>
          <button
            onClick={() => handleAddToCart(p)}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
          >
            Add to Cart
          </button>
        </div>
      </div>
    );
  };

  if (loading)
    return <p className="text-center py-12">Loading search results...</p>;
  if (error)
    return <p className="text-center py-12 text-red-600">{error}</p>;

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">
        {products.length} result{products.length !== 1 && "s"} for "{query}"
      </h1>
      {products.length === 0 ? (
        <div className="text-center py-12">
          <img src="/no-results.png" className="mx-auto w-40 mb-4" alt="No results" />
          <h3 className="text-xl font-medium">No products found</h3>
          <p className="text-gray-500">Try keywords like "laptop", "tv", or "mobile"</p>
          {suggestions.length > 0 && (
            <>
              <h4 className="text-lg font-semibold mt-8 mb-4">You may like:</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {suggestions.map(renderCard)}
              </div>
            </>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {products.map(renderCard)}
        </div>
      )}
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

export default SearchResults;
