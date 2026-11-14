import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { CartProvider } from "./context/CartContext";
import Home from "./pages/Home";
import Products from "./pages/Products";
import Cart from "./pages/Cart";
import Login from "./pages/Login";
import ProductDetails from "./pages/ProductDetails";
import SellerRegister from "./pages/SellerRegister";
import Checkout from "./pages/Checkout";
import CategoryPage from "./pages/CategoryPage";
import Orders from "./pages/Orders";
import Founders from "./pages/Founders";
import LaptopsMonitors from "./pages/LaptopsMonitors";
import ACInstallation from "./pages/ACInstallation";
import Exchange from "./pages/Exchange";

export default function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/products" element={<Products />} />
            <Route path="/product/:slug" element={<ProductDetails />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/orders" element={<Orders />} />
            <Route path="/founders" element={<Founders />} />
            <Route path="/login" element={<Login />} />
            <Route path="/seller/register" element={<SellerRegister />} />
            <Route path="/category/:category" element={<CategoryPage />} />
            <Route path="/laptops-monitors" element={<LaptopsMonitors />} />
            <Route path="/ac-installation" element={<ACInstallation />} />
            <Route path="/exchange" element={<Exchange />} />
          </Routes>
        </BrowserRouter>
      </CartProvider>
    </AuthProvider>
  );
}
