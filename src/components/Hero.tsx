import { Sparkles, ArrowRight, Star } from 'lucide-react';

type HeroProps = {
  onShopNow: () => void;
  onExploreCategories: () => void;
};

export default function Hero({ onShopNow, onExploreCategories }: HeroProps) {
  return (
    <section
      id="hero"
      className="relative min-h-screen flex items-center overflow-hidden pt-20"
    >
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-rose-50 via-amber-50 to-orange-50" />
      <div className="absolute top-20 right-10 w-72 h-72 bg-rose-200/40 rounded-full blur-3xl animate-[float_8s_ease-in-out_infinite]" />
      <div className="absolute bottom-20 left-10 w-96 h-96 bg-amber-200/30 rounded-full blur-3xl animate-[float_10s_ease-in-out_infinite_reverse]" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 w-full">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left content */}
          <div className="text-center lg:text-left animate-[fadeInUp_0.8s_ease-out]">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/70 backdrop-blur-sm border border-rose-200 mb-6">
              <Sparkles className="w-4 h-4 text-rose-500" />
              <span className="text-sm font-medium text-rose-600">
                Cosmétiques authentiques au Mali
              </span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 leading-[1.1] mb-6">
              Révélez votre
              <span className="block bg-gradient-to-r from-rose-500 via-amber-500 to-orange-500 bg-clip-text text-transparent">
                beauté naturelle
              </span>
            </h1>

            <p className="text-lg text-gray-600 mb-8 max-w-lg mx-auto lg:mx-0 leading-relaxed">
              Falaye Boutique vous propose une sélection de produits cosmétiques
              de qualité au cœur du marché de Mamaribougou. Soins, maquillage,
              parfums et plus encore.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <button
                onClick={onShopNow}
                className="group inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full bg-gradient-to-r from-rose-500 to-amber-500 text-white font-semibold shadow-lg shadow-rose-200 hover:shadow-xl hover:shadow-rose-300 hover:scale-105 transition-all duration-300"
              >
                Découvrir nos produits
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
              <button
                onClick={onExploreCategories}
                className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full bg-white text-gray-900 font-semibold border border-gray-200 hover:border-rose-300 hover:text-rose-500 transition-all duration-300"
              >
                Voir les catégories
              </button>
            </div>

            {/* Stats */}
            <div className="flex items-center justify-center lg:justify-start gap-8 mt-12">
              <div>
                <p className="text-2xl font-bold text-gray-900">25+</p>
                <p className="text-sm text-gray-500">Produits</p>
              </div>
              <div className="w-px h-10 bg-gray-200" />
              <div>
                <p className="text-2xl font-bold text-gray-900">6</p>
                <p className="text-sm text-gray-500">Catégories</p>
              </div>
              <div className="w-px h-10 bg-gray-200" />
              <div>
                <div className="flex items-center gap-1">
                  <Star className="w-5 h-5 text-amber-400 fill-amber-400" />
                  <p className="text-2xl font-bold text-gray-900">5.0</p>
                </div>
                <p className="text-sm text-gray-500">Qualité</p>
              </div>
            </div>
          </div>

          {/* Right image */}
          <div className="relative animate-[fadeIn_1s_ease-out]">
            <div className="relative aspect-[4/5] max-w-md mx-auto">
              <div className="absolute inset-0 rounded-[2.5rem] overflow-hidden shadow-2xl shadow-rose-200/50">
                <img
                  src="https://images.pexels.com/photos/4911010/pexels-photo-4911010.jpeg?auto=compress&cs=tinysrgb&h=900&w=720"
                  alt="Falaye Boutique cosmétiques"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-rose-900/30 via-transparent to-transparent" />
              </div>

              {/* Floating card */}
              <div className="absolute -bottom-6 -left-6 bg-white rounded-2xl shadow-xl p-4 flex items-center gap-3 animate-[float_4s_ease-in-out_infinite]">
                <div className="w-12 h-12 rounded-xl bg-rose-100 flex items-center justify-center">
                  <Sparkles className="w-6 h-6 text-rose-500" />
                </div>
                <div>
                  <p className="text-sm font-bold text-gray-900">100% Authentique</p>
                  <p className="text-xs text-gray-500">Produits de qualité</p>
                </div>
              </div>

              {/* Floating badge top right */}
              <div className="absolute -top-4 -right-4 bg-gradient-to-br from-rose-500 to-amber-500 text-white rounded-2xl px-5 py-3 shadow-xl animate-[float_5s_ease-in-out_infinite]">
                <p className="text-xs font-medium opacity-90">Livraison</p>
                <p className="text-lg font-bold">Mamaribougou</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Wave separator */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg viewBox="0 0 1440 80" className="w-full h-auto" preserveAspectRatio="none">
          <path
            d="M0,40 C320,80 640,0 960,30 C1280,60 1440,20 1440,40 L1440,80 L0,80 Z"
            className="fill-white"
          />
        </svg>
      </div>
    </section>
  );
}
