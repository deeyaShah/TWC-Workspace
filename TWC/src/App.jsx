import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import 'slick-carousel/slick/slick.css'; 
import 'slick-carousel/slick/slick-theme.css';
import "@fortawesome/fontawesome-free/css/all.min.css";
import { CartProvider } from './context/cartContext';

import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import AboutComponent from './pages/AboutComponent';
import ContactComponent from './pages/ContactComponent';
import ProductList from './pages/ProductList';
import AdminDashboard from './components/Admin/AdminDashboard';
import Login from './components/Login';
import Signup from './components/Signup';
import OtpVerification from './components/OtpVerification';
import AdminHomePage from './pages/AdminHomePage';
import UserManagement from './components/Admin/UserManagement';
import ProductManagement from './components/Admin/ProductManagement';
import ProductDetail from './components/ProductDetail';
// <<<<<<< Updated upstream
import Wishlist from './components/Wishlist';
import Cart from './components/Cart';
import Checkout from './components/Checkout';
import ModularFurniture from './components/ModularFurniture';
import ModularKitchen from './components/ModularKitchen';
import SlotBookingForm from './components/SlotBookingForm';
// =======
import OrderManagement from './components/Admin/OrderManagement';
import BlogSection from './components/Admin/BlogSection';
import KitchenService from './components/Admin/KitchenService';
import ReviewManagement from './components/Admin/ReviewManagement';
import BlogList from './pages/BlogList';
import BlogPost from './pages/BlogPost';
import CategoryFurniture from './components/Admin/CategoryFurniture';
import CategoryProductList from './components/Admin/CategoryProductList';
import SearchResults from './components/SearchResults';
import InvoiceForm from './components/InvoiceForm';
import KitchenManagement from './components/Admin/KitchenManagement';
import PaymentPage from './components/PaymentPage';
import OrderConfirmationPage from './components/OrderConfirmationPage';
import OrderHistory from './pages/OrderHistory ';
import ForgotPassword from './components/ForgotPassword';
import ResetPassword from './components/ResetPassword';
import VerifyOtp from './components/VerifyOtp';
// >>>>>>> Stashed changes

const AppContent = () => {
  const location = useLocation();
  
  // Check if the current route is an admin route
  const isAdminRoute = location.pathname.startsWith("/admin");

  return (
    <>
    <div className="min-h-screen flex flex-col">
      {!isAdminRoute && <Navbar />}
      <div className="flex-grow">
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Home />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route path='/verify-otp' element={<OtpVerification/>}/>
        <Route path='/forgot-password' element={<ForgotPassword/>}/>
        <Route path='/otp-verify' element={<VerifyOtp/>}/>
        <Route path='/reset-password' element={<ResetPassword/>}/>
        <Route path='/furniture' element={< ModularFurniture/>}/>
        <Route path='/kitchen' element={<ModularKitchen/>}/>
        <Route path="/products" element={<ProductList />} />
        <Route path="/productDetails/:productId" element={<ProductDetail />} />
        <Route path='/search' element={<SearchResults/>}/>
        <Route path="/about" element={<AboutComponent />} />
        <Route path="/contact" element={<ContactComponent />} />
        <Route path='/blogs' element={<BlogList/>}/>
        <Route path='/blogs/:id' element={<BlogPost/>}/>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/wishlist" element={<Wishlist />} /> 
        <Route path="/Cart" element={<Cart />} /> 
        <Route path="/checkout" element={<Checkout />} /> 
        <Route path='/slot' element={<SlotBookingForm/>}/>
        <Route path='/payment' element={<PaymentPage/>}/>
        <Route path='/order' element={<OrderConfirmationPage/>}/>
        <Route path='/invoice/:orderId' element={<InvoiceForm/>}/>
        <Route path='/orderHistory' element={<OrderHistory/>}/>

        {/* Admin Routes */}
        <Route path="/admin/dashboard" element={<AdminDashboard />}>
          <Route index element={<AdminHomePage />} />
          <Route path="users" element={<UserManagement />} /> 
          <Route path="products" element={<ProductManagement />} />
          <Route path="users" element={<UserManagement />} />
          <Route path="products" element={<ProductManagement />} />
          <Route path="kitchnes" element={<KitchenManagement/>}/>
          <Route path='category/furniture' element={<CategoryFurniture/>}/>
          <Route path='category/:mainCategory/:subcategoryId' element={<CategoryProductList/>}/>
          <Route path='orders' element={<OrderManagement/>}/>
          <Route path='blog' element={<BlogSection/>}/>
          <Route path='kitchen-service' element={<KitchenService/>}/>
          <Route path='reviews' element={<ReviewManagement/>}/>
        </Route>
      </Routes>
      </div>
      
      {/* Show Footer only for non-admin routes */}
      {!isAdminRoute && <Footer />}
      </div>
    </>
  );
};

const App = () => {
  return (
    <CartProvider>
      <Router>
        <AppContent />
      </Router>
    </CartProvider>
  );
};

export default App;
