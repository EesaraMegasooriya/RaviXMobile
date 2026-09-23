import { lazy, Suspense } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./App.css";

import Header from "./components/Header";
const Home = lazy(() => import("./pages/Home"));
import Footer from "./components/Footer";
const About = lazy(() => import("./pages/About"));
const ShopNot = lazy(() => import("./pages/ShopNot"));
const ProductDetails = lazy(() => import("./pages/ProductDetails"));
const Shop = lazy(() => import("./pages/Shop"));
const Categories = lazy(() => import("./pages/Categories"));
const Contact = lazy(() => import("./pages/Contact"));

const AdminPanel = lazy(() => import("./pages/AdminPanel"));

function App() {
  return (
    <BrowserRouter>
      <Header />

      <Suspense fallback={<main className="min-h-screen bg-[#05080B] pt-40 text-center text-white" role="status">Loading...</main>}>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/products/:id" element={<ProductDetails />} />
        <Route path="/shop" element={<Shop />} />
        <Route path="/categories" element={<Categories />} />
        <Route path="*" element={<ShopNot />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/admin" element={<AdminPanel />} />



      </Routes>
      </Suspense>

      <Footer />
    </BrowserRouter>
  );
}

export default App;