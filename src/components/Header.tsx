import { ShoppingBag, Menu, X, Sparkles } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useCart } from '@/context/CartContext';

type HeaderProps = {
  onNavigate: (section: string) => void;
};

export default function Header({ onNavigate }: HeaderProps) {
  const { totalItems, setCartOpen } = useCart();
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    { label: 'Accueil', section: 'hero' },
    { label: 'Catégories', section: 'categories' },
    { label: 'Produits', section: 'products' },
    { label: 'À propos', section: 'about' },
    { label: 'Contact', section: 'contact' },
  ];

  const handleNavClick = (section: string) => {
    onNavigate(section);
    setMobileMenuOpen(false);
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled
          ? 'bg-gradient-to-r from-white to-gray-50 shadow-lg backdrop-blur-md'
          : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <button
            onClick={() => handleNavClick('hero')}
            className="flex items-center gap-3 group"
          >
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-rose-500 to-amber-500 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
              <Sparkles className="w-6 h-6 text-white animate-spin-slow" />
            </div>
            <div className="text-left">
              <span
                className={`block text-xl font-extrabold tracking-tight transition-colors duration-300 ${
                  scrolled ? 'text-gray-900' : 'text-white'
                }`}
              >
                Falaye Boutique
              </span>
              <span className="block text-xs tracking-widest text-rose-500 uppercase font-semibold">
                Mamaribougou
              </span>
            </div>
          </button>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-8">
            {navItems.map((item) => (
              <button
                key={item.section}
                onClick={() => handleNavClick(item.section)}
                className="text-sm font-medium text-gray-700 hover:text-rose-500 transition-colors duration-200 relative group"
              >
                {item.label}
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-rose-500 group-hover:w-full transition-all duration-300" />
              </button>
            ))}
          </nav>

          {/* Cart + Mobile menu button */}
          <div className="flex items-center gap-4">
            <button
              onClick={() => setCartOpen(true)}
              className="relative p-3 rounded-full bg-gradient-to-br from-rose-500 to-amber-500 hover:from-rose-600 hover:to-amber-600 shadow-lg transition-all duration-300 group"
              aria-label="Panier"
            >
              <ShoppingBag className="w-6 h-6 text-white" />
              {totalItems > 0 && (
                <span className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-white text-rose-500 text-xs font-bold flex items-center justify-center shadow-md">
                  {totalItems}
                </span>
              )}
            </button>

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-3 rounded-full bg-gray-100 hover:bg-gray-200 shadow-md transition-all"
              aria-label="Menu"
            >
              {mobileMenuOpen ? (
                <X className="w-6 h-6 text-gray-700" />
              ) : (
                <Menu className="w-6 h-6 text-gray-700" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Nav */}
        {mobileMenuOpen && (
          <nav className="md:hidden py-6 bg-white shadow-lg rounded-lg animate-[fadeIn_0.3s_ease-out]">
            <div className="flex flex-col gap-3">
              {navItems.map((item) => (
                <button
                  key={item.section}
                  onClick={() => handleNavClick(item.section)}
                  className="text-left px-6 py-3 rounded-lg text-sm font-medium text-gray-700 hover:bg-rose-50 hover:text-rose-500 transition-colors"
                >
                  {item.label}
                </button>
              ))}
            </div>
          </nav>
        )}
      </div>
    </header>
  );
}