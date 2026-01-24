import React from 'react';
import { Facebook } from 'lucide-react'; 

export default function Hero() {
  return (
    <section
      id="accueil"
      className="min-h-screen flex items-center relative overflow-hidden"
    >
      {/* Image de fond (Sans filtre sombre pour garder les couleurs) */}
      <div
        className="absolute inset-0 z-0"
        style={{
          backgroundImage: 'url(/gemini_generated_image_enqzn8enqzn8enqz.webp)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
        }}
      />

      <div className="container mx-auto px-4 py-20 relative z-10">
        <div className="ml-auto max-w-3xl text-right">
          
          <h1 className="font-heading font-bold text-5xl md:text-7xl lg:text-8xl text-white mb-6 drop-shadow-[0_4px_4px_rgba(0,0,0,0.8)] leading-tight">
            Association<br />
            <span className="text-indigo-200">Indigo</span>
          </h1>

          <div className="mb-10">
            {/* TEXTE REMIS À L'ORIGINAL */}
            <p className="font-body text-xl md:text-2xl lg:text-3xl text-white font-medium leading-relaxed drop-shadow-[0_2px_2px_rgba(0,0,0,0.8)] italic">
              "Être <span className="text-peach-primary font-bold">Atypique</span>, c'est avoir une vision <span className="text-nature-primary font-bold">Unique</span> du Monde. Guidons nos enfants vers un avenir où leur <span className="text-peach-primary font-bold">singularité</span> deviendra une <span className="text-nature-primary font-bold">force</span>."
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-end">
            <a
              href="https://www.helloasso.com/associations/indigo-preseau/formulaires/1"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block w-full sm:w-auto text-center px-8 py-4 bg-nature-primary text-white font-body font-bold text-lg rounded-full hover:bg-nature-primary/90 transition-all duration-300 hover:scale-105 shadow-lg"
            >
              Faire un don
            </a>

            <a
              href="https://www.helloasso.com/associations/indigo-preseau/paiements/adhesion-indigo-preseau"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block w-full sm:w-auto text-center px-8 py-4 bg-peach-primary text-white font-body font-bold text-lg rounded-full hover:bg-peach-primary/90 transition-all duration-300 hover:scale-105 shadow-lg"
            >
              Rejoignez-nous
            </a>

            <a
              href="https://www.facebook.com/groups/467126453152213" 
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 w-full sm:w-auto text-center px-8 py-4 bg-white/90 backdrop-blur-sm text-indigo-primary font-body font-bold text-lg rounded-full hover:bg-white transition-all duration-300 hover:scale-105 shadow-lg"
            >
              <Facebook size={24} />
              Communauté
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}