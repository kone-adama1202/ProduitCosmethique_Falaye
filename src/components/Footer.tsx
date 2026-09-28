import { Sparkles, MapPin, Phone, Clock } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid md:grid-cols-3 gap-8 mb-12">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-rose-500 to-amber-500 flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <div>
                <span className="block text-lg font-bold text-white">Falaye Boutique</span>
                <span className="block text-[10px] tracking-widest text-rose-400 uppercase">
                  Mamaribougou
                </span>
              </div>
            </div>
            <p className="text-sm text-gray-400 leading-relaxed">
              Votre boutique de cosmétiques au cœur du marché de Mamaribougou.
              Des produits de qualité pour révéler votre beauté naturelle.
            </p>
          </div>

          {/* Quick links */}
          <div>
            <h3 className="font-semibold text-white mb-4">Navigation</h3>
            <ul className="space-y-2 text-sm">
              <li><a href="#hero" className="hover:text-rose-400 transition-colors">Accueil</a></li>
              <li><a href="#categories" className="hover:text-rose-400 transition-colors">Catégories</a></li>
              <li><a href="#products" className="hover:text-rose-400 transition-colors">Produits</a></li>
              <li><a href="#about" className="hover:text-rose-400 transition-colors">À propos</a></li>
              <li><a href="#contact" className="hover:text-rose-400 transition-colors">Contact</a></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-semibold text-white mb-4">Contact</h3>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-rose-400 mt-0.5 flex-shrink-0" />
                <span>Marché de Mamaribougou, Bamako, Mali</span>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-rose-400 flex-shrink-0" />
                <span>+223 70 00 00 00</span>
              </li>
              <li className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-rose-400 flex-shrink-0" />
                <span>Lun - Dim: 8h00 - 19h00</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-gray-800 text-center">
          <div className="flex items-center justify-center gap-4">
            <p className="text-sm text-gray-500">
              © {new Date().getFullYear()} Falaye Boutique. Tous droits réservés.
            </p>
            <span className="text-gray-700">·</span>
            <a
              href="#admin"
              className="text-sm text-gray-500 hover:text-rose-400 transition-colors"
            >
              Administration
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
