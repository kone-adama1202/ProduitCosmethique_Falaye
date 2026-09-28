import { useEffect, useState } from 'react';
import { X, Plus, Minus, ShoppingBag, Star, Check } from 'lucide-react';
import type { Product, Category } from '@/lib/supabase';
import { supabase } from '@/lib/supabase';
import { formatPrice } from '@/lib/format';
import { useCart } from '@/context/CartContext';

type ProductModalProps = {
  product: Product | null;
  onClose: () => void;
};

export default function ProductModal({ product, onClose }: ProductModalProps) {
  const { addToCart, setCartOpen } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [category, setCategory] = useState<Category | null>(null);
  const [added, setAdded] = useState(false);

  useEffect(() => {
    if (product) {
      setQuantity(1);
      setAdded(false);
      if (product.category_id) {
        supabase
          .from('categories')
          .select('*')
          .eq('id', product.category_id)
          .maybeSingle()
          .then(({ data }) => setCategory(data));
      } else {
        setCategory(null);
      }
    }
  }, [product]);

  useEffect(() => {
    if (product) {
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [product]);

  if (!product) return null;

  const handleAddToCart = () => {
    addToCart(product, quantity);
    setAdded(true);
    setTimeout(() => {
      setAdded(false);
      onClose();
      setCartOpen(true);
    }, 1000);
  };

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 animate-[fadeIn_0.2s_ease-out]"
      onClick={onClose}
    >
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />

      <div
        className="relative bg-white rounded-3xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto animate-[scaleIn_0.3s_ease-out]"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 w-10 h-10 rounded-full bg-white/90 backdrop-blur-sm shadow-md flex items-center justify-center hover:bg-gray-100 transition-colors"
          aria-label="Fermer"
        >
          <X className="w-5 h-5 text-gray-700" />
        </button>

        <div className="grid md:grid-cols-2 gap-0">
          {/* Image */}
          <div className="relative aspect-square md:aspect-auto md:h-full bg-gray-50 overflow-hidden">
            {product.image_url ? (
              <img
                src={product.image_url}
                alt={product.name}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-rose-100 to-amber-100" />
            )}
            {product.featured && (
              <div className="absolute top-4 left-4 flex items-center gap-1 px-3 py-1.5 rounded-full bg-amber-400 text-white text-xs font-semibold shadow-md">
                <Star className="w-3 h-3 fill-white" />
                Produit en vedette
              </div>
            )}
          </div>

          {/* Details */}
          <div className="p-8 flex flex-col">
            {category && (
              <span className="text-xs font-semibold text-rose-500 uppercase tracking-widest mb-2">
                {category.name}
              </span>
            )}
            <h2 className="text-2xl font-bold text-gray-900 mb-3">
              {product.name}
            </h2>
            <p className="text-gray-500 leading-relaxed mb-6">
              {product.description}
            </p>

            <div className="flex items-center gap-4 mb-6">
              <span className="text-3xl font-bold text-gray-900">
                {formatPrice(product.price)}
              </span>
              {product.stock > 0 ? (
                <span className="text-sm font-medium text-green-600 bg-green-50 px-3 py-1 rounded-full">
                  En stock ({product.stock})
                </span>
              ) : (
                <span className="text-sm font-medium text-red-600 bg-red-50 px-3 py-1 rounded-full">
                  Rupture de stock
                </span>
              )}
            </div>

            {/* Quantity selector */}
            <div className="flex items-center gap-4 mb-8">
              <span className="text-sm font-medium text-gray-600">Quantité:</span>
              <div className="flex items-center gap-1 bg-gray-100 rounded-full p-1">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-8 h-8 rounded-full bg-white shadow-sm flex items-center justify-center hover:bg-gray-50 transition-colors"
                  aria-label="Diminuer"
                >
                  <Minus className="w-4 h-4 text-gray-600" />
                </button>
                <span className="w-10 text-center font-semibold text-gray-900">
                  {quantity}
                </span>
                <button
                  onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                  className="w-8 h-8 rounded-full bg-white shadow-sm flex items-center justify-center hover:bg-gray-50 transition-colors"
                  aria-label="Augmenter"
                >
                  <Plus className="w-4 h-4 text-gray-600" />
                </button>
              </div>
            </div>

            {/* Add to cart */}
            <button
              onClick={handleAddToCart}
              disabled={product.stock === 0 || added}
              className={`w-full flex items-center justify-center gap-2 py-4 rounded-full font-semibold transition-all duration-300 ${
                added
                  ? 'bg-green-500 text-white'
                  : product.stock === 0
                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                    : 'bg-gradient-to-r from-rose-500 to-amber-500 text-white shadow-lg shadow-rose-200 hover:shadow-xl hover:shadow-rose-300 hover:scale-[1.02]'
              }`}
            >
              {added ? (
                <>
                  <Check className="w-5 h-5" />
                  Ajouté au panier !
                </>
              ) : (
                <>
                  <ShoppingBag className="w-5 h-5" />
                  Ajouter au panier - {formatPrice(product.price * quantity)}
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
