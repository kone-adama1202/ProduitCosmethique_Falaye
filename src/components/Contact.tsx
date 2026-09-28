import { Send, MessageCircle } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

const WHATSAPP_NUMBER = '22392397518';

export default function Contact() {
  const [name, setName] = useState('');
  const [message, setMessage] = useState('');
  const [sent, setSent] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout>>();

  useEffect(() => () => clearTimeout(timer.current), []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const whatsappMessage = `Bonjour Falaye Boutique, je suis ${name.trim()}. ${message.trim()}`;
    const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(whatsappMessage)}`;
    window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
    setSent(true);
    timer.current = setTimeout(() => {
      setSent(false);
      setName('');
      setMessage('');
    }, 3000);
  };

  const fieldClass =
    'w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 focus:border-rose-300 focus:ring-2 focus:ring-rose-100 outline-none transition-all text-sm';

  return (
    <section id="contact" className="py-20 bg-gradient-to-b from-rose-50/30 to-white">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* En-tête centré */}
        <div className="text-center mb-10">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-3">
            Une question ? Écrivez-nous
          </h2>
          <p className="text-gray-500 max-w-xl mx-auto">
            Nous sommes là pour vous conseiller sur nos produits et prendre vos
            commandes.
          </p>
        </div>

        {/* Formulaire centré */}
        <div className="bg-white rounded-3xl shadow-lg ring-1 ring-rose-100/60 p-6 sm:p-10">
          <div className="flex items-center justify-center gap-2 mb-6 text-sm text-gray-500">
            <MessageCircle className="w-4 h-4 text-green-500" aria-hidden="true" />
            <span>Votre message s'ouvre directement dans WhatsApp</span>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label htmlFor="contact-name" className="block text-sm font-medium text-gray-700 mb-1.5">
                Votre nom
              </label>
              <input
                id="contact-name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                autoComplete="name"
                placeholder="Ex : Aminata Traoré"
                className={fieldClass}
              />
            </div>
            <div>
              <label htmlFor="contact-message" className="block text-sm font-medium text-gray-700 mb-1.5">
                Votre message
              </label>
              <textarea
                id="contact-message"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                required
                rows={5}
                placeholder="Bonjour, je voudrais des informations sur..."
                className={`${fieldClass} resize-none`}
              />
            </div>
            <button
              type="submit"
              disabled={sent}
              className={`w-full flex items-center justify-center gap-2 py-4 rounded-full font-semibold transition-all duration-300 focus:outline-none focus-visible:ring-4 focus-visible:ring-rose-200 ${
                sent
                  ? 'bg-green-500 text-white'
                  : 'bg-gradient-to-r from-rose-500 to-amber-500 text-white shadow-lg hover:shadow-xl hover:scale-[1.02]'
              }`}
            >
              {sent ? (
                'Message envoyé !'
              ) : (
                <>
                  <Send className="w-5 h-5" aria-hidden="true" />
                  Envoyer sur WhatsApp
                </>
              )}
            </button>
          </form>
        </div>

      </div>
    </section>
  );
}