import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

export default function MentionsLegalesPage() {
  return (
    <div className="min-h-screen bg-light-bg py-20">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-indigo-primary hover:text-indigo-primary/80 mb-8 transition-colors"
          >
            <ArrowLeft size={20} />
            Retour à l'accueil
          </Link>

          <h1 className="font-heading font-bold text-4xl md:text-5xl text-dark-text mb-8">
            Mentions Légales
          </h1>

          <div className="bg-white rounded-2xl shadow-sm p-8 md:p-12 space-y-8">
            
            <section>
              <h2 className="font-heading font-bold text-2xl text-dark-text mb-4">
                1. Éditeur du site
              </h2>
              <div className="font-body text-dark-text/80 space-y-2">
                <p><strong>Nom de l'association :</strong> Association Indigo</p>
                <p><strong>Forme juridique :</strong> Association loi 1901</p>
                <p><strong>RNA :</strong> W596011146</p>
                <p><strong>SIRET :</strong> 944 768 860 00016</p>
                <p><strong>Date de création :</strong> 8 avril 2025</p>
                <p><strong>Siège social :</strong> 9 rue Evariste Boussemart, 59990 Préseau</p>
                <p><strong>Email :</strong> associationindigo59@gmail.com</p>
                <p><strong>Présidente :</strong> Audrey BOTALLA</p>
                <p><strong>Directrice de la publication :</strong> Audrey BOTALLA</p>
              </div>
            </section>

            <section>
              <h2 className="font-heading font-bold text-2xl text-dark-text mb-4">
                2. Hébergement
              </h2>
              <div className="font-body text-dark-text/80 space-y-2">
                <p><strong>Hébergeur :</strong> Vercel Inc.</p>
                <p><strong>Adresse :</strong> 440 N Barranca Ave #4133, Covina, CA 91723, États-Unis</p>
                <p><strong>Site web :</strong> https://vercel.com</p>
              </div>
            </section>

            <section>
              <h2 className="font-heading font-bold text-2xl text-dark-text mb-4">
                3. Propriété intellectuelle
              </h2>
              <div className="font-body text-dark-text/80 space-y-4">
                <p>
                  L'ensemble du contenu de ce site (textes, images, vidéos, logos, icônes, sons, logiciels, etc.) 
                  est la propriété exclusive de l'Association Indigo ou de ses partenaires et est protégé par les 
                  lois françaises et internationales relatives à la propriété intellectuelle.
                </p>
                <p>
                  Toute reproduction, représentation, modification, publication, transmission, ou plus généralement 
                  toute exploitation non autorisée du site ou de son contenu, en tout ou partie, est strictement 
                  interdite et constitue un délit de contrefaçon sanctionné par les articles L.335-2 et suivants 
                  du Code de la Propriété Intellectuelle.
                </p>
              </div>
            </section>

            <section>
              <h2 className="font-heading font-bold text-2xl text-dark-text mb-4">
                4. Limitation de responsabilité
              </h2>
              <div className="font-body text-dark-text/80 space-y-4">
                <p>
                  L'Association Indigo s'efforce d'assurer l'exactitude et la mise à jour des informations 
                  diffusées sur ce site. Toutefois, elle ne peut garantir l'exactitude, la précision ou 
                  l'exhaustivité des informations mises à disposition.
                </p>
                <p>
                  Les informations présentes sur ce site sont données à titre indicatif et ne sauraient 
                  constituer un avis médical, juridique ou professionnel. En cas de doute, nous vous 
                  invitons à consulter un professionnel qualifié.
                </p>
                <p>
                  L'Association Indigo décline toute responsabilité pour tout dommage résultant d'une 
                  intrusion frauduleuse d'un tiers ou de la présence d'un virus informatique.
                </p>
              </div>
            </section>

            <section>
              <h2 className="font-heading font-bold text-2xl text-dark-text mb-4">
                5. Liens hypertextes
              </h2>
              <div className="font-body text-dark-text/80 space-y-4">
                <p>
                  Ce site peut contenir des liens vers d'autres sites internet. L'Association Indigo 
                  n'exerce aucun contrôle sur ces sites et décline toute responsabilité quant à leur 
                  contenu ou aux éventuels dommages résultant de leur utilisation.
                </p>
              </div>
            </section>

            <section>
              <h2 className="font-heading font-bold text-2xl text-dark-text mb-4">
                6. Droit applicable
              </h2>
              <div className="font-body text-dark-text/80 space-y-4">
                <p>
                  Les présentes mentions légales sont soumises au droit français. En cas de litige, 
                  les tribunaux français seront seuls compétents.
                </p>
              </div>
            </section>

            <section>
              <h2 className="font-heading font-bold text-2xl text-dark-text mb-4">
                7. Contact
              </h2>
              <div className="font-body text-dark-text/80 space-y-4">
                <p>
                  Pour toute question concernant ces mentions légales, vous pouvez nous contacter à 
                  l'adresse suivante : <a href="mailto:associationindigo59@gmail.com" className="text-indigo-primary hover:underline">associationindigo59@gmail.com</a>
                </p>
              </div>
            </section>

            <p className="font-body text-dark-text/60 text-sm pt-8 border-t border-gray-100">
              Dernière mise à jour : Janvier 2025
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
