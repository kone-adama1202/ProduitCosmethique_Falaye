import { MapPin, Phone, Clock, Sparkles, Heart, ShoppingBag } from 'lucide-react';

export default function About() {
  return (
    <section id="about" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Image */}
          <div className="relative">
            <div className="relative aspect-[4/3] rounded-3xl overflow-hidden shadow-2xl shadow-rose-100/50">
              <img
                src="https://images.pexels.com/photos/5217003/pexels-photo-5217003.jpeg?auto=compress&cs=tinysrgb&h=650&w=940"
                alt="Falaye Boutique au marché de Mamaribougou"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-rose-900/40 via-transparent to-transparent" />
            </div>
            {/* Floating badge */}
            <div className="absolute -bottom-6 -right-6 bg-white rounded-2xl shadow-xl p-5 max-w-[200px] animate-[float_5s_ease-in-out_infinite]">
              <div className="flex items-center gap-2 mb-1">
                <Heart className="w-5 h-5 text-rose-500" />
                <span className="text-sm font-bold text-gray-900">Avec passion</span>
              </div>
              <p className="text-xs text-gray-500">
                Au service de votre beauté depuis le marché de Mamaribougou
              </p>
            </div>
          </div>

          {/* Content */}
          <div>
            <p className="text-sm font-semibold text-rose-500 uppercase tracking-widest mb-2">
              À propos de nous
            </p>
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-6">
              Falaye Boutique, votre beauté au cœur de Mamaribougou
            </h2>
            <p className="text-gray-600 leading-relaxed mb-6">
              Falaye Boutique est une boutique de produits cosmétiques située au
              marché de Mamaribougou à Bamako. Nous proposons une sélection
              soigneusement choisie de produits de beauté: soins du visage,
              maquillage, parfums, soins capillaires, soins du corps et savons
              naturels.
            </p>
            <p className="text-gray-600 leading-relaxed mb-8">
              Notre mission est de rendre accessibles à toutes et à tous des
              produits cosmétiques de qualité, adaptés aux besoins de la peau
              africaine. Nous croyons que chacun mérite de se sentir beau et
              confiant.
            </p>

            {/* Features */}
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="flex items-start gap-3 p-4 rounded-2xl bg-rose-50/50">
                <div className="w-10 h-10 rounded-xl bg-rose-100 flex items-center justify-center flex-shrink-0">
                  <MapPin className="w-5 h-5 text-rose-500" />
                </div>
                <div>
                  <h3 className="font-semibold text-sm text-gray-900">Notre adresse</h3>
                  <p className="text-xs text-gray-500">Marché de Mamaribougou, Bamako, Mali</p>
                </div>
              </div>
              <div className="flex items-start gap-3 p-4 rounded-2xl bg-amber-50/50">
                <div className="w-10 h-10 rounded-xl bg-amber-100 flex items-center justify-center flex-shrink-0">
                  <Phone className="w-5 h-5 text-amber-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-sm text-gray-900">Contact</h3>
                  <p className="text-xs text-gray-500">+223 70 00 00 00</p>
                </div>
              </div>
              <div className="flex items-start gap-3 p-4 rounded-2xl bg-rose-50/50">
                <div className="w-10 h-10 rounded-xl bg-rose-100 flex items-center justify-center flex-shrink-0">
                  <Clock className="w-5 h-5 text-rose-500" />
                </div>
                <div>
                  <h3 className="font-semibold text-sm text-gray-900">Horaires</h3>
                  <p className="text-xs text-gray-500">Lun - Dim: 8h00 - 19h00</p>
                </div>
              </div>
              <div className="flex items-start gap-3 p-4 rounded-2xl bg-amber-50/50">
                <div className="w-10 h-10 rounded-xl bg-amber-100 flex items-center justify-center flex-shrink-0">
                  <Sparkles className="w-5 h-5 text-amber-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-sm text-gray-900">Qualité</h3>
                  <p className="text-xs text-gray-500">Produits authentiques et testés</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
