import { useState, useCallback, useEffect } from 'react';
import { CartProvider } from '@/context/CartContext';
import { AdminAuthProvider, useAdminAuth } from '@/context/AdminAuthContext';
import Header from '@/components/Header';
import Hero from '@/components/Hero';
import Categories from '@/components/Categories';
import Products from '@/components/Products';
import ProductModal from '@/components/ProductModal';
import CartDrawer from '@/components/CartDrawer';
import About from '@/components/About';
import Contact from '@/components/Contact';
import Footer from '@/components/Footer';
import AdminLogin from '@/components/admin/AdminLogin';
import AdminDashboard from '@/components/admin/AdminDashboard';
import type { Product } from '@/lib/supabase';

function AppContent() {
  const { isAuthenticated, loading } = useAdminAuth();
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [route, setRoute] = useState<string>(window.location.hash.replace('#', '') || '');

  useEffect(() => {
    const handleHashChange = () => {
      setRoute(window.location.hash.replace('#', '') || '');
    };
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const handleNavigate = useCallback((section: string) => {
    const el = document.getElementById(section);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, []);

  const handleSelectCategory = useCallback((categoryId: string | null) => {
    setSelectedCategory(categoryId);
    setTimeout(() => {
      const el = document.getElementById('products');
      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 100);
  }, []);

  // Admin route
  if (route === 'admin') {
    if (loading) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <div className="w-10 h-10 border-4 border-rose-200 border-t-rose-500 rounded-full animate-spin" />
        </div>
      );
    }
    if (!isAuthenticated) {
      return <AdminLogin />;
    }
    return <AdminDashboard />;
  }

  // Boutique route
  return (
    <div className="min-h-screen bg-white">
      <Header onNavigate={handleNavigate} />
      <main>
        <Hero
          onShopNow={() => handleNavigate('products')}
          onExploreCategories={() => handleNavigate('categories')}
        />
        <Categories onSelectCategory={handleSelectCategory} />
        <Products
          selectedCategory={selectedCategory}
          onSelectCategory={setSelectedCategory}
          onProductClick={setSelectedProduct}
        />
        <About />
        <Contact />
      </main>
      <Footer />

      <ProductModal
        product={selectedProduct}
        onClose={() => setSelectedProduct(null)}
      />
      <CartDrawer onCheckout={() => {}} />
    </div>
  );
}

function App() {
  return (
    <AdminAuthProvider>
      <CartProvider>
        <AppContent />
      </CartProvider>
    </AdminAuthProvider>
  );
}

export default App;
