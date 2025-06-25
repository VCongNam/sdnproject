import React, {
  useEffect,
  useState,
  useCallback
} from "react";
import axios from "axios";
import ProductForm from "./ProductForm";
import "./ProductList.css";

export default function ProductList() {
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState("");
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");

  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [sort, setSort] = useState("");

  const [showForm, setShowForm] = useState(false);
  const [editProduct, setEditProduct] = useState(null);

  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // Fetch products from API
  const fetchProducts = useCallback(async () => {
    try {
      const params = {};
      if (search) params.search = search;
      if (selectedCategory) params.category = selectedCategory;
      // You can add minPrice, maxPrice, sort, page, etc. as needed

      const res = await axios.get("http://localhost:9999/api/products", { params });
      setProducts(res.data.products || []);
      // If you implement pagination in backend, set totalPages here
    } catch (err) {
      console.error("Failed to fetch products", err);
    }
  }, [search, selectedCategory]);

  // Fetch categories from API
  const fetchCategories = useCallback(async () => {
    try {
      const res = await axios.get("http://localhost:9999/api/categories");
      setCategories(res.data);
    } catch (err) {
      console.error("Failed to load categories", err);
    }
  }, []);

  const handleEdit = (product) => {
    setEditProduct(product);
    setShowForm(true);
  };

  const handleDelete = async (productId) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      // await axios.delete(`http://localhost:9999/api/products/${productId}`);
      fetchProducts();
    }
  };

  const handleAdd = () => {
    setEditProduct(null);
    setShowForm(true);
  };

  const handleSave = async(formData) => {
    if (editProduct) {
      if (formData.price < 0 || formData.stock < 0) {
        alert("Price must be a positive number and stock cannot be negative!");
        return;
      }
    } else {
      if (formData.price < 0 || formData.stock < 0) {
        alert("Price must be a positive number and stock cannot be negative!");
        return;
      }
      await axios.post("http://localhost:9999/api/products", formData);
    }
    fetchProducts();
  };

  const handleSearch = () => {
    setPage(1);
    fetchProducts();
  };

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, [fetchProducts, fetchCategories]);

  return (
    <div className="product-page">
      <h2>Product Management</h2>

      <div className="filter-bar">
        <input
          type="text"
          placeholder="Search by name..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
        >
          <option value="">All Categories</option>
          {categories.map((cat) => (
            <option key={cat._id} value={cat._id}>
              {cat.name}
            </option>
          ))}
        </select>

        <input
          type="number"
          placeholder="Min Prices"
          value={minPrice}
          onChange={(e) => setMinPrice(e.target.value)}
        />
        <input
          type="number"
          placeholder="Max Price"
          value={maxPrice}
          onChange={(e) => setMaxPrice(e.target.value)}
        />

        <select value={sort} onChange={(e) => setSort(e.target.value)}>
          <option value="">Sort by</option>
          <option value="price_asc">Giá tăng</option>
          <option value="price_desc">Giá giảm</option>
          <option value="stock_asc">Số sản phẩm tăng</option>
          <option value="stock_desc">Số sản phẩm giảm</option>
        </select>

        <button onClick={handleSearch}>Search</button>
        <button className="add-btn" onClick={handleAdd}>
          Add Product
        </button>
      </div>

      <div className="product-grid">
        {products.map((product) => (
          <div className="product-card" key={product._id}>
            <h3>{product.name}</h3>
            <p>{product.description}</p>
            <p>Price: {product.price?.toLocaleString()} VND</p>
            <p>Stock: {product.stock}</p>
            <div className="card-actions">
              <button onClick={() => handleEdit(product)}>Edit</button>
              <button onClick={() => handleDelete(product._id)}>Delete</button>
            </div>
          </div>
        ))}
      </div>

      <div className="pagination">
        <button
          onClick={() => setPage((p) => Math.max(p - 1, 1))}
          disabled={page === 1}
        >
          Previous
        </button>

        {[...Array(totalPages)].map((_, i) => (
          <button
            key={i}
            className={page === i + 1 ? "active" : ""}
            onClick={() => setPage(i + 1)}
          >
            {i + 1}
          </button>
        ))}

        <button
          onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
          disabled={page === totalPages}
        >
          Next
        </button>
      </div>

      {showForm && (
        <ProductForm
          initialData={editProduct}
          onClose={() => setShowForm(false)}
          onSave={handleSave}
        />
      )}
    </div>
  );
}
