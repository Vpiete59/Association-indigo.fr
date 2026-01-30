import { useState, FormEvent } from 'react';
import { MapPin, Mail, Facebook, Send, Loader2, AlertCircle, CheckCircle } from 'lucide-react';

export default function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
  });
  
  const [status, setStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setStatus('sending');
    setErrorMessage('');

    // --- VOS IDENTIFIANTS EMAILJS ---
    const serviceID = 'service_indigo';  
    const templateID = 'template_3a5eort'; 
    const publicKey = 'VVduH8VzAuhflNyHJ';   

    const data = {
      service_id: serviceID,
      template_id: templateID,
      user_id: publicKey,
      template_params: {
        from_name: formData.name,   // Vérifiez que votre template EmailJS utilise bien {{from_name}}
        from_email: formData.email, // Vérifiez que votre template utilise bien {{from_email}}
        message: formData.message,  // Vérifiez que votre template utilise bien {{message}}
        to_email: 'associationindigo59@gmail.com',
      },
    };

    try {
      const response = await fetch('https://api.emailjs.com/api/v1.0/email/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        setStatus('success');
        setFormData({ name: '', email: '', message: '' });
        setTimeout(() => setStatus('idle'), 5000);
      } else {
        const errorText = await response.text();
        console.error('Erreur EmailJS:', errorText);
        setStatus('error');
        // Affiche l'erreur à l'écran pour vous aider à comprendre
        setErrorMessage(`Erreur (${response.status}) : ${errorText}`);
      }
    } catch (error) {
      console.error('Erreur réseau:', error);
      setStatus('error');
      setErrorMessage("Erreur de connexion. Vérifiez votre internet.");
    }
  };

  return (
    <section id="contact" className="py-20 bg-white relative overflow-hidden">
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-4xl mx-auto bg-white rounded-[2.5rem] shadow-xl border border-gray-100 overflow-hidden">
          <div className="grid grid-cols-1 md:grid-cols-2">
            
            {/* Colonne Gauche : Infos */}
            <div className="bg-indigo-primary p-10 text-white flex flex-col justify-between relative overflow-hidden">
              {/* Cercles décoratifs */}
              <div className="absolute top-0 right-0 -mt-10 -mr-10 w-40 h-40 bg-white/10 rounded-full blur-2xl"></div>
              <div className="absolute bottom-0 left-0 -mb-10 -ml-10 w-40 h-40 bg-peach-primary/20 rounded-full blur-2xl"></div>
              
              <div>
                <h2 className="font-heading font-bold text-3xl mb-6">Contactez-nous</h2>
                <p className="font-body text-indigo-100 mb-8 leading-relaxed">
                  Une question sur nos ateliers ? Besoin d'échanger sur votre situation ?
                  Nous sommes là pour vous écouter et vous répondre.
                </p>
                
                <div className="space-y-6">
                  {/* Adresse */}
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center flex-shrink-0">
                      <MapPin size={20} className="text-peach-primary" />
                    </div>
                    <div>
                      <h3 className="font-heading font-bold text-lg">Notre Adresse</h3>
                      <p className="font-body text-indigo-100">Mairie de Preseau<br />59990 Preseau</p>
                    </div>
                  </div>

                  {/* Email */}
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center flex-shrink-0">
                      <Mail size={20} className="text-peach-primary" />
                    </div>
                    <div>
                      <h3 className="font-heading font-bold text-lg">Email</h3>
                      <a href="mailto:associationindigo59@gmail.com" className="font-body text-indigo-100 hover:text-white transition-colors">
                        associationindigo59@gmail.com
                      </a>
                    </div>
                  </div>
                </div>
              </div>

              {/* Réseaux Sociaux - UNIQUEMENT FACEBOOK */}
              <div className="mt-12 pt-8 border-t border-white/10">
                <a 
                  href="https://www.facebook.com/groups/467126453152213"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 text-white hover:text-peach-primary transition-colors group"
                >
                  <div className="bg-white/10 p-2 rounded-full group-hover:bg-white/20 transition-colors">
                    <Facebook size={20} />
                  </div>
                  <span className="font-heading font-bold">Rejoignez notre communauté</span>
                </a>
              </div>
            </div>

            {/* Colonne Droite : Formulaire */}
            <div className="p-10 bg-white">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-bold text-dark-text mb-2 font-heading">
                    Votre Nom
                  </label>
                  <input
                    type="text"
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 text-dark-text focus:outline-none focus:ring-2 focus:ring-indigo-primary/50 focus:border-indigo-primary transition-all"
                    placeholder="Votre nom"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-bold text-dark-text mb-2 font-heading">
                    Votre Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 text-dark-text focus:outline-none focus:ring-2 focus:ring-indigo-primary/50 focus:border-indigo-primary transition-all"
                    placeholder="votre@email.com"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="message" className="block text-sm font-bold text-dark-text mb-2 font-heading">
                    Votre Message
                  </label>
                  <textarea
                    id="message"
                    rows={4}
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 text-dark-text focus:outline-none focus:ring-2 focus:ring-indigo-primary/50 focus:border-indigo-primary transition-all resize-none"
                    placeholder="Comment pouvons-nous vous aider ?"
                    required
                  ></textarea>
                </div>

                <button
                  type="submit"
                  disabled={status === 'sending'}
                  className="w-full py-4 px-6 bg-peach-primary text-white font-heading font-bold rounded-xl hover:bg-opacity-90 transition-all shadow-lg hover:shadow-peach-primary/30 flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {status === 'sending' ? (
                    <>
                      <Loader2 className="animate-spin" size={20} />
                      Envoi...
                    </>
                  ) : (
                    <>
                      <Send size={20} />
                      Envoyer le message
                    </>
                  )}
                </button>

                {status === 'success' && (
                  <div className="p-4 bg-green-50 text-green-700 rounded-xl flex items-center gap-3 animate-fade-in border border-green-100">
                    <CheckCircle size={20} />
                    <span className="font-bold text-sm">Message envoyé avec succès !</span>
                  </div>
                )}

                {status === 'error' && (
                  <div className="p-4 bg-red-50 text-red-700 rounded-xl flex flex-col gap-1 animate-fade-in border border-red-100">
                    <div className="flex items-center gap-3">
                        <AlertCircle size={20} />
                        <span className="font-bold text-sm">Erreur lors de l'envoi.</span>
                    </div>
                    {errorMessage && <p className="text-xs ml-8 opacity-80">{errorMessage}</p>}
                  </div>
                )}
              </form>
            </div>

          </div>
        </div>
      </div>
    </section>
  );
}