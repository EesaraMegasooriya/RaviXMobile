import {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import axios from "axios";

const API_BASE_URL =
  import.meta.env.VITE_API_URL ||
  "http://localhost:5001/api";

const SERVER_BASE_URL = API_BASE_URL.replace(
  /\/api\/?$/,
  ""
);

const initialFormData = {
  brand: "",
  name: "",
  category: "",
  price: "",
  rating: "",
  badge: "",
  isActive: true,
};

const getProductImageUrl = (imagePath) => {
  if (!imagePath) {
    return "";
  }

  if (
    imagePath.startsWith("http://") ||
    imagePath.startsWith("https://") ||
    imagePath.startsWith("blob:")
  ) {
    return imagePath;
  }

  return `${SERVER_BASE_URL}${imagePath}`;
};

function AdminPanel() {
  const [adminToken, setAdminToken] = useState(
    localStorage.getItem("adminToken") || ""
  );

  const [loginData, setLoginData] = useState({
    email: "",
    password: "",
  });

  const [loginLoading, setLoginLoading] =
    useState(false);

  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);

  const [formData, setFormData] =
    useState(initialFormData);

  const [newCategoryName, setNewCategoryName] =
    useState("");

  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] =
    useState("");
  const [fileInputKey, setFileInputKey] =
    useState(0);

  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] =
    useState("");

  const [editingProductId, setEditingProductId] =
    useState(null);

  const [productsLoading, setProductsLoading] =
    useState(false);
  const [categoriesLoading, setCategoriesLoading] =
    useState(false);

  const [formSubmitting, setFormSubmitting] =
    useState(false);
  const [categorySubmitting, setCategorySubmitting] =
    useState(false);

  const [deletingProductId, setDeletingProductId] =
    useState(null);
  const [deletingCategoryId, setDeletingCategoryId] =
    useState(null);

  const [errorMessage, setErrorMessage] =
    useState("");
  const [successMessage, setSuccessMessage] =
    useState("");

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
    setImageFile(null);
    setImagePreview("");
    setCategoryFilter("");
    setSearchTerm("");
  }, []);

  const handleRequestError = useCallback(
    (error, fallbackMessage) => {
      console.error(error);

      if (error.response?.status === 401) {
        logoutAdmin();

        setErrorMessage(
          error.response?.data?.message ||
            "Your session has expired. Please log in again."
        );

        return;
      }

      setErrorMessage(
        error.response?.data?.message ||
          fallbackMessage
      );
    },
    [logoutAdmin]
  );

  const getAuthHeaders = useCallback(
    () => ({
      Authorization: `Bearer ${adminToken}`,
    }),
    [adminToken]
  );

  const fetchProducts = useCallback(async () => {
    if (!adminToken) {
      return;
    }

    try {
      setProductsLoading(true);
      setErrorMessage("");

      const response = await axios.get(
        `${API_BASE_URL}/admin/products`,
        {
          headers: getAuthHeaders(),
        }
      );

      setProducts(response.data.products || []);
    } catch (error) {
      handleRequestError(
        error,
        "Unable to load products. Check the backend connection."
      );
    } finally {
      setProductsLoading(false);
    }
  }, [
    adminToken,
    getAuthHeaders,
    handleRequestError,
  ]);

  const fetchCategories = useCallback(async () => {
    if (!adminToken) {
      return;
    }

    try {
      setCategoriesLoading(true);
      setErrorMessage("");

      const response = await axios.get(
        `${API_BASE_URL}/admin/categories`,
        {
          headers: getAuthHeaders(),
        }
      );

      setCategories(response.data.categories || []);
    } catch (error) {
      handleRequestError(
        error,
        "Unable to load categories."
      );
    } finally {
      setCategoriesLoading(false);
    }
  }, [
    adminToken,
    getAuthHeaders,
    handleRequestError,
  ]);

  const refreshData = useCallback(async () => {
    await Promise.all([
      fetchProducts(),
      fetchCategories(),
    ]);
  }, [fetchProducts, fetchCategories]);

  useEffect(() => {
    if (adminToken) {
      refreshData();
    }
  }, [adminToken, refreshData]);

  useEffect(() => {
    return () => {
      if (imagePreview.startsWith("blob:")) {
        URL.revokeObjectURL(imagePreview);
      }
    };
  }, [imagePreview]);

  const filteredProducts = useMemo(() => {
    const normalizedSearch = searchTerm
      .trim()
      .toLowerCase();

    return products.filter((product) => {
      const matchesCategory =
        !categoryFilter ||
        product.category === categoryFilter;

      if (!matchesCategory) {
        return false;
      }

      if (!normalizedSearch) {
        return true;
      }

      const searchableValues = [
        product.brand,
        product.name,
        product.category,
        product.badge,
        product.price,
        product.rating,
      ]
        .filter(
          (value) =>
            value !== null && value !== undefined
        )
        .join(" ")
        .toLowerCase();

      return searchableValues.includes(
        normalizedSearch
      );
    });
  }, [
    products,
    searchTerm,
    categoryFilter,
  ]);

  const handleLoginInputChange = (event) => {
    const { name, value } = event.target;

    setLoginData((currentData) => ({
      ...currentData,
      [name]: value,
    }));

    setErrorMessage("");
  };

  const handleLogin = async (event) => {
    event.preventDefault();

    if (
      !loginData.email.trim() ||
      !loginData.password
    ) {
      setErrorMessage(
        "Enter the admin email and password."
      );
      return;
    }

    try {
      setLoginLoading(true);
      clearMessages();

      const response = await axios.post(
        `${API_BASE_URL}/admin/login`,
        {
          email: loginData.email.trim(),
          password: loginData.password,
        }
      );

      const token = response.data.token;

      localStorage.setItem("adminToken", token);
      localStorage.setItem(
        "admin",
        JSON.stringify(response.data.admin)
      );

      setAdminToken(token);

      setLoginData({
        email: "",
        password: "",
      });
    } catch (error) {
      setErrorMessage(
        error.response?.data?.message ||
          "Unable to log in. Check the backend connection."
      );
    } finally {
      setLoginLoading(false);
    }
  };

  const handleInputChange = (event) => {
    const {
      name,
      value,
      checked,
      type,
    } = event.target;

    setFormData((currentData) => ({
      ...currentData,
      [name]:
        type === "checkbox" ? checked : value,
    }));

    clearMessages();
  };

  const handleImageChange = (event) => {
    const selectedFile = event.target.files?.[0];

    if (!selectedFile) {
      return;
    }

    const allowedTypes = [
      "image/jpeg",
      "image/png",
      "image/webp",
    ];

    if (!allowedTypes.includes(selectedFile.type)) {
      setErrorMessage(
        "Select a JPG, PNG or WEBP image."
      );

      event.target.value = "";
      return;
    }

    if (selectedFile.size > 5 * 1024 * 1024) {
      setErrorMessage(
        "The image must be smaller than 5 MB."
      );

      event.target.value = "";
      return;
    }

    if (imagePreview.startsWith("blob:")) {
      URL.revokeObjectURL(imagePreview);
    }

    setImageFile(selectedFile);
    setImagePreview(
      URL.createObjectURL(selectedFile)
    );

    clearMessages();
  };

  const resetForm = () => {
    if (imagePreview.startsWith("blob:")) {
      URL.revokeObjectURL(imagePreview);
    }

    setFormData(initialFormData);
    setImageFile(null);
    setImagePreview("");
    setEditingProductId(null);
    setFileInputKey(
      (currentKey) => currentKey + 1
    );

    clearMessages();
  };

  const validateForm = () => {
    if (!formData.brand.trim()) {
      return "Brand is required.";
    }

    if (!formData.name.trim()) {
      return "Product name is required.";
    }

    if (!formData.category) {
      return "Please select a category.";
    }

    if (
      formData.price === "" ||
      Number(formData.price) < 0
    ) {
      return "Enter a valid product price.";
    }

    if (
      formData.rating !== "" &&
      (Number(formData.rating) < 0 ||
        Number(formData.rating) > 5)
    ) {
      return "Rating must be between 0 and 5.";
    }

    if (!editingProductId && !imageFile) {
      return "Please select a product image.";
    }

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

    const productPayload = new FormData();

    productPayload.append(
      "brand",
      formData.brand.trim()
    );

    productPayload.append(
      "name",
      formData.name.trim()
    );

    productPayload.append(
      "category",
      formData.category
    );

    productPayload.append(
      "price",
      String(Number(formData.price))
    );

    productPayload.append(
      "rating",
      String(Number(formData.rating || 0))
    );

    productPayload.append(
      "badge",
      formData.badge
    );

    productPayload.append(
      "isActive",
      String(formData.isActive)
    );

    if (imageFile) {
      productPayload.append("img", imageFile);
    }

    try {
      setFormSubmitting(true);
      clearMessages();

      if (editingProductId) {
        const response = await axios.put(
          `${API_BASE_URL}/admin/products/${editingProductId}`,
          productPayload,
          {
            headers: getAuthHeaders(),
          }
        );

        setProducts((currentProducts) =>
          currentProducts.map((product) =>
            product._id === editingProductId
              ? response.data.product
              : product
          )
        );

        resetForm();

        setSuccessMessage(
          "Product updated successfully."
        );
      } else {
        const response = await axios.post(
          `${API_BASE_URL}/admin/products`,
          productPayload,
          {
            headers: getAuthHeaders(),
          }
        );

        setProducts((currentProducts) => [
          response.data.product,
          ...currentProducts,
        ]);

        resetForm();

        setSuccessMessage(
          "Product added successfully."
        );
      }

      await fetchCategories();
    } catch (error) {
      handleRequestError(
        error,
        "Unable to save the product."
      );
    } finally {
      setFormSubmitting(false);
    }
  };

  const handleEditProduct = (product) => {
    if (imagePreview.startsWith("blob:")) {
      URL.revokeObjectURL(imagePreview);
    }

    setEditingProductId(product._id);

    setFormData({
      brand: product.brand || "",
      name: product.name || "",
      category: product.category || "",
      price: product.price ?? "",
      rating: product.rating ?? "",
      badge: product.badge || "",
      isActive: product.isActive ?? true,
    });

    setImageFile(null);

    setImagePreview(
      getProductImageUrl(product.img)
    );

    setFileInputKey(
      (currentKey) => currentKey + 1
    );

    clearMessages();

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const handleDeleteProduct = async (product) => {
    const confirmed = window.confirm(
      `Delete "${product.name}"?`
    );

    if (!confirmed) {
      return;
    }

    try {
      setDeletingProductId(product._id);
      clearMessages();

      await axios.delete(
        `${API_BASE_URL}/admin/products/${product._id}`,
        {
          headers: getAuthHeaders(),
        }
      );

      setProducts((currentProducts) =>
        currentProducts.filter(
          (currentProduct) =>
            currentProduct._id !== product._id
        )
      );

      if (editingProductId === product._id) {
        resetForm();
      }

      await fetchCategories();

      setSuccessMessage(
        "Product deleted successfully."
      );
    } catch (error) {
      handleRequestError(
        error,
        "Unable to delete the product."
      );
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

      const response = await axios.post(
        `${API_BASE_URL}/admin/categories`,
        {
          name: categoryName,
        },
        {
          headers: getAuthHeaders(),
        }
      );

      setCategories((currentCategories) =>
        [
          ...currentCategories,
          response.data.category,
        ].sort((firstCategory, secondCategory) =>
          firstCategory.name.localeCompare(
            secondCategory.name
          )
        )
      );

      setNewCategoryName("");

      setSuccessMessage(
        "Category created successfully."
      );
    } catch (error) {
      handleRequestError(
        error,
        "Unable to create the category."
      );
    } finally {
      setCategorySubmitting(false);
    }
  };

  const handleDeleteCategory = async (
    category
  ) => {
    if (category.productCount > 0) {
      setErrorMessage(
        `Move or delete the ${category.productCount} product${
          category.productCount === 1 ? "" : "s"
        } in "${category.name}" before deleting this category.`
      );

      return;
    }

    const confirmed = window.confirm(
      `Delete the "${category.name}" category?`
    );

    if (!confirmed) {
      return;
    }

    try {
      setDeletingCategoryId(category._id);
      clearMessages();

      await axios.delete(
        `${API_BASE_URL}/admin/categories/${category._id}`,
        {
          headers: getAuthHeaders(),
        }
      );

      setCategories((currentCategories) =>
        currentCategories.filter(
          (currentCategory) =>
            currentCategory._id !== category._id
        )
      );

      if (formData.category === category.name) {
        setFormData((currentData) => ({
          ...currentData,
          category: "",
        }));
      }

      if (categoryFilter === category.name) {
        setCategoryFilter("");
      }

      setSuccessMessage(
        "Category deleted successfully."
      );
    } catch (error) {
      handleRequestError(
        error,
        "Unable to delete the category."
      );
    } finally {
      setDeletingCategoryId(null);
    }
  };

  if (!adminToken) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-100 px-4">
        <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-lg">
          <div className="mb-7 text-center">
            <p className="text-sm font-semibold uppercase tracking-widest text-blue-600">
              Administration
            </p>

            <h1 className="mt-2 text-3xl font-bold text-slate-900">
              Admin Login
            </h1>

            <p className="mt-2 text-sm text-slate-500">
              Log in to manage shop products and
              categories.
            </p>
          </div>

          {errorMessage && (
            <div className="mb-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {errorMessage}
            </div>
          )}

          <form
            onSubmit={handleLogin}
            className="space-y-5"
          >
            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-700">
                Email
              </label>

              <input
                type="email"
                name="email"
                autoComplete="username"
                value={loginData.email}
                onChange={handleLoginInputChange}
                placeholder="admin@shop.com"
                className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-700">
                Password
              </label>

              <input
                type="password"
                name="password"
                autoComplete="current-password"
                value={loginData.password}
                onChange={handleLoginInputChange}
                placeholder="Enter admin password"
                className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
              />
            </div>

            <button
              type="submit"
              disabled={loginLoading}
              className="w-full rounded-xl bg-blue-600 px-5 py-3 font-bold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loginLoading
                ? "Logging in..."
                : "Login"}
            </button>
          </form>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen mt-16 bg-slate-100 px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <section className="mb-8 rounded-2xl bg-slate-900 px-6 py-7 text-white shadow-lg">
          <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-center">
            <div>
              <p className="text-sm font-semibold uppercase tracking-widest text-blue-300">
                Shop Management
              </p>

              <h1 className="mt-2 text-3xl font-bold">
                Product Admin Panel
              </h1>

              <p className="mt-2 text-sm text-slate-300">
                Manage products, images and categories.
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              <button
                type="button"
                onClick={refreshData}
                disabled={
                  productsLoading || categoriesLoading
                }
                className="rounded-xl bg-white px-5 py-3 text-sm font-bold text-slate-900 transition hover:bg-slate-100 disabled:opacity-60"
              >
                {productsLoading || categoriesLoading
                  ? "Refreshing..."
                  : "Refresh"}
              </button>

              <button
                type="button"
                onClick={logoutAdmin}
                className="rounded-xl border border-slate-600 px-5 py-3 text-sm font-bold text-white transition hover:bg-slate-800"
              >
                Logout
              </button>
            </div>
          </div>
        </section>

        {errorMessage && (
          <div className="mb-6 rounded-xl border border-red-200 bg-red-50 px-5 py-4 text-sm font-medium text-red-700">
            {errorMessage}
          </div>
        )}

        {successMessage && (
          <div className="mb-6 rounded-xl border border-green-200 bg-green-50 px-5 py-4 text-sm font-medium text-green-700">
            {successMessage}
          </div>
        )}

        {/* Category management */}

        <section className="mb-8 rounded-2xl bg-white p-6 shadow-sm">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-wider text-blue-600">
                Product organization
              </p>

              <h2 className="mt-1 text-xl font-bold text-slate-900">
                Categories
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                Add new categories or remove unused
                categories.
              </p>
            </div>

            <form
              onSubmit={handleAddCategory}
              className="flex w-full max-w-lg flex-col gap-3 sm:flex-row"
            >
              <input
                type="text"
                value={newCategoryName}
                onChange={(event) => {
                  setNewCategoryName(
                    event.target.value
                  );
                  clearMessages();
                }}
                placeholder="Example: Earbuds"
                className="min-w-0 flex-1 rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
              />

              <button
                type="submit"
                disabled={categorySubmitting}
                className="rounded-xl bg-blue-600 px-5 py-3 text-sm font-bold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {categorySubmitting
                  ? "Adding..."
                  : "Add Category"}
              </button>
            </form>
          </div>

          <div className="mt-6 flex flex-wrap gap-3">
            {categoriesLoading ? (
              <p className="text-sm text-slate-500">
                Loading categories...
              </p>
            ) : categories.length === 0 ? (
              <p className="text-sm text-slate-500">
                No categories have been added yet.
              </p>
            ) : (
              categories.map((category) => (
                <div
                  key={category._id}
                  className="flex items-center gap-3 rounded-full border border-slate-200 bg-slate-50 py-2 pl-4 pr-2"
                >
                  <div>
                    <span className="text-sm font-semibold text-slate-700">
                      {category.name}
                    </span>

                    <span className="ml-2 text-xs text-slate-400">
                      {category.productCount || 0}
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={() =>
                      handleDeleteCategory(category)
                    }
                    disabled={
                      deletingCategoryId ===
                        category._id ||
                      category.productCount > 0
                    }
                    title={
                      category.productCount > 0
                        ? "Remove products from this category first"
                        : `Delete ${category.name}`
                    }
                    className="flex h-7 w-7 items-center justify-center rounded-full bg-red-100 text-sm font-bold text-red-600 transition hover:bg-red-200 disabled:cursor-not-allowed disabled:opacity-40"
                    aria-label={`Delete ${category.name}`}
                  >
                    {deletingCategoryId ===
                    category._id
                      ? "…"
                      : "×"}
                  </button>
                </div>
              ))
            )}
          </div>
        </section>

        <div className="grid gap-8 lg:grid-cols-[380px_minmax(0,1fr)]">
          {/* Product form */}

          <section className="h-fit rounded-2xl bg-white p-6 shadow-sm lg:sticky lg:top-6">
            <div className="mb-6 flex justify-between gap-4">
              <div>
                <h2 className="text-xl font-bold text-slate-900">
                  {editingProductId
                    ? "Update Product"
                    : "Add Product"}
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  Enter the product information.
                </p>
              </div>

              {editingProductId && (
                <button
                  type="button"
                  onClick={resetForm}
                  className="text-sm font-bold text-slate-500 hover:text-slate-900"
                >
                  Cancel
                </button>
              )}
            </div>

            <form
              onSubmit={handleSubmit}
              className="space-y-5"
            >
              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Brand
                </label>

                <input
                  name="brand"
                  value={formData.brand}
                  onChange={handleInputChange}
                  placeholder="ASPOR"
                  className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Product name
                </label>

                <input
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="ASPOR A628 TWS Wireless Earbuds"
                  className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Category
                </label>

                <select
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                >
                  <option value="">
                    Select a category
                  </option>

                  {categories.map((category) => (
                    <option
                      key={category._id}
                      value={category.name}
                    >
                      {category.name}
                    </option>
                  ))}
                </select>

                {categories.length === 0 && (
                  <p className="mt-2 text-xs font-medium text-amber-600">
                    Add a category before adding a
                    product.
                  </p>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="mb-2 block text-sm font-semibold text-slate-700">
                    Price (LKR)
                  </label>

                  <input
                    type="number"
                    name="price"
                    min="0"
                    step="0.01"
                    value={formData.price}
                    onChange={handleInputChange}
                    placeholder="3700"
                    className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-semibold text-slate-700">
                    Rating
                  </label>

                  <input
                    type="number"
                    name="rating"
                    min="0"
                    max="5"
                    step="0.1"
                    value={formData.rating}
                    onChange={handleInputChange}
                    placeholder="4.6"
                    className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                  />
                </div>
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Badge
                </label>

                <select
                  name="badge"
                  value={formData.badge}
                  onChange={handleInputChange}
                  className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                >
                  <option value="">No badge</option>
                  <option value="New">New</option>
                  <option value="Sale">Sale</option>
                  <option value="Hot">Hot</option>
                  <option value="Best Seller">
                    Best Seller
                  </option>
                </select>
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Product image
                </label>

                <input
                  key={fileInputKey}
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  onChange={handleImageChange}
                  className="block w-full rounded-xl border border-slate-300 p-3 text-sm"
                />

                {editingProductId && (
                  <p className="mt-2 text-xs text-slate-500">
                    Leave empty to keep the existing
                    image.
                  </p>
                )}
              </div>

              {imagePreview && (
                <div className="overflow-hidden rounded-xl border border-slate-200 bg-slate-50">
                  <img
                    src={imagePreview}
                    alt="Product preview"
                    className="h-48 w-full object-contain p-3"
                  />
                </div>
              )}

              <label className="flex cursor-pointer items-center gap-3 rounded-xl border border-slate-200 p-4">
                <input
                  type="checkbox"
                  name="isActive"
                  checked={formData.isActive}
                  onChange={handleInputChange}
                  className="h-4 w-4"
                />

                <span className="text-sm font-semibold text-slate-700">
                  Show this product in the shop
                </span>
              </label>

              <button
                type="submit"
                disabled={
                  formSubmitting ||
                  categories.length === 0
                }
                className="w-full rounded-xl bg-blue-600 px-5 py-3 font-bold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {formSubmitting
                  ? "Saving..."
                  : editingProductId
                    ? "Update Product"
                    : "Add Product"}
              </button>
            </form>
          </section>

          {/* Product listing */}

          <section className="min-w-0">
            <div className="mb-6 rounded-2xl bg-white p-5 shadow-sm">
              <div className="flex flex-col gap-4">
                <div>
                  <h2 className="text-xl font-bold text-slate-900">
                    All Products
                  </h2>

                  <p className="mt-1 text-sm text-slate-500">
                    {filteredProducts.length} product
                    {filteredProducts.length === 1
                      ? ""
                      : "s"}{" "}
                    found
                  </p>
                </div>

                <div className="grid gap-3 md:grid-cols-[minmax(0,1fr)_220px]">
                  <input
                    type="search"
                    value={searchTerm}
                    onChange={(event) =>
                      setSearchTerm(event.target.value)
                    }
                    placeholder="Search brand, name or category..."
                    className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                  />

                  <select
                    value={categoryFilter}
                    onChange={(event) =>
                      setCategoryFilter(
                        event.target.value
                      )
                    }
                    className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                  >
                    <option value="">
                      All categories
                    </option>

                    {categories.map((category) => (
                      <option
                        key={category._id}
                        value={category.name}
                      >
                        {category.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {productsLoading ? (
              <div className="rounded-2xl bg-white p-12 text-center shadow-sm">
                <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-slate-200 border-t-blue-600" />

                <p className="mt-4 text-sm font-medium text-slate-500">
                  Loading products...
                </p>
              </div>
            ) : filteredProducts.length === 0 ? (
              <div className="rounded-2xl bg-white p-12 text-center shadow-sm">
                <h3 className="text-lg font-bold text-slate-900">
                  No products found
                </h3>

                <p className="mt-2 text-sm text-slate-500">
                  Add a product or change the search
                  filters.
                </p>
              </div>
            ) : (
              <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
                {filteredProducts.map((product) => (
                  <article
                    key={product._id}
                    className="overflow-hidden rounded-2xl bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
                  >
                    <div className="relative h-52 bg-slate-100">
                      <img
                        src={getProductImageUrl(
                          product.img
                        )}
                        alt={product.name}
                        className="h-full w-full object-contain p-4"
                      />

                      {product.badge && (
                        <span className="absolute left-3 top-3 rounded-full bg-blue-600 px-3 py-1 text-xs font-bold text-white">
                          {product.badge}
                        </span>
                      )}

                      <span
                        className={`absolute right-3 top-3 rounded-full px-3 py-1 text-xs font-bold ${
                          product.isActive
                            ? "bg-green-100 text-green-700"
                            : "bg-red-100 text-red-700"
                        }`}
                      >
                        {product.isActive
                          ? "Active"
                          : "Inactive"}
                      </span>
                    </div>

                    <div className="p-5">
                      <p className="text-xs font-bold uppercase tracking-wider text-blue-600">
                        {product.brand}
                      </p>

                      <p className="mt-1 text-xs font-semibold text-slate-500">
                        {product.category ||
                          "No category"}
                      </p>

                      <h3 className="mt-2 min-h-12 font-bold text-slate-900">
                        {product.name}
                      </h3>

                      <div className="mt-4 flex items-end justify-between gap-4">
                        <div>
                          <p className="text-xs text-slate-500">
                            Price
                          </p>

                          <p className="text-lg font-extrabold text-slate-900">
                            LKR{" "}
                            {Number(
                              product.price || 0
                            ).toLocaleString()}
                          </p>
                        </div>

                        <p className="rounded-lg bg-amber-50 px-3 py-2 font-bold text-amber-600">
                          ★ {product.rating || 0}
                        </p>
                      </div>

                      <div className="mt-5 grid grid-cols-2 gap-3">
                        <button
                          type="button"
                          onClick={() =>
                            handleEditProduct(product)
                          }
                          className="rounded-xl bg-blue-50 px-4 py-3 font-bold text-blue-700 transition hover:bg-blue-100"
                        >
                          Edit
                        </button>

                        <button
                          type="button"
                          onClick={() =>
                            handleDeleteProduct(product)
                          }
                          disabled={
                            deletingProductId ===
                            product._id
                          }
                          className="rounded-xl bg-red-50 px-4 py-3 font-bold text-red-700 transition hover:bg-red-100 disabled:cursor-not-allowed disabled:opacity-60"
                        >
                          {deletingProductId ===
                          product._id
                            ? "Deleting..."
                            : "Delete"}
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