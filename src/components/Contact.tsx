import { useState, FormEvent } from 'react';
import { MapPin, Mail, Phone, Facebook, Instagram } from 'lucide-react';

export default function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
  });
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    setIsSubmitted(true);
    setTimeout(() => {
      setIsSubmitted(false);
      setFormData({ name: '', email: '', message: '' });
    }, 3000);
  };

  return (
    <section id="contact" className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <h2 className="font-heading font-semibold text-3xl md:text-4xl lg:text-5xl text-center text-dark-text mb-16">
          Contactez-nous
        </h2>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
          <div>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="name" className="block font-body text-dark-text mb-2 font-semibold">
                  Nom <span className="text-peach-primary">*</span>
                </label>
                <input
                  type="text"
                  id="name"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-primary focus:border-transparent transition-all duration-300 font-body"
                  placeholder="Votre nom"
                />
              </div>

              <div>
                <label htmlFor="email" className="block font-body text-dark-text mb-2 font-semibold">
                  Email <span className="text-peach-primary">*</span>
                </label>
                <input
                  type="email"
                  id="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-primary focus:border-transparent transition-all duration-300 font-body"
                  placeholder="votre.email@exemple.fr"
                />
              </div>

              <div>
                <label htmlFor="message" className="block font-body text-dark-text mb-2 font-semibold">
                  Message <span className="text-peach-primary">*</span>
                </label>
                <textarea
                  id="message"
                  required
                  rows={6}
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-primary focus:border-transparent transition-all duration-300 font-body resize-none"
                  placeholder="Votre message..."
                />
              </div>

              <button
                type="submit"
                className="w-full px-8 py-4 bg-indigo-primary text-white font-body font-semibold text-lg rounded-full hover:bg-opacity-90 transition-all duration-300 hover:scale-105 focus:outline-none focus:ring-4 focus:ring-indigo-primary focus:ring-offset-2 shadow-lg"
              >
                {isSubmitted ? 'Message envoyé !' : 'Envoyer'}
              </button>
            </form>
          </div>

          <div className="space-y-8">
            <div>
              <h3 className="font-heading font-medium text-2xl text-dark-text mb-6">
                Informations
              </h3>

              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="bg-light-bg p-3 rounded-full">
                    <MapPin className="text-indigo-primary" size={24} />
                  </div>
                  <div>
                    <p className="font-body text-dark-text text-lg">
                      <strong>Preseau, Nord (59)</strong>
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="bg-light-bg p-3 rounded-full">
                    <Phone className="text-indigo-primary" size={24} />
                  </div>
                  <div>
                    <a
                      href="tel:+33671787579"
                      className="font-body text-dark-text text-lg hover:text-indigo-primary transition-colors duration-300"
                    >
                      +33 6 71 78 75 79
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="bg-light-bg p-3 rounded-full">
                    <Mail className="text-indigo-primary" size={24} />
                  </div>
                  <div>
                    <a
                      href="mailto:associationindigo59@gmail.com"
                      className="font-body text-dark-text text-lg hover:text-indigo-primary transition-colors duration-300"
                    >
                      associationindigo59@gmail.com
                    </a>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <h3 className="font-heading font-medium text-2xl text-dark-text mb-6">
                Suivez-nous
              </h3>

              <div className="space-y-4">
                <a
                  href="https://www.facebook.com/groups/467126453152213"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 px-6 py-4 bg-light-bg rounded-full hover:bg-indigo-primary hover:text-white transition-all duration-300 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-indigo-primary focus:ring-offset-2 group"
                >
                  <Facebook className="text-indigo-primary group-hover:text-white transition-colors duration-300" size={24} />
                  <span className="font-body font-semibold text-dark-text group-hover:text-white transition-colors duration-300">
                    Suivez-nous sur Facebook
                  </span>
                </a>

                <a
                  href="https://www.instagram.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 px-6 py-4 bg-light-bg rounded-full hover:bg-indigo-primary hover:text-white transition-all duration-300 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-indigo-primary focus:ring-offset-2 group"
                >
                  <Instagram className="text-indigo-primary group-hover:text-white transition-colors duration-300" size={24} />
                  <span className="font-body font-semibold text-dark-text group-hover:text-white transition-colors duration-300">
                    Suivez-nous sur Instagram
                  </span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
