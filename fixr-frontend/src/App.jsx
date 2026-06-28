import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/ui/Navbar';
import Footer from './components/ui/Footer';
import Home from './pages/Home';
import Register from './pages/Register';
import Login from './pages/Login';
import GigMarketplace from './pages/GigMarketplace';
import GigDetail from './pages/GigDetail';
import LearningCenter from './pages/LearningCenter';
import BusinessDashboard from './pages/BusinessDashboard';
import AITools from './pages/AITools';
import Profile from './pages/Profile';
import About from './pages/About';
import Pricing from './pages/Pricing';
import Contact from './pages/Contact';
import Blog from './pages/Blog';
import AdminPanel from './pages/AdminPanel';
import AdminLogin from './pages/AdminLogin';
import Transport from './pages/Transport';
import Housing from './pages/Housing';
import HousingDetail from './pages/HousingDetail';
import LandlordDashboard from './pages/LandlordDashboard';
import Construction from './pages/Construction';
import ConstructionDetail from './pages/ConstructionDetail';

export default function App() {
  return (
    <AuthProvider>
      <div className="min-h-screen bg-dark">
        <Navbar />
        <div className="h-16" />
        <Routes>
          <Route path="/"                       element={<Home />} />
          <Route path="/register"               element={<Register />} />
          <Route path="/login"                  element={<Login />} />
          <Route path="/gigs"                   element={<GigMarketplace />} />
          <Route path="/gigs/:id"               element={<GigDetail />} />
          <Route path="/learning"               element={<LearningCenter />} />
          <Route path="/dashboard"              element={<BusinessDashboard />} />
          <Route path="/ai-tools"               element={<AITools />} />
          <Route path="/profile"                element={<Profile />} />
          <Route path="/about"                  element={<About />} />
          <Route path="/pricing"                element={<Pricing />} />
          <Route path="/contact"                element={<Contact />} />
          <Route path="/blog"                   element={<Blog />} />
          <Route path="/blog/:id"               element={<Blog />} />
          <Route path="/admin"                  element={<AdminPanel />} />
          <Route path="/admin/login"            element={<AdminLogin />} />
          <Route path="/transport"              element={<Transport />} />
          {/* Housing */}
          <Route path="/housing"                element={<Housing />} />
          <Route path="/housing/landlord"       element={<LandlordDashboard />} />
          <Route path="/housing/:id"            element={<HousingDetail />} />
          {/* Construction */}
          <Route path="/construction"           element={<Construction />} />
          <Route path="/construction/:id"       element={<ConstructionDetail />} />
          <Route path="*"                       element={<Navigate to="/" />} />
        </Routes>
        <Footer />
      </div>
    </AuthProvider>
  );
}
