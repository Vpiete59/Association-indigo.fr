import React from 'react';
// J'importe l'icône Facebook si tu veux l'ajouter visuellement (optionnel, mais sympa)
import { Facebook } from 'lucide-react'; 

export default function Hero() {
  return (
    <section
      id="accueil"
      className="min-h-screen flex items-center relative overflow-hidden"
    >
      {/* Image de fond */}
      <div
        className="absolute inset-0 z-0"
        style={{
          backgroundImage: 'url(/gemini_generated_image_enqzn8enqzn8enqz.webp)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
        }}
      />

      {/* Overlay sombre */}
      <div className="absolute inset-0 z-[1] bg-indigo-950/50 mix-blend-multiply" />

      <div className="container mx-auto px-4 py-20 relative z-10">
        <div className="ml-auto max-w-3xl text-right">
          <h1 className="font-heading font-bold text-5xl md:text-7xl lg:text-8xl text-white mb-6 drop-shadow-2xl leading-tight">
            Association<br />
            <span className="text-indigo-200">Indigo</span>
          </h1>

          <div className="mb-10">
            <p className="font-body text-xl md:text-2xl lg:text-3xl text-white font-medium leading-relaxed drop-shadow-lg italic">
              "Être <span className="text-peach-primary font-bold">Atypique</span>, c'est avoir une vision <span className="text-peach-primary font-bold">Unique</span> du Monde. Guidons nos enfants vers un avenir où leur <span className="text-peach-primary font-bold">singularité</span> deviendra une <span className="text-peach-primary font-bold">force</span>."
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-end items-end flex-wrap">
            {/* Bouton Don */}
            <a
              href="https://www.helloasso.com/associations/indigo-preseau/formulaires/1"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block w-full sm:w-auto text-center px-8 py-4 bg-nature-primary text-white font-body font-bold text-lg rounded-full hover:bg-nature-primary/90 transition-all duration-300 hover:scale-105 focus:outline-none focus:ring-4 focus:ring-nature-primary focus:ring-offset-2 shadow-lg"
            >
              Faire un don
            </a>

            {/* Bouton Adhésion */}
            <a
              href="https://www.helloasso.com/associations/indigo-preseau/paiements/adhesion-indigo-preseau"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block w-full sm:w-auto text-center px-8 py-4 bg-peach-primary text-white font-body font-bold text-lg rounded-full hover:bg-peach-primary/90 transition-all duration-300 hover:scale-105 focus:outline-none focus:ring-4 focus:ring-peach-primary focus:ring-offset-2 shadow-lg"
            >
              Rejoignez-nous
            </a>

            {/* Bouton Facebook (Modifié) */}
            <a
              href="https://www.facebook.com/groups/467126453152213" // Lien mis à jour
              target="_blank" // Ouvre un nouvel onglet
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 w-full sm:w-auto text-center px-8 py-4 bg-white/90 backdrop-blur-sm text-indigo-primary font-body font-bold text-lg rounded-full hover:bg-white transition-all duration-300 hover:scale-105 focus:outline-none focus:ring-4 focus:ring-white focus:ring-offset-2 shadow-lg"
            >
              {/* J'ai ajouté l'icône pour que ce soit plus clair */}
              <Facebook size={20} />
              Découvrir nos actions
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}