import { Shield } from 'lucide-react';

export default function Join() {
  return (
    <section
      id="nous-rejoindre"
      className="py-20 relative overflow-hidden"
      style={{
        background: 'linear-gradient(180deg, #7BC77B 0%, #FFFFFF 100%)',
      }}
    >
      <div className="container mx-auto px-4 text-center">
        <h2 className="font-heading font-semibold text-3xl md:text-4xl lg:text-5xl text-white mb-12">
          Soutenez l'Association Indigo
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto mb-12">
          <div className="bg-white/10 backdrop-blur-sm rounded-3xl p-8">
            <h3 className="font-heading font-semibold text-2xl md:text-3xl text-white mb-4">
              Adhésion
            </h3>
            <p className="font-body text-xl md:text-2xl font-bold text-white mb-4">
              5€ / an
            </p>
            <p className="font-body text-base md:text-lg text-white/95 mb-6">
              Devenez membre de l'association et participez à nos actions collectives.
            </p>
            <a
              href="https://www.helloasso.com/associations/indigo-preseau/paiements/adhesion-indigo-preseau"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block px-8 py-4 bg-peach-primary text-white font-body font-bold text-lg rounded-full hover:bg-peach-dark transition-all duration-300 hover:scale-105 focus:outline-none focus:ring-4 focus:ring-peach-primary focus:ring-offset-2 shadow-2xl"
            >
              Adhérer maintenant
            </a>
          </div>

          <div className="bg-white/10 backdrop-blur-sm rounded-3xl p-8">
            <h3 className="font-heading font-semibold text-2xl md:text-3xl text-white mb-4">
              Don
            </h3>
            <p className="font-body text-xl md:text-2xl font-bold text-white mb-4">
              Montant libre
            </p>
            <p className="font-body text-base md:text-lg text-white/95 mb-6">
              Soutenez nos actions et aidez-nous à accompagner toujours plus de familles.
            </p>
            <a
              href="https://www.helloasso.com/associations/indigo-preseau/formulaires/1"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block px-8 py-4 bg-indigo-primary text-white font-body font-bold text-lg rounded-full hover:bg-opacity-90 transition-all duration-300 hover:scale-105 focus:outline-none focus:ring-4 focus:ring-indigo-primary focus:ring-offset-2 shadow-2xl"
            >
              Faire un don
            </a>
          </div>
        </div>

        <div className="flex items-center justify-center gap-2 text-white/90">
          <Shield size={20} />
          <p className="font-body text-sm md:text-base">Paiements 100% sécurisés via HelloAsso</p>
        </div>
      </div>
    </section>
  );
}
