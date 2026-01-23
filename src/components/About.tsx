import { Heart, HandHeart, Star } from 'lucide-react';

export default function About() {
  const values = [
    {
      icon: Heart,
      title: 'Bienveillance',
      color: 'text-peach-primary',
    },
    {
      icon: HandHeart,
      title: 'Entraide',
      color: 'text-nature-primary',
    },
    {
      icon: Star,
      title: 'Valorisation',
      color: 'text-indigo-primary',
    },
  ];

  return (
    <section id="qui-sommes-nous" className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <h2 className="font-heading font-semibold text-3xl md:text-4xl lg:text-5xl text-center text-dark-text mb-12">
          Qui sommes-nous ?
        </h2>

        <div className="max-w-4xl mx-auto mb-16 space-y-6">
          <p className="font-body text-base md:text-lg text-dark-text leading-relaxed">
            L'Association Indigo est une association loi 1901 basée à Preseau, dans le Nord. Nous accompagnons les familles d'enfants atypiques : troubles du langage écrit et oral, hyperactivité, hypersensibilité, haut potentiel intellectuel et/ou émotionnel, enfants dits "indigo" ou "zèbres", enfants précoces, troubles de l'attention avec ou sans hyperactivité (TDAH/TDA).
          </p>
          <p className="font-body text-base md:text-lg text-dark-text leading-relaxed">
            Notre mission : sensibiliser, accompagner et créer du lien entre les familles qui vivent des parcours similaires.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {values.map((value) => {
            const Icon = value.icon;
            return (
              <div
                key={value.title}
                className="bg-light-bg rounded-3xl p-8 text-center hover:scale-105 transition-transform duration-300 hover:shadow-lg"
              >
                <div className="flex justify-center mb-6">
                  <div className={`${value.color} bg-white rounded-full p-4 shadow-md`}>
                    <Icon size={48} strokeWidth={1.5} />
                  </div>
                </div>
                <h3 className="font-heading font-medium text-xl md:text-2xl text-dark-text">
                  {value.title}
                </h3>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
