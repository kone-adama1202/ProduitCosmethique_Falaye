import { useEffect, useState } from 'react';
import { supabase, type Category } from '@/lib/supabase';
import { ArrowRight } from 'lucide-react';

type CategoriesProps = {
  onSelectCategory: (categoryId: string | null) => void;
};

export default function Categories({ onSelectCategory }: CategoriesProps) {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchCategories() {
      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .order('name');
      if (error) {
        console.error('Error fetching categories:', error);
      } else {
        setCategories(data || []);
      }
      setLoading(false);
    }
    fetchCategories();
  }, []);

  if (loading) {
    return (
      <section id="categories" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {Array.from({ length: 6 }).map((_, i) => (
              <div
                key={i}
                className="aspect-square rounded-2xl bg-gray-100 animate-pulse"
              />
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="categories" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <p className="text-sm font-semibold text-rose-500 uppercase tracking-widest mb-2">
            Explorez
          </p>
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-3">
            Nos catégories
          </h2>
          <p className="text-gray-500 max-w-xl mx-auto">
            Découvrez notre gamme complète de produits cosmétiques soigneusement
            sélectionnés
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {categories.map((category, index) => (
            <button
              key={category.id}
              onClick={() => onSelectCategory(category.id)}
              className="group relative aspect-square rounded-2xl overflow-hidden shadow-md hover:shadow-2xl transition-all duration-500 hover:scale-105 animate-[fadeInUp_0.5s_ease-out]"
              style={{ animationDelay: `${index * 0.08}s` }}
            >
              {category.image_url ? (
                <img
                  src={category.image_url}
                  alt={category.name}
                  className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                />
              ) : (
                <div className="absolute inset-0 bg-gradient-to-br from-rose-200 to-amber-200" />
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent group-hover:from-black/80 transition-all duration-300" />
              <div className="absolute inset-0 flex flex-col items-center justify-end p-4 text-center">
                <h3 className="text-white font-bold text-sm sm:text-base mb-1 drop-shadow-lg">
                  {category.name}
                </h3>
                <span className="flex items-center gap-1 text-rose-200 text-xs opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-300">
                  Voir les produits
                  <ArrowRight className="w-3 h-3" />
                </span>
              </div>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
