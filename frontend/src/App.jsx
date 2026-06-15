import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./App.css";

import Header from "./components/Header";
import Home from "./pages/Home";
import Footer from "./components/Footer";
import About from "./pages/About";
import ShopNot from "./pages/ShopNot";
import Shop from "./pages/Shop";
import Categories from "./pages/Categories";
import Contact from "./pages/Contact";

import AdminPanel from "./pages/AdminPanel";

function App() {
  return (
    <BrowserRouter>
      <Header />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/shop" element={<Shop />} />
        <Route path="/categories" element={<Categories />} />
        <Route path="*" element={<ShopNot />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/admin" element={<AdminPanel />} />



      </Routes>

      <Footer />
    </BrowserRouter>
  );
}

export default App;