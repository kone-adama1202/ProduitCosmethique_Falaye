import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { formatPrice } from '@/lib/format';
import { Package, ShoppingCart, Tag, TrendingUp, Clock, CheckCircle, Truck, XCircle } from 'lucide-react';

type Stats = {
  totalProducts: number;
  totalCategories: number;
  totalOrders: number;
  pendingOrders: number;
  totalRevenue: number;
};

type RecentOrder = {
  id: string;
  customer_name: string;
  customer_phone: string;
  total_amount: number;
  status: string;
  created_at: string;
};

export default function AdminOverview() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [recentOrders, setRecentOrders] = useState<RecentOrder[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchStats() {
      const [prodRes, catRes, ordersRes] = await Promise.all([
        supabase.from('products').select('id', { count: 'exact', head: true }),
        supabase.from('categories').select('id', { count: 'exact', head: true }),
        supabase.from('orders').select('*').order('created_at', { ascending: false }),
      ]);

      const orders = ordersRes.data || [];
      const pending = orders.filter((o) => o.status === 'pending').length;
      const revenue = orders
        .filter((o) => o.status === 'delivered')
        .reduce((sum, o) => sum + Number(o.total_amount), 0);

      setStats({
        totalProducts: prodRes.count || 0,
        totalCategories: catRes.count || 0,
        totalOrders: orders.length,
        pendingOrders: pending,
        totalRevenue: revenue,
      });
      setRecentOrders(orders.slice(0, 5));
      setLoading(false);
    }
    fetchStats();
  }, []);

  if (loading || !stats) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="bg-white rounded-2xl p-6 animate-pulse h-32" />
        ))}
      </div>
    );
  }

  const statCards = [
    { label: 'Produits', value: stats.totalProducts, icon: Package, color: 'from-rose-500 to-rose-600', bg: 'bg-rose-50', text: 'text-rose-600' },
    { label: 'Catégories', value: stats.totalCategories, icon: Tag, color: 'from-amber-500 to-amber-600', bg: 'bg-amber-50', text: 'text-amber-600' },
    { label: 'Commandes', value: stats.totalOrders, icon: ShoppingCart, color: 'from-blue-500 to-blue-600', bg: 'bg-blue-50', text: 'text-blue-600' },
    { label: 'Revenu livré', value: formatPrice(stats.totalRevenue), icon: TrendingUp, color: 'from-green-500 to-green-600', bg: 'bg-green-50', text: 'text-green-600' },
  ];

  const statusConfig: Record<string, { label: string; icon: typeof Clock; color: string }> = {
    pending: { label: 'En attente', icon: Clock, color: 'text-amber-600 bg-amber-50' },
    confirmed: { label: 'Confirmée', icon: CheckCircle, color: 'text-blue-600 bg-blue-50' },
    delivered: { label: 'Livrée', icon: Truck, color: 'text-green-600 bg-green-50' },
    cancelled: { label: 'Annulée', icon: XCircle, color: 'text-red-600 bg-red-50' },
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Tableau de bord</h1>
        <p className="text-gray-500 text-sm mt-1">Vue d'ensemble de votre boutique</p>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((card) => {
          const Icon = card.icon;
          return (
            <div key={card.label} className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between mb-3">
                <div className={`w-12 h-12 rounded-xl ${card.bg} flex items-center justify-center`}>
                  <Icon className={`w-6 h-6 ${card.text}`} />
                </div>
              </div>
              <p className="text-2xl font-bold text-gray-900">{card.value}</p>
              <p className="text-sm text-gray-500 mt-1">{card.label}</p>
            </div>
          );
        })}
      </div>

      {/* Pending orders alert */}
      {stats.pendingOrders > 0 && (
        <div className="flex items-center gap-3 bg-amber-50 border border-amber-200 rounded-2xl p-4">
          <Clock className="w-5 h-5 text-amber-600 flex-shrink-0" />
          <p className="text-sm text-amber-700">
            <span className="font-semibold">{stats.pendingOrders}</span> commande{stats.pendingOrders !== 1 ? 's' : ''} en attente de traitement
          </p>
        </div>
      )}

      {/* Recent orders */}
      <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
        <div className="p-6 border-b border-gray-100">
          <h2 className="font-bold text-gray-900">Commandes récentes</h2>
        </div>
        {recentOrders.length === 0 ? (
          <div className="p-8 text-center text-gray-400">Aucune commande pour le moment</div>
        ) : (
          <div className="divide-y divide-gray-50">
            {recentOrders.map((order) => {
              const status = statusConfig[order.status] || statusConfig.pending;
              const StatusIcon = status.icon;
              return (
                <div key={order.id} className="flex items-center justify-between p-4 hover:bg-gray-50 transition-colors">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className={`w-10 h-10 rounded-xl ${status.color} flex items-center justify-center flex-shrink-0`}>
                      <StatusIcon className="w-5 h-5" />
                    </div>
                    <div className="min-w-0">
                      <p className="font-semibold text-gray-900 text-sm truncate">{order.customer_name}</p>
                      <p className="text-xs text-gray-400">{order.customer_phone}</p>
                    </div>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <p className="font-bold text-gray-900 text-sm">{formatPrice(Number(order.total_amount))}</p>
                    <p className="text-xs text-gray-400">{new Date(order.created_at).toLocaleDateString('fr-FR')}</p>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
