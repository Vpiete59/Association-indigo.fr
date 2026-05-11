import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import SEO from '../components/SEO';

export default function PolitiqueConfidentialitePage() {
  return (
    <div className="min-h-screen bg-light-bg py-20">
      <SEO
        title="Politique de Confidentialité | Association Indigo"
        description="Politique de confidentialité et gestion des données personnelles de l'Association Indigo."
        canonical="/politique-confidentialite"
        noIndex={true}
      />
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
            Politique de Confidentialité
          </h1>

          <div className="bg-white rounded-2xl shadow-sm p-8 md:p-12 space-y-8">
            
            <section>
              <h2 className="font-heading font-bold text-2xl text-dark-text mb-4">
                1. Introduction
              </h2>
              <div className="font-body text-dark-text/80 space-y-4">
                <p>
                  L'Association INDIGO (ci-après "nous", "notre" ou "l'Association") s'engage à protéger 
                  la vie privée des visiteurs de son site internet www.association-indigo.fr (ci-après "le Site").
                </p>
                <p>
                  Cette politique de confidentialité explique comment nous collectons, utilisons et protégeons 
                  vos données personnelles conformément au Règlement Général sur la Protection des Données (RGPD) 
                  et à la loi Informatique et Libertés.
                </p>
              </div>
            </section>

            <section>
              <h2 className="font-heading font-bold text-2xl text-dark-text mb-4">
                2. Responsable du traitement
              </h2>
              <div className="font-body text-dark-text/80 space-y-2">
                <p><strong>Association Indigo</strong></p>
                <p>9 rue Evariste Boussemart, 59990 Préseau</p>
                <p>Email : associationindigo59@gmail.com</p>
                <p>RNA : W596011146</p>
                <p>SIRET : 944 768 860 00016</p>
              </div>
            </section>

            <section>
              <h2 className="font-heading font-bold text-2xl text-dark-text mb-4">
                3. Données collectées
              </h2>
              <div className="font-body text-dark-text/80 space-y-4">
                <p>Nous pouvons collecter les types de données suivants :</p>
                
                <h3 className="font-semibold text-dark-text mt-4">3.1 Données de navigation (cookies)</h3>
                <ul className="list-disc pl-6 space-y-2">
                  <li><strong>Cookies d'analyse comportementale (Microsoft Clarity) :</strong> clics, défilement, interactions avec le site pour améliorer l'expérience utilisateur</li>
                </ul>

                <h3 className="font-semibold text-dark-text mt-4">3.2 Données de contact</h3>
                <p>
                  Lorsque vous utilisez notre formulaire de contact : nom, prénom, adresse email, 
                  et le contenu de votre message.
                </p>

                <h3 className="font-semibold text-dark-text mt-4">3.3 Données d'adhésion</h3>
                <p>
                  Les adhésions et dons sont gérés via la plateforme HelloAsso. Nous vous invitons 
                  à consulter leur politique de confidentialité : 
                  <a href="https://www.helloasso.com/confidentialite" target="_blank" rel="noopener noreferrer" className="text-indigo-primary hover:underline ml-1">
                    https://www.helloasso.com/confidentialite
                  </a>
                </p>
              </div>
            </section>

            <section>
              <h2 className="font-heading font-bold text-2xl text-dark-text mb-4">
                4. Finalités du traitement
              </h2>
              <div className="font-body text-dark-text/80 space-y-4">
                <p>Vos données sont collectées pour les finalités suivantes :</p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Améliorer l'expérience utilisateur et le contenu du site</li>
                  <li>Analyser la fréquentation et le comportement des visiteurs</li>
                  <li>Répondre à vos demandes de contact</li>
                  <li>Vous informer de nos événements et actualités (avec votre consentement)</li>
                </ul>
              </div>
            </section>

            <section>
              <h2 className="font-heading font-bold text-2xl text-dark-text mb-4">
                5. Base légale du traitement
              </h2>
              <div className="font-body text-dark-text/80 space-y-4">
                <ul className="list-disc pl-6 space-y-2">
                  <li><strong>Consentement :</strong> pour les cookies non essentiels (analytics, Clarity)</li>
                  <li><strong>Intérêt légitime :</strong> pour l'amélioration de nos services</li>
                  <li><strong>Exécution d'un contrat :</strong> pour la gestion des adhésions</li>
                </ul>
              </div>
            </section>

            <section>
              <h2 className="font-heading font-bold text-2xl text-dark-text mb-4">
                6. Cookies
              </h2>
              <div className="font-body text-dark-text/80 space-y-4">
                <p>Notre site utilise des cookies pour fonctionner et améliorer votre expérience.</p>
                
                <h3 className="font-semibold text-dark-text mt-4">6.1 Cookies essentiels</h3>
                <p>Nécessaires au fonctionnement du site (authentification, préférences de cookies). Ils ne peuvent pas être désactivés.</p>
                
                <h3 className="font-semibold text-dark-text mt-4">6.2 Cookies analytiques</h3>
                <table className="w-full mt-2 text-sm">
                  <thead className="bg-light-bg">
                    <tr>
                      <th className="text-left p-2">Cookie</th>
                      <th className="text-left p-2">Fournisseur</th>
                      <th className="text-left p-2">Durée</th>
                      <th className="text-left p-2">Finalité</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b">
                      <td className="p-2">_clck, _clsk</td>
                      <td className="p-2">Microsoft Clarity</td>
                      <td className="p-2">1 an</td>
                      <td className="p-2">Analyse comportementale</td>
                    </tr>
                  </tbody>
                </table>

                <p className="mt-4">
                  Vous pouvez modifier vos préférences de cookies à tout moment en cliquant sur 
                  "Gérer les cookies" en bas de page.
                </p>
              </div>
            </section>

            <section>
              <h2 className="font-heading font-bold text-2xl text-dark-text mb-4">
                7. Durée de conservation
              </h2>
              <div className="font-body text-dark-text/80 space-y-4">
                <ul className="list-disc pl-6 space-y-2">
                  <li><strong>Données de contact :</strong> 3 ans après le dernier contact</li>
                  <li><strong>Données d'adhésion :</strong> durée de l'adhésion + 5 ans (obligations légales)</li>
                  <li><strong>Données de navigation :</strong> 13 mois maximum</li>
                </ul>
              </div>
            </section>

            <section>
              <h2 className="font-heading font-bold text-2xl text-dark-text mb-4">
                8. Partage des données
              </h2>
              <div className="font-body text-dark-text/80 space-y-4">
                <p>Vos données peuvent être partagées avec :</p>
                <ul className="list-disc pl-6 space-y-2">
                  <li><strong>Microsoft Corporation</strong> (Clarity) - États-Unis - Clauses contractuelles types</li>
                  <li><strong>HelloAsso</strong> (paiements) - France</li>
                  <li><strong>Vercel Inc.</strong> (hébergement) - États-Unis - Clauses contractuelles types</li>
                </ul>
                <p>
                  Nous ne vendons jamais vos données personnelles à des tiers.
                </p>
              </div>
            </section>

            <section>
              <h2 className="font-heading font-bold text-2xl text-dark-text mb-4">
                9. Vos droits
              </h2>
              <div className="font-body text-dark-text/80 space-y-4">
                <p>Conformément au RGPD, vous disposez des droits suivants :</p>
                <ul className="list-disc pl-6 space-y-2">
                  <li><strong>Droit d'accès :</strong> obtenir une copie de vos données</li>
                  <li><strong>Droit de rectification :</strong> corriger vos données inexactes</li>
                  <li><strong>Droit à l'effacement :</strong> demander la suppression de vos données</li>
                  <li><strong>Droit à la portabilité :</strong> recevoir vos données dans un format structuré</li>
                  <li><strong>Droit d'opposition :</strong> vous opposer au traitement de vos données</li>
                  <li><strong>Droit à la limitation :</strong> limiter le traitement de vos données</li>
                </ul>
                <p className="mt-4">
                  Pour exercer ces droits, contactez-nous à : 
                  <a href="mailto:associationindigo59@gmail.com" className="text-indigo-primary hover:underline ml-1">
                    associationindigo59@gmail.com
                  </a>
                </p>
                <p>
                  Vous pouvez également introduire une réclamation auprès de la CNIL : 
                  <a href="https://www.cnil.fr" target="_blank" rel="noopener noreferrer" className="text-indigo-primary hover:underline ml-1">
                    www.cnil.fr
                  </a>
                </p>
              </div>
            </section>

            <section>
              <h2 className="font-heading font-bold text-2xl text-dark-text mb-4">
                10. Sécurité
              </h2>
              <div className="font-body text-dark-text/80 space-y-4">
                <p>
                  Nous mettons en œuvre des mesures techniques et organisationnelles appropriées pour 
                  protéger vos données contre tout accès non autorisé, modification, divulgation ou destruction.
                </p>
                <p>
                  Notre site utilise le protocole HTTPS pour sécuriser les échanges de données.
                </p>
              </div>
            </section>

            <section>
              <h2 className="font-heading font-bold text-2xl text-dark-text mb-4">
                11. Modifications
              </h2>
              <div className="font-body text-dark-text/80 space-y-4">
                <p>
                  Nous nous réservons le droit de modifier cette politique de confidentialité à tout moment. 
                  Les modifications entrent en vigueur dès leur publication sur le site.
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
