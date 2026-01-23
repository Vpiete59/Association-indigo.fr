import { Users, Palette, Megaphone } from 'lucide-react';

export default function Actions() {
  const actions = [
    {
      icon: Users,
      title: "Groupes d'échanges",
      description: 'Des espaces de parole pour les parents et les familles, pour partager vos expériences et trouver du soutien.',
      color: 'bg-indigo-primary',
    },
    {
      icon: Palette,
      title: 'Ateliers',
      description: 'Des ateliers thématiques pour mieux comprendre et accompagner les enfants atypiques au quotidien.',
      color: 'bg-peach-primary',
    },
    {
      icon: Megaphone,
      title: 'Actions de santé publique',
      description: "Sensibilisation auprès des écoles, professionnels de santé et institutions pour une meilleure inclusion.",
      color: 'bg-nature-primary',
    },
  ];

  return (
    <section id="nos-actions" className="py-20 bg-light-bg">
      <div className="container mx-auto px-4">
        <h2 className="font-heading font-semibold text-3xl md:text-4xl lg:text-5xl text-center text-dark-text mb-16">
          Nos actions
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {actions.map((action) => {
            const Icon = action.icon;
            return (
              <div
                key={action.title}
                className="bg-white rounded-3xl p-8 shadow-md hover:shadow-xl hover:scale-105 transition-all duration-300"
              >
                <div className="flex justify-center mb-6">
                  <div className={`${action.color} text-white rounded-full p-5 shadow-lg`}>
                    <Icon size={40} strokeWidth={2} />
                  </div>
                </div>
                <h3 className="font-heading font-medium text-xl md:text-2xl text-dark-text mb-4 text-center">
                  {action.title}
                </h3>
                <p className="font-body text-base text-dark-text leading-relaxed text-center">
                  {action.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
