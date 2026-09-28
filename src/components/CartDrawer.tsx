import { X, Plus, Minus, ShoppingBag, Trash2, ArrowRight } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { formatPrice } from '@/lib/format';
import { useEffect, useState } from 'react';
import type { CartItem } from '@/lib/supabase';
import { supabase } from '@/lib/supabase';

type CartDrawerProps = {
  onCheckout: () => void;
};

export default function CartDrawer({ onCheckout }: CartDrawerProps) {
  const { items, isCartOpen, setCartOpen, updateQuantity, removeFromCart, totalAmount, totalItems, clearCart } = useCart();
  const [checkoutMode, setCheckoutMode] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(false);
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [customerAddress, setCustomerAddress] = useState('');
  const [formError, setFormError] = useState('');

  useEffect(() => {
    if (isCartOpen) {
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isCartOpen]);

  const handleClose = () => {
    setCartOpen(false);
    setTimeout(() => {
      setCheckoutMode(false);
      setOrderSuccess(false);
      setFormError('');
    }, 300);
  };

  const handleCheckout = async () => {
    setFormError('');
    if (!customerName.trim()) {
      setFormError('Veuillez entrer votre nom');
      return;
    }
    if (!customerPhone.trim()) {
      setFormError('Veuillez entrer votre numéro de téléphone');
      return;
    }

    setSubmitting(true);
    try {
      const { data: order, error: orderError } = await supabase
        .from('orders')
        .insert({
          customer_name: customerName,
          customer_phone: customerPhone,
          customer_address: customerAddress || null,
          total_amount: totalAmount,
          status: 'pending',
        })
        .select()
        .single();

      if (orderError) throw orderError;

      const orderItems = items.map((item: CartItem) => ({
        order_id: order.id,
        product_id: item.product.id,
        product_name: item.product.name,
        quantity: item.quantity,
        unit_price: item.product.price,
      }));

      const { error: itemsError } = await supabase
        .from('order_items')
        .insert(orderItems);

      if (itemsError) throw itemsError;

      setOrderSuccess(true);
      clearCart();
      setCustomerName('');
      setCustomerPhone('');
      setCustomerAddress('');
    } catch (err) {
      console.error('Order error:', err);
      setFormError('Une erreur est survenue. Veuillez réessayer.');
    } finally {
      setSubmitting(false);
    }
  };

  if (!isCartOpen) return null;

  return (
    <div className="fixed inset-0 z-[100]">
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm animate-[fadeIn_0.2s_ease-out]"
        onClick={handleClose}
      />
      <div className="absolute right-0 top-0 bottom-0 w-full max-w-md bg-white shadow-2xl flex flex-col animate-[slideInRight_0.3s_ease-out]">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-100">
          <div className="flex items-center gap-2">
            <ShoppingBag className="w-5 h-5 text-rose-500" />
            <h2 className="text-lg font-bold text-gray-900">
              {orderSuccess ? 'Commande confirmée' : checkoutMode ? 'Finaliser la commande' : `Panier (${totalItems})`}
            </h2>
          </div>
          <button
            onClick={handleClose}
            className="w-9 h-9 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors"
            aria-label="Fermer"
          >
            <X className="w-5 h-5 text-gray-600" />
          </button>
        </div>

        {orderSuccess ? (
          /* Success state */
          <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
            <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center mb-6 animate-[scaleIn_0.5s_ease-out]">
              <svg className="w-10 h-10 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Merci pour votre commande !</h3>
            <p className="text-gray-500 mb-6">
              Votre commande a bien été enregistrée. Nous vous contacterons au numéro fourni pour la livraison.
            </p>
            <button
              onClick={handleClose}
              className="px-8 py-3 rounded-full bg-gradient-to-r from-rose-500 to-amber-500 text-white font-semibold shadow-lg hover:scale-105 transition-transform"
            >
              Continuer mes achats
            </button>
          </div>
        ) : items.length === 0 ? (
          /* Empty cart */
          <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
            <div className="w-20 h-20 rounded-full bg-gray-100 flex items-center justify-center mb-6">
              <ShoppingBag className="w-10 h-10 text-gray-300" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Votre panier est vide</h3>
            <p className="text-gray-400 text-sm mb-6">
              Ajoutez des produits pour commencer vos achats
            </p>
            <button
              onClick={handleClose}
              className="px-8 py-3 rounded-full bg-gradient-to-r from-rose-500 to-amber-500 text-white font-semibold shadow-lg hover:scale-105 transition-transform"
            >
              Voir les produits
            </button>
          </div>
        ) : checkoutMode ? (
          /* Checkout form */
          <>
            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              <button
                onClick={() => setCheckoutMode(false)}
                className="text-sm text-gray-500 hover:text-rose-500 transition-colors flex items-center gap-1"
              >
                <ArrowRight className="w-4 h-4 rotate-180" />
                Retour au panier
              </button>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Nom complet *
                </label>
                <input
                  type="text"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  placeholder="Ex: Aminata Traoré"
                  className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 focus:border-rose-300 focus:ring-2 focus:ring-rose-100 outline-none transition-all text-sm"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Téléphone (WhatsApp) *
                </label>
                <input
                  type="tel"
                  value={customerPhone}
                  onChange={(e) => setCustomerPhone(e.target.value)}
                  placeholder="Ex: +223 70 00 00 00"
                  className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 focus:border-rose-300 focus:ring-2 focus:ring-rose-100 outline-none transition-all text-sm"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Adresse de livraison
                </label>
                <textarea
                  value={customerAddress}
                  onChange={(e) => setCustomerAddress(e.target.value)}
                  placeholder="Ex: Marché de Mamaribougou, Bamako, Mali"
                  rows={3}
                  className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 focus:border-rose-300 focus:ring-2 focus:ring-rose-100 outline-none transition-all text-sm resize-none"
                />
              </div>

              {/* Order summary */}
              <div className="bg-rose-50/50 rounded-xl p-4 space-y-2">
                <p className="text-sm font-semibold text-gray-700 mb-2">Récapitulatif</p>
                {items.map((item) => (
                  <div key={item.product.id} className="flex justify-between text-sm">
                    <span className="text-gray-600">
                      {item.product.name} x{item.quantity}
                    </span>
                    <span className="font-medium text-gray-900">
                      {formatPrice(item.product.price * item.quantity)}
                    </span>
                  </div>
                ))}
                <div className="pt-2 border-t border-rose-100 flex justify-between">
                  <span className="font-semibold text-gray-900">Total</span>
                  <span className="font-bold text-rose-500">
                    {formatPrice(totalAmount)}
                  </span>
                </div>
              </div>

              {formError && (
                <div className="bg-red-50 text-red-600 text-sm rounded-xl px-4 py-3">
                  {formError}
                </div>
              )}
            </div>

            <div className="p-6 border-t border-gray-100">
              <button
                onClick={handleCheckout}
                disabled={submitting}
                className="w-full py-4 rounded-full bg-gradient-to-r from-rose-500 to-amber-500 text-white font-semibold shadow-lg hover:shadow-xl hover:scale-[1.02] transition-all disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {submitting ? 'Envoi en cours...' : `Confirmer la commande - ${formatPrice(totalAmount)}`}
              </button>
            </div>
          </>
        ) : (
          /* Cart items */
          <>
            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              {items.map((item) => (
                <div
                  key={item.product.id}
                  className="flex gap-4 bg-gray-50 rounded-2xl p-3 animate-[fadeIn_0.3s_ease-out]"
                >
                  <div className="w-20 h-20 rounded-xl overflow-hidden bg-gray-200 flex-shrink-0">
                    {item.product.image_url ? (
                      <img
                        src={item.product.image_url}
                        alt={item.product.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-rose-100 to-amber-100" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-sm text-gray-900 line-clamp-1">
                      {item.product.name}
                    </h3>
                    <p className="text-sm font-bold text-rose-500 mb-2">
                      {formatPrice(item.product.price)}
                    </p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1 bg-white rounded-full p-0.5 shadow-sm">
                        <button
                          onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                          className="w-7 h-7 rounded-full hover:bg-gray-100 flex items-center justify-center transition-colors"
                          aria-label="Diminuer"
                        >
                          <Minus className="w-3.5 h-3.5 text-gray-600" />
                        </button>
                        <span className="w-8 text-center text-sm font-semibold">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                          className="w-7 h-7 rounded-full hover:bg-gray-100 flex items-center justify-center transition-colors"
                          aria-label="Augmenter"
                        >
                          <Plus className="w-3.5 h-3.5 text-gray-600" />
                        </button>
                      </div>
                      <button
                        onClick={() => removeFromCart(item.product.id)}
                        className="w-8 h-8 rounded-full hover:bg-red-50 flex items-center justify-center text-gray-400 hover:text-red-500 transition-colors"
                        aria-label="Supprimer"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Footer */}
            <div className="p-6 border-t border-gray-100 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-gray-500">Total</span>
                <span className="text-2xl font-bold text-gray-900">
                  {formatPrice(totalAmount)}
                </span>
              </div>
              <button
                onClick={() => setCheckoutMode(true)}
                className="w-full flex items-center justify-center gap-2 py-4 rounded-full bg-gradient-to-r from-rose-500 to-amber-500 text-white font-semibold shadow-lg hover:shadow-xl hover:scale-[1.02] transition-all"
              >
                Passer commande
                <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
