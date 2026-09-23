import ProductPrice, { Availability } from "../components/ProductPrice";
import HeroSettings from "../components/HeroSettings";
import Reviews from "../components/Reviews";
import ProductImage from "../components/ProductImage";
import { useCallback, useEffect, useMemo, useState } from "react";
import axios from "axios";
import { API_BASE_URL, getProductImageUrl } from "../lib/api";

const SURFACE = "border border-white/[0.06] bg-[#0B0F16]";
const RADIUS = "rounded-2xl";
const INPUT = "w-full rounded-xl border border-white/10 bg-black/30 px-4 py-3 text-sm text-white outline-none placeholder:text-gray-600 focus:border-cyan-400/50";
const LABEL = "mb-2 block text-sm font-medium text-gray-300";

const initialFormData = {
  brand: "",
  name: "",
  category: "",
  price: "",
  salePrice: "",
  availability: "in_stock",
  description: "",
  rating: "",
  badge: "",
  img: "",
  isActive: true,
};

function AdminPanel() {
  const [adminToken, setAdminToken] = useState(localStorage.getItem("adminToken") || "");

  const [loginData, setLoginData] = useState({ email: "", password: "" });
  const [loginLoading, setLoginLoading] = useState(false);

  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);

  const [formData, setFormData] = useState(initialFormData);
  const [newCategoryName, setNewCategoryName] = useState("");

  const imagePreview = getProductImageUrl(formData.img);

  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");

  const [editingProductId, setEditingProductId] = useState(null);

  const [productsLoading, setProductsLoading] = useState(false);
  const [categoriesLoading, setCategoriesLoading] = useState(false);

  const [formSubmitting, setFormSubmitting] = useState(false);
  const [categorySubmitting, setCategorySubmitting] = useState(false);

  const [deletingProductId, setDeletingProductId] = useState(null);
  const [deletingCategoryId, setDeletingCategoryId] = useState(null);

  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const clearMessages = () => {
    setErrorMessage("");
    setSuccessMessage("");
  };

  const logoutAdmin = useCallback(() => {
    localStorage.removeItem("adminToken");
    localStorage.removeItem("admin");

    setAdminToken("");
    setProducts([]);
    setCategories([]);
    setEditingProductId(null);
    setFormData(initialFormData);
    setCategoryFilter("");
    setSearchTerm("");
  }, []);

  const handleRequestError = useCallback(
    (error, fallbackMessage) => {
      console.error(error);

      if (error.response?.status === 401) {
        logoutAdmin();
        setErrorMessage(error.response?.data?.message || "Your session has expired. Please log in again.");
        return;
      }

      setErrorMessage(error.response?.data?.message || fallbackMessage);
    },
    [logoutAdmin]
  );

  const getAuthHeaders = useCallback(() => ({ Authorization: `Bearer ${adminToken}` }), [adminToken]);

  const fetchProducts = useCallback(async () => {
    if (!adminToken) return;

    try {
      setProductsLoading(true);
      setErrorMessage("");

      const response = await axios.get(`${API_BASE_URL}/admin/products`, { headers: getAuthHeaders() });
      setProducts(response.data.products || []);
    } catch (error) {
      handleRequestError(error, "Something went wrong. Please try again or contact RaviX Mobile for help.");
    } finally {
      setProductsLoading(false);
    }
  }, [adminToken, getAuthHeaders, handleRequestError]);

  const fetchCategories = useCallback(async () => {
    if (!adminToken) return;

    try {
      setCategoriesLoading(true);
      setErrorMessage("");

      const response = await axios.get(`${API_BASE_URL}/admin/categories`, { headers: getAuthHeaders() });
      setCategories(response.data.categories || []);
    } catch (error) {
      handleRequestError(error, "Unable to load categories.");
    } finally {
      setCategoriesLoading(false);
    }
  }, [adminToken, getAuthHeaders, handleRequestError]);

  const refreshData = useCallback(async () => {
    await Promise.all([fetchProducts(), fetchCategories()]);
  }, [fetchProducts, fetchCategories]);

  useEffect(() => {
    if (adminToken) {
      // Initial API synchronization also sets the loading indicators.
      // eslint-disable-next-line react-hooks/set-state-in-effect
      refreshData();
    }
  }, [adminToken, refreshData]);

  const filteredProducts = useMemo(() => {
    const normalizedSearch = searchTerm.trim().toLowerCase();

    return products.filter((product) => {
      const matchesCategory = !categoryFilter || product.category === categoryFilter;
      if (!matchesCategory) return false;
      if (!normalizedSearch) return true;

      const searchableValues = [product.brand, product.name, product.category, product.badge, product.price, product.rating]
        .filter((value) => value !== null && value !== undefined)
        .join(" ")
        .toLowerCase();

      return searchableValues.includes(normalizedSearch);
    });
  }, [products, searchTerm, categoryFilter]);

  const handleLoginInputChange = (event) => {
    const { name, value } = event.target;
    setLoginData((currentData) => ({ ...currentData, [name]: value }));
    setErrorMessage("");
  };

  const handleLogin = async (event) => {
    event.preventDefault();

    if (!loginData.email.trim() || !loginData.password) {
      setErrorMessage("Enter the admin email and password.");
      return;
    }

    try {
      setLoginLoading(true);
      clearMessages();

      const response = await axios.post(`${API_BASE_URL}/admin/login`, {
        email: loginData.email.trim(),
        password: loginData.password,
      });

      const token = response.data.token;

      localStorage.setItem("adminToken", token);
      localStorage.setItem("admin", JSON.stringify(response.data.admin));

      setAdminToken(token);
      setLoginData({ email: "", password: "" });
    } catch (error) {
      setErrorMessage(error.response?.data?.message || "Something went wrong. Please try again or contact RaviX Mobile for help.");
    } finally {
      setLoginLoading(false);
    }
  };

  const handleInputChange = (event) => {
    const { name, value, checked, type } = event.target;
    setFormData((currentData) => ({ ...currentData, [name]: type === "checkbox" ? checked : value }));
    clearMessages();
  };

  const resetForm = () => {
    setFormData(initialFormData);
    setEditingProductId(null);
    clearMessages();
  };

  const validateForm = () => {
    if (!formData.brand.trim()) return "Brand is required.";
    if (!formData.name.trim()) return "Product name is required.";
    if (!formData.category) return "Please select a category.";
    if (formData.price === "" || !Number.isFinite(Number(formData.price)) || Number(formData.price) < 0) {
      return "Enter a valid product price.";
    }
    if (formData.rating !== "" && (!Number.isFinite(Number(formData.rating)) || Number(formData.rating) < 0 || Number(formData.rating) > 5)) {
      return "Rating must be between 0 and 5.";
    }
    if (formData.salePrice !== "" && (!Number.isFinite(Number(formData.salePrice)) || Number(formData.salePrice) < 0 || Number(formData.salePrice) >= Number(formData.price))) {
      return "Sale price must be lower than the regular price.";
    }
    if (!getProductImageUrl(formData.img)) return "Enter a valid HTTP or HTTPS image link.";
    return null;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const validationError = validateForm();
    if (validationError) {
      setErrorMessage(validationError);
      setSuccessMessage("");
      return;
    }

    const productPayload = {
      ...formData,
      brand: formData.brand.trim(),
      name: formData.name.trim(),
      img: formData.img.trim(),
      price: Number(formData.price),
      salePrice: formData.salePrice === "" ? null : Number(formData.salePrice),
      rating: Number(formData.rating || 0),
    };

    try {
      setFormSubmitting(true);
      clearMessages();

      if (editingProductId) {
        const response = await axios.put(`${API_BASE_URL}/admin/products/${editingProductId}`, productPayload, {
          headers: getAuthHeaders(),
        });

        setProducts((currentProducts) =>
          currentProducts.map((product) => (product._id === editingProductId ? response.data.product : product))
        );

        resetForm();
        setSuccessMessage("Product updated successfully.");
      } else {
        const response = await axios.post(`${API_BASE_URL}/admin/products`, productPayload, { headers: getAuthHeaders() });

        setProducts((currentProducts) => [response.data.product, ...currentProducts]);

        resetForm();
        setSuccessMessage("Product added successfully.");
      }

      await fetchCategories();
    } catch (error) {
      handleRequestError(error, "Unable to save the product.");
    } finally {
      setFormSubmitting(false);
    }
  };

  const handleEditProduct = (product) => {
    setEditingProductId(product._id);

    setFormData({
      brand: product.brand || "",
      name: product.name || "",
      category: product.category || "",
      price: product.price ?? "",
      salePrice: product.salePrice ?? "",
      availability: product.availability || "in_stock",
      description: product.description || "",
      rating: product.rating ?? "",
      badge: product.badge || "",
      img: product.img || "",
      isActive: product.isActive ?? true,
    });

    clearMessages();
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDeleteProduct = async (product) => {
    const confirmed = window.confirm(`Delete "${product.name}"?`);
    if (!confirmed) return;

    try {
      setDeletingProductId(product._id);
      clearMessages();

      await axios.delete(`${API_BASE_URL}/admin/products/${product._id}`, { headers: getAuthHeaders() });

      setProducts((currentProducts) => currentProducts.filter((currentProduct) => currentProduct._id !== product._id));

      if (editingProductId === product._id) resetForm();

      await fetchCategories();
      setSuccessMessage("Product deleted successfully.");
    } catch (error) {
      handleRequestError(error, "Unable to delete the product.");
    } finally {
      setDeletingProductId(null);
    }
  };

  const handleAddCategory = async (event) => {
    event.preventDefault();

    const categoryName = newCategoryName.trim();
    if (!categoryName) {
      setErrorMessage("Enter a category name.");
      return;
    }

    try {
      setCategorySubmitting(true);
      clearMessages();

      const response = await axios.post(`${API_BASE_URL}/admin/categories`, { name: categoryName }, { headers: getAuthHeaders() });

      setCategories((currentCategories) =>
        [...currentCategories, response.data.category].sort((firstCategory, secondCategory) =>
          firstCategory.name.localeCompare(secondCategory.name)
        )
      );

      setNewCategoryName("");
      setSuccessMessage("Category created successfully.");
    } catch (error) {
      handleRequestError(error, "Unable to create the category.");
    } finally {
      setCategorySubmitting(false);
    }
  };

  const handleDeleteCategory = async (category) => {
    if (category.productCount > 0) {
      setErrorMessage(
        `Move or delete the ${category.productCount} product${category.productCount === 1 ? "" : "s"} in "${category.name}" before deleting this category.`
      );
      return;
    }

    const confirmed = window.confirm(`Delete the "${category.name}" category?`);
    if (!confirmed) return;

    try {
      setDeletingCategoryId(category._id);
      clearMessages();

      await axios.delete(`${API_BASE_URL}/admin/categories/${category._id}`, { headers: getAuthHeaders() });

      setCategories((currentCategories) => currentCategories.filter((currentCategory) => currentCategory._id !== category._id));

      if (formData.category === category.name) {
        setFormData((currentData) => ({ ...currentData, category: "" }));
      }

      if (categoryFilter === category.name) setCategoryFilter("");

      setSuccessMessage("Category deleted successfully.");
    } catch (error) {
      handleRequestError(error, "Unable to delete the category.");
    } finally {
      setDeletingCategoryId(null);
    }
  };

  if (!adminToken) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#05080B] px-4 text-white">
        <div className={`w-full max-w-md p-8 ${RADIUS} ${SURFACE}`}>
          <div className="mb-7 text-center">
            <h1 className="text-2xl font-bold">Admin login</h1>
            <p className="mt-2 text-sm text-gray-400">Log in to manage shop products and categories.</p>
          </div>

          {errorMessage && (
            <div className="mb-5 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-300">
              {errorMessage}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <label className={LABEL}>Email</label>
              <input
                type="email"
                aria-label="Email"
                name="email"
                autoComplete="username"
                value={loginData.email}
                onChange={handleLoginInputChange}
                placeholder="admin@shop.com"
                className={INPUT}
              />
            </div>

            <div>
              <label className={LABEL}>Password</label>
              <input
                type="password"
                aria-label="Password"
                name="password"
                autoComplete="current-password"
                value={loginData.password}
                onChange={handleLoginInputChange}
                placeholder="Enter admin password"
                className={INPUT}
              />
            </div>

            <button
              type="submit"
              disabled={loginLoading}
              className="w-full rounded-full bg-cyan-400 px-5 py-3 font-semibold text-black transition hover:bg-cyan-300 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loginLoading ? "Logging in…" : "Login"}
            </button>
          </form>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#05080B] px-4 pb-16 pt-28 text-white sm:px-6 md:pt-32 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <section className={`mb-8 px-6 py-7 ${RADIUS} ${SURFACE}`}>
          <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-center">
            <div>
              <h1 className="text-2xl font-bold">Product admin panel</h1>
              <p className="mt-2 text-sm text-gray-400">Manage products, images and categories.</p>
            </div>

            <div className="flex flex-wrap gap-3">
              <button
                type="button"
                onClick={refreshData}
                disabled={productsLoading || categoriesLoading}
                className="rounded-full border border-white/10 px-5 py-2.5 text-sm font-medium text-gray-300 transition hover:border-cyan-400/40 hover:text-cyan-300 disabled:opacity-60"
              >
                {productsLoading || categoriesLoading ? "Refreshing…" : "Refresh"}
              </button>

              <button
                type="button"
                onClick={logoutAdmin}
                className="rounded-full border border-white/10 px-5 py-2.5 text-sm font-medium text-gray-300 transition hover:border-red-400/40 hover:text-red-300"
              >
                Logout
              </button>
            </div>
          </div>
        </section>

        {errorMessage && (
          <div role="alert" className="mb-6 rounded-xl border border-red-500/30 bg-red-500/10 px-5 py-4 text-sm font-medium text-red-300">
            {errorMessage}
          </div>
        )}

        {successMessage && (
          <div role="status" className="mb-6 rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-5 py-4 text-sm font-medium text-emerald-300">
            {successMessage}
          </div>
        )}

        <HeroSettings adminToken={adminToken} onAuthError={handleRequestError} />
        <Reviews adminToken={adminToken} onAuthError={handleRequestError} />

        {/* Category management */}
        <section className={`mb-8 p-6 ${RADIUS} ${SURFACE}`}>
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <h2 className="text-lg font-bold">Categories</h2>
              <p className="mt-1 text-sm text-gray-500">Add new categories or remove unused categories.</p>
            </div>

            <form onSubmit={handleAddCategory} className="flex w-full max-w-lg flex-col gap-3 sm:flex-row">
              <input
                type="text"
                value={newCategoryName}
                onChange={(event) => {
                  setNewCategoryName(event.target.value);
                  clearMessages();
                }}
                placeholder="Example: Earbuds"
                className={`min-w-0 flex-1 ${INPUT}`}
              />

              <button
                type="submit"
                disabled={categorySubmitting}
                className="rounded-full bg-cyan-400 px-5 py-3 text-sm font-semibold text-black transition hover:bg-cyan-300 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {categorySubmitting ? "Adding…" : "Add category"}
              </button>
            </form>
          </div>

          <div className="mt-6 flex flex-wrap gap-3">
            {categoriesLoading ? (
              <p className="text-sm text-gray-500">Loading categories…</p>
            ) : categories.length === 0 ? (
              <p className="text-sm text-gray-500">No categories have been added yet.</p>
            ) : (
              categories.map((category) => (
                <div key={category._id} className="flex items-center gap-3 rounded-full border border-white/10 bg-white/[0.03] py-2 pl-4 pr-2">
                  <div>
                    <span className="text-sm font-medium text-gray-300">{category.name}</span>
                    <span className="ml-2 text-xs text-gray-500">{category.productCount || 0}</span>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleDeleteCategory(category)}
                    disabled={deletingCategoryId === category._id || category.productCount > 0}
                    title={category.productCount > 0 ? "Remove products from this category first" : `Delete ${category.name}`}
                    className="flex h-7 w-7 items-center justify-center rounded-full bg-red-500/10 text-sm font-bold text-red-300 transition hover:bg-red-500/20 disabled:cursor-not-allowed disabled:opacity-40"
                    aria-label={`Delete ${category.name}`}
                  >
                    {deletingCategoryId === category._id ? "…" : "×"}
                  </button>
                </div>
              ))
            )}
          </div>
        </section>

        <div className="grid gap-8 lg:grid-cols-[380px_minmax(0,1fr)]">
          {/* Product form */}
          <section className={`h-fit p-6 ${RADIUS} ${SURFACE} lg:sticky lg:top-6`}>
            <div className="mb-6 flex justify-between gap-4">
              <div>
                <h2 className="text-lg font-bold">{editingProductId ? "Update product" : "Add product"}</h2>
                <p className="mt-1 text-sm text-gray-500">Enter the product information.</p>
              </div>

              {editingProductId && (
                <button type="button" onClick={resetForm} className="text-sm font-medium text-gray-500 hover:text-white">
                  Cancel
                </button>
              )}
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className={LABEL}>Brand</label>
                <input aria-label="Brand" name="brand" value={formData.brand} onChange={handleInputChange} placeholder="ASPOR" className={INPUT} />
              </div>

              <div>
                <label className={LABEL}>Product name</label>
                <input
                  aria-label="Product name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="ASPOR A628 TWS Wireless Earbuds"
                  className={INPUT}
                />
              </div>

              <div>
                <label className={LABEL}>Category</label>
                <select aria-label="Category" name="category" value={formData.category} onChange={handleInputChange} className={INPUT}>
                  <option value="">Select a category</option>
                  {categories.map((category) => (
                    <option key={category._id} value={category.name}>
                      {category.name}
                    </option>
                  ))}
                </select>

                {categories.length === 0 && (
                  <p className="mt-2 text-xs font-medium text-amber-400">Add a category before adding a product.</p>
                )}
              </div>

              <div>
                <label className={LABEL}>Description / specifications</label>
                <textarea
                  aria-label="Description / specifications"
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  maxLength={3000}
                  rows={4}
                  className={INPUT}
                  placeholder="Features, compatibility, included accessories…"
                />
              </div>

              <div>
                <label className={LABEL}>Availability</label>
                <select aria-label="Availability" name="availability" value={formData.availability} onChange={handleInputChange} className={INPUT}>
                  <option value="in_stock">In stock</option>
                  <option value="out_of_stock">Out of stock</option>
                  <option value="pre_order">Pre-order</option>
                </select>
              </div>

              <div>
                <label className={LABEL}>Sale price (LKR, optional)</label>
                <input
                  type="number"
                  name="salePrice"
                  value={formData.salePrice}
                  onChange={handleInputChange}
                  min="0"
                  step="0.01"
                  className={INPUT}
                  placeholder="Leave empty for no discount"
                />
                <p className="mt-2 text-xs text-gray-500">Keep the regular price below. Clear the sale price to remove the discount.</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className={LABEL}>Price (LKR)</label>
                  <input
                    type="number"
                    aria-label="Price"
                    name="price"
                    min="0"
                    step="0.01"
                    value={formData.price}
                    onChange={handleInputChange}
                    placeholder="3700"
                    className={INPUT}
                  />
                </div>

                <div>
                  <label className={LABEL}>Rating</label>
                  <input
                    type="number"
                    aria-label="Rating"
                    name="rating"
                    min="0"
                    max="5"
                    step="0.1"
                    value={formData.rating}
                    onChange={handleInputChange}
                    placeholder="4.6"
                    className={INPUT}
                  />
                </div>
              </div>

              <div>
                <label className={LABEL}>Badge</label>
                <select aria-label="Badge" name="badge" value={formData.badge} onChange={handleInputChange} className={INPUT}>
                  <option value="">No badge</option>
                  <option value="New">New</option>
                  <option value="Sale">Sale</option>
                  <option value="Hot">Hot</option>
                  <option value="Best Seller">Best Seller</option>
                </select>
              </div>

              <div>
                <label className={LABEL}>Product image direct link</label>
                <input
                  type="url"
                  aria-label="Product image direct link"
                  name="img"
                  required
                  value={formData.img}
                  placeholder="https://example.com/product.jpg"
                  onChange={handleInputChange}
                  className={INPUT}
                />

                {editingProductId && <p className="mt-2 text-xs text-gray-500">Edit the link to replace the existing image.</p>}
              </div>

              {imagePreview && (
                <div className="overflow-hidden rounded-xl border border-white/10 bg-black/30">
                  <ProductImage src={imagePreview} alt="Product preview" className="h-48 w-full object-contain p-3" />
                </div>
              )}

              <label className="flex cursor-pointer items-center gap-3 rounded-xl border border-white/10 p-4">
                <input
                  type="checkbox"
                  name="isActive"
                  checked={formData.isActive}
                  onChange={handleInputChange}
                  className="h-4 w-4 accent-cyan-400"
                />
                <span className="text-sm font-medium text-gray-300">Show this product in the shop</span>
              </label>

              <button
                type="submit"
                disabled={formSubmitting || categories.length === 0}
                className="w-full rounded-full bg-cyan-400 px-5 py-3 font-semibold text-black transition hover:bg-cyan-300 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {formSubmitting ? "Saving…" : editingProductId ? "Update product" : "Add product"}
              </button>
            </form>
          </section>

          {/* Product listing */}
          <section className="min-w-0">
            <div className={`mb-6 p-5 ${RADIUS} ${SURFACE}`}>
              <div className="flex flex-col gap-4">
                <div>
                  <h2 className="text-lg font-bold">All products</h2>
                  <p className="mt-1 text-sm text-gray-500">
                    {filteredProducts.length} product{filteredProducts.length === 1 ? "" : "s"} found
                  </p>
                </div>

                <div className="grid gap-3 md:grid-cols-[minmax(0,1fr)_220px]">
                  <input
                    type="search"
                    value={searchTerm}
                    onChange={(event) => setSearchTerm(event.target.value)}
                    placeholder="Search brand, name or category…"
                    className={INPUT}
                  />

                  <select value={categoryFilter} onChange={(event) => setCategoryFilter(event.target.value)} className={INPUT}>
                    <option value="">All categories</option>
                    {categories.map((category) => (
                      <option key={category._id} value={category.name}>
                        {category.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {productsLoading ? (
              <div className={`p-12 text-center ${RADIUS} ${SURFACE}`}>
                <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-white/10 border-t-cyan-400" />
                <p className="mt-4 text-sm font-medium text-gray-500">Loading products…</p>
              </div>
            ) : filteredProducts.length === 0 ? (
              <div className={`p-12 text-center ${RADIUS} ${SURFACE}`}>
                <h3 className="text-lg font-bold">No products found</h3>
                <p className="mt-2 text-sm text-gray-500">Add a product or change the search filters.</p>
              </div>
            ) : (
              <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
                {filteredProducts.map((product) => (
                  <article key={product._id} className={`flex h-full min-w-0 flex-col overflow-hidden ${RADIUS} ${SURFACE} transition hover:border-cyan-400/30`}>
                    <div className="relative h-52 shrink-0 bg-black">
                      <ProductImage src={getProductImageUrl(product.img)} alt={product.name} className="h-full w-full object-contain p-4" />

                      {product.badge && (
                        <span className="absolute left-3 top-3 rounded-full bg-cyan-400 px-3 py-1 text-xs font-bold text-black">{product.badge}</span>
                      )}

                      <span
                        className={`absolute right-3 top-3 rounded-full px-3 py-1 text-xs font-bold ${
                          product.isActive ? "bg-emerald-500/15 text-emerald-300" : "bg-red-500/15 text-red-300"
                        }`}
                      >
                        {product.isActive ? "Active" : "Inactive"}
                      </span>
                    </div>

                    <div className="flex min-w-0 flex-1 flex-col p-5">
                      <p className="text-sm font-medium text-cyan-300">{product.brand}</p>
                      <p className="mt-0.5 text-xs text-gray-500">{product.category || "No category"}</p>
                      <h3 className="mt-2 min-h-11 break-words font-semibold leading-snug">{product.name}</h3>

                      <div className="mt-4 flex items-end justify-between gap-4">
                        <div>
                          <p className="text-xs text-gray-500">Price</p>
                          <ProductPrice product={product} />
                          <div className="mt-2">
                            <Availability product={product} />
                          </div>
                        </div>

                        <p className="rounded-lg bg-amber-400/10 px-3 py-2 font-semibold text-amber-300">★ {product.rating || 0}</p>
                      </div>

                      <div className="mt-auto grid grid-cols-2 gap-3 pt-5">
                        <button
                          type="button"
                          onClick={() => handleEditProduct(product)}
                          className="rounded-lg bg-cyan-400/10 px-4 py-2.5 text-sm font-semibold text-cyan-300 transition hover:bg-cyan-400/20"
                        >
                          Edit
                        </button>

                        <button
                          type="button"
                          onClick={() => handleDeleteProduct(product)}
                          disabled={deletingProductId === product._id}
                          className="rounded-lg bg-red-500/10 px-4 py-2.5 text-sm font-semibold text-red-300 transition hover:bg-red-500/20 disabled:cursor-not-allowed disabled:opacity-60"
                        >
                          {deletingProductId === product._id ? "Deleting…" : "Delete"}
                        </button>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            )}
          </section>
        </div>
      </div>
    </main>
  );
}

export default AdminPanel;