// Formulaire de contact « L'atelier » : une carte postale. L'envoi passe toujours par EmailJS.
import { useState, type FormEvent } from 'react';
import { Send, Loader2, AlertCircle, CheckCircle } from 'lucide-react';
import { PAPER } from '../atelier/kit';

export default function Contact() {
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [status, setStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setStatus('sending');
    setErrorMessage('');

    // --- IDENTIFIANTS EMAILJS (clé publique, prévue pour être côté navigateur) ---
    const data = {
      service_id: 'service_indigo',
      template_id: 'template_3a5eort',
      user_id: 'VVduH8VzAuhflNyHJ',
      template_params: {
        from_name: formData.name,
        from_email: formData.email,
        message: formData.message,
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
      } else {
        console.error('Erreur EmailJS:', await response.text());
        setStatus('error');
        setErrorMessage(`Le service d'envoi a répondu une erreur (${response.status}). Réessayez, ou écrivez directement à associationindigo59@gmail.com.`);
      }
    } catch (error) {
      console.error('Erreur réseau:', error);
      setStatus('error');
      setErrorMessage("Pas de connexion. Vérifiez votre accès à internet, puis réessayez.");
    }
  };

  const field = 'w-full bg-transparent border-0 border-b-2 border-dashed border-[var(--ink)]/35 px-1 py-2.5 text-lg font-semibold focus:border-solid focus:border-[var(--act)] focus:outline-none placeholder:text-[#7D7AA0]';

  return (
    <form onSubmit={handleSubmit} className="paper relative bg-white" aria-describedby="contact-status">
      <div className="grid md:grid-cols-[1.25fr_1fr]">
        {/* Côté message */}
        <div className="p-7 sm:p-10 md:border-r-2 md:border-dashed md:border-[var(--grid-strong)]">
          <label htmlFor="message" className="display text-xl font-bold">Votre message</label>
          <textarea
            id="message"
            rows={9}
            value={formData.message}
            onChange={(e) => setFormData({ ...formData, message: e.target.value })}
            placeholder="Bonjour, je voudrais savoir…"
            required
            className="mt-3 w-full resize-none bg-transparent text-lg font-semibold leading-[2.2rem] focus:outline-none placeholder:text-[#7D7AA0]"
            style={{
              backgroundImage: 'repeating-linear-gradient(180deg, transparent 0 calc(2.2rem - 2px), #BEDFC8 calc(2.2rem - 2px) 2.2rem)',
              backgroundAttachment: 'local',
            }}
          />
        </div>

        {/* Côté adresse */}
        <div className="relative p-7 sm:p-10">
          <div className="flex items-start justify-between gap-4">
            {/* cachet de la poste */}
            <div aria-hidden className="grid h-20 w-20 rotate-[-14deg] place-items-center rounded-full border-2 border-[var(--ink)]/40 text-center text-[10px] font-extrabold uppercase leading-tight text-[var(--ink)]/60">
              Préseau<br />59990
            </div>
            {/* le timbre : le logo de l'association */}
            <div
              aria-hidden
              className="grid h-24 w-20 shrink-0 rotate-[3deg] place-items-center p-1.5 shadow-[0_6px_12px_-6px_rgba(42,40,78,.4)]"
              style={{ backgroundColor: PAPER.beurre, outline: '3px dotted #fff', outlineOffset: '-4px' }}
            >
              <img src="/logo-indigo.png" alt="" width={56} height={56} className="h-14 w-14" />
            </div>
          </div>

          <div className="mt-8 grid gap-6">
            <div>
              <label htmlFor="name" className="block font-extrabold">Votre nom</label>
              <input id="name" type="text" autoComplete="name" required value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })} className={field} placeholder="Prénom Nom" />
            </div>
            <div>
              <label htmlFor="email" className="block font-extrabold">Votre email</label>
              <input id="email" type="email" autoComplete="email" required value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })} className={field} placeholder="vous@exemple.fr" />
              <p className="mt-1.5 text-sm font-semibold text-[var(--ink-2)]">Pour vous répondre, et rien d'autre.</p>
            </div>
          </div>

          <button
            type="submit"
            disabled={status === 'sending'}
            className="mt-8 inline-flex w-full items-center justify-center gap-2 rounded-full bg-[var(--ink)] px-6 py-4 text-lg font-extrabold text-white hover:bg-[var(--act)] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {status === 'sending' ? <><Loader2 className="animate-spin" size={20} aria-hidden /> Envoi…</> : <><Send size={20} aria-hidden /> Poster le message</>}
          </button>

          <div id="contact-status" aria-live="polite" className="mt-4">
            {status === 'success' && (
              <p className="flex items-start gap-2.5 rounded-md p-4 font-bold" style={{ backgroundColor: '#DDF2E2', color: '#1F5B33' }}>
                <CheckCircle size={20} className="mt-0.5 shrink-0" aria-hidden /> Message envoyé. Nous vous répondons dès que possible.
              </p>
            )}
            {status === 'error' && (
              <p role="alert" className="flex items-start gap-2.5 rounded-md p-4 font-bold" style={{ backgroundColor: '#FDE6E1', color: '#8A2A17' }}>
                <AlertCircle size={20} className="mt-0.5 shrink-0" aria-hidden /> {errorMessage}
              </p>
            )}
          </div>
        </div>
      </div>
    </form>
  );
}
