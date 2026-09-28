import { useEffect, useState } from 'react';
import { supabase, type Order, type OrderItem } from '@/lib/supabase';
import { formatPrice } from '@/lib/format';
import { Clock, CheckCircle, Truck, XCircle, ChevronRight, Phone, MapPin, Package, ShoppingCart } from 'lucide-react';

const statusConfig: Record<string, { label: string; icon: typeof Clock; color: string; dot: string }> = {
  pending: { label: 'En attente', icon: Clock, color: 'text-amber-600 bg-amber-50', dot: 'bg-amber-500' },
  confirmed: { label: 'Confirmée', icon: CheckCircle, color: 'text-blue-600 bg-blue-50', dot: 'bg-blue-500' },
  delivered: { label: 'Livrée', icon: Truck, color: 'text-green-600 bg-green-50', dot: 'bg-green-500' },
  cancelled: { label: 'Annulée', icon: XCircle, color: 'text-red-600 bg-red-50', dot: 'bg-red-500' },
};

const statusOrder = ['pending', 'confirmed', 'delivered', 'cancelled'];

export default function AdminOrders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string>('all');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [orderItems, setOrderItems] = useState<OrderItem[]>([]);
  const [itemsLoading, setItemsLoading] = useState(false);
  const [updatingStatus, setUpdatingStatus] = useState(false);

  useEffect(() => {
    fetchOrders();
  }, []);

  async function fetchOrders() {
    const { data, error } = await supabase
      .from('orders')
      .select('*')
      .order('created_at', { ascending: false });
    if (error) console.error(error);
    setOrders(data || []);
    setLoading(false);
  }

  const filtered = filter === 'all' ? orders : orders.filter((o) => o.status === filter);

  const openOrder = async (order: Order) => {
    setSelectedOrder(order);
    setItemsLoading(true);
    const { data } = await supabase
      .from('order_items')
      .select('*')
      .eq('order_id', order.id);
    setOrderItems(data || []);
    setItemsLoading(false);
  };

  const updateStatus = async (orderId: string, newStatus: string) => {
    setUpdatingStatus(true);
    const { error } = await supabase
      .from('orders')
      .update({ status: newStatus })
      .eq('id', orderId);
    if (error) {
      alert('Erreur: ' + error.message);
    } else {
      setOrders((prev) =>
        prev.map((o) => (o.id === orderId ? { ...o, status: newStatus } : o))
      );
      if (selectedOrder?.id === orderId) {
        setSelectedOrder({ ...selectedOrder, status: newStatus });
      }
    }
    setUpdatingStatus(false);
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (loading) {
    return <div className="bg-white rounded-2xl p-6 animate-pulse h-96" />;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Commandes</h1>
        <p className="text-gray-500 text-sm mt-1">{orders.length} commande{orders.length !== 1 ? 's' : ''} au total</p>
      </div>

      {/* Filter tabs */}
      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => setFilter('all')}
          className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
            filter === 'all'
              ? 'bg-gray-900 text-white'
              : 'bg-white text-gray-600 border border-gray-200 hover:border-gray-300'
          }`}
        >
          Toutes ({orders.length})
        </button>
        {statusOrder.map((status) => {
          const config = statusConfig[status];
          const count = orders.filter((o) => o.status === status).length;
          return (
            <button
              key={status}
              onClick={() => setFilter(status)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                filter === status
                  ? 'bg-gray-900 text-white'
                  : 'bg-white text-gray-600 border border-gray-200 hover:border-gray-300'
              }`}
            >
              {config.label} ({count})
            </button>
          );
        })}
      </div>

      {/* Orders list */}
      {filtered.length === 0 ? (
        <div className="bg-white rounded-2xl p-12 text-center">
          <ShoppingCart className="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <p className="text-gray-400">Aucune commande dans cette catégorie</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((order) => {
            const config = statusConfig[order.status] || statusConfig.pending;
            const StatusIcon = config.icon;
            return (
              <button
                key={order.id}
                onClick={() => openOrder(order)}
                className="w-full bg-white rounded-2xl shadow-sm hover:shadow-md transition-all p-5 text-left group"
              >
                <div className="flex items-center justify-between gap-4">
                  <div className="flex items-center gap-4 min-w-0">
                    <div className={`w-12 h-12 rounded-xl ${config.color} flex items-center justify-center flex-shrink-0`}>
                      <StatusIcon className="w-6 h-6" />
                    </div>
                    <div className="min-w-0">
                      <p className="font-bold text-gray-900 truncate">{order.customer_name}</p>
                      <p className="text-xs text-gray-400">{formatDate(order.created_at)}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 flex-shrink-0">
                    <div className="text-right hidden sm:block">
                      <p className="font-bold text-gray-900">{formatPrice(Number(order.total_amount))}</p>
                      <p className="text-xs text-gray-400">{order.customer_phone}</p>
                    </div>
                    <div className={`px-3 py-1 rounded-full text-xs font-medium ${config.color}`}>
                      {config.label}
                    </div>
                    <ChevronRight className="w-5 h-5 text-gray-300 group-hover:text-gray-500 transition-colors" />
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      )}

      {/* Order detail modal */}
      {selectedOrder && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4" onClick={() => setSelectedOrder(null)}>
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />
          <div
            className="relative bg-white rounded-3xl shadow-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto animate-[scaleIn_0.3s_ease-out]"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="p-6 border-b border-gray-100">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-bold text-gray-900">Détails de la commande</h2>
                <button
                  onClick={() => setSelectedOrder(null)}
                  className="w-9 h-9 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors text-gray-600"
                >
                  <XCircle className="w-5 h-5" />
                </button>
              </div>
              <p className="text-xs text-gray-400">{formatDate(selectedOrder.created_at)}</p>
            </div>

            {/* Customer info */}
            <div className="p-6 space-y-3 border-b border-gray-100">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center flex-shrink-0">
                  <Package className="w-5 h-5 text-gray-500" />
                </div>
                <div>
                  <p className="text-xs text-gray-400">Client</p>
                  <p className="font-semibold text-gray-900">{selectedOrder.customer_name}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center flex-shrink-0">
                  <Phone className="w-5 h-5 text-gray-500" />
                </div>
                <div>
                  <p className="text-xs text-gray-400">Téléphone</p>
                  <p className="font-semibold text-gray-900">{selectedOrder.customer_phone}</p>
                </div>
              </div>
              {selectedOrder.customer_address && (
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center flex-shrink-0">
                    <MapPin className="w-5 h-5 text-gray-500" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-400">Adresse</p>
                    <p className="font-semibold text-gray-900 text-sm">{selectedOrder.customer_address}</p>
                  </div>
                </div>
              )}
            </div>

            {/* Order items */}
            <div className="p-6 border-b border-gray-100">
              <h3 className="text-sm font-bold text-gray-900 mb-4">Articles commandés</h3>
              {itemsLoading ? (
                <div className="space-y-3">
                  {Array.from({ length: 2 }).map((_, i) => (
                    <div key={i} className="h-12 bg-gray-100 rounded-xl animate-pulse" />
                  ))}
                </div>
              ) : (
                <div className="space-y-2">
                  {orderItems.map((item) => (
                    <div key={item.id} className="flex items-center justify-between py-2">
                      <div>
                        <p className="text-sm font-medium text-gray-900">{item.product_name}</p>
                        <p className="text-xs text-gray-400">
                          {item.quantity} x {formatPrice(Number(item.unit_price))}
                        </p>
                      </div>
                      <p className="text-sm font-bold text-gray-900">
                        {formatPrice(Number(item.unit_price) * item.quantity)}
                      </p>
                    </div>
                  ))}
                  <div className="pt-3 border-t border-gray-100 flex justify-between">
                    <span className="font-bold text-gray-900">Total</span>
                    <span className="font-bold text-rose-500 text-lg">
                      {formatPrice(Number(selectedOrder.total_amount))}
                    </span>
                  </div>
                </div>
              )}
            </div>

            {/* Status management */}
            <div className="p-6">
              <h3 className="text-sm font-bold text-gray-900 mb-3">Statut de la commande</h3>
              <div className="grid grid-cols-2 gap-2">
                {statusOrder.map((status) => {
                  const config = statusConfig[status];
                  const Icon = config.icon;
                  const isActive = selectedOrder.status === status;
                  return (
                    <button
                      key={status}
                      onClick={() => updateStatus(selectedOrder.id, status)}
                      disabled={updatingStatus || isActive}
                      className={`flex items-center gap-2 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                        isActive
                          ? `${config.color} ring-2 ring-offset-1 ring-current`
                          : 'bg-gray-50 text-gray-500 hover:bg-gray-100'
                      } disabled:opacity-50`}
                    >
                      <Icon className="w-4 h-4" />
                      {config.label}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
