import { contact } from "../data/contact";

export default function Contact() {
  const whatsappLink = "https://wa.me/" + contact.whatsapp + "?text=" + encodeURIComponent("Hello Adorned by Cherry, I would like to ask about a piercing.");
  const mapLink = "https://www.google.com/maps/search/?api=1&query=" + encodeURIComponent(contact.address);
  const socials = contact.socials.filter((s) => s.url);

  return (
    <section id="contact" className="bg-ink-light pt-24 pb-10 px-6">
      <div className="max-w-4xl mx-auto">
        <p className="text-gold tracking-[0.2em] uppercase text-xs mb-4 text-center">Contact</p>
        <h2 className="font-display text-4xl md:text-5xl mb-4 text-center">Get in touch</h2>
        <p className="text-ivory/60 text-center mb-10">Questions about a piercing or an appointment? Message us on WhatsApp and we will reply as soon as we can.</p>

        <div className="text-center mb-12">
          <a href={whatsappLink} target="_blank" rel="noreferrer" className="inline-block bg-gold text-ink px-10 py-4 text-sm tracking-wide font-medium hover:bg-gold-soft transition-colors">Chat on WhatsApp</a>
        </div>

        <div className="grid sm:grid-cols-3 gap-6 mb-12">
          <div className="border border-gold/20 p-6 text-center">
            <p className="text-gold text-xs tracking-[0.2em] uppercase mb-2">Call</p>
            <a href={"tel:" + contact.phone} className="text-ivory/80 hover:text-gold transition-colors">{contact.phone}</a>
          </div>
          <div className="border border-gold/20 p-6 text-center">
            <p className="text-gold text-xs tracking-[0.2em] uppercase mb-2">Email</p>
            <a href={"mailto:" + contact.email} className="text-ivory/80 hover:text-gold transition-colors break-words">{contact.email}</a>
          </div>
          <div className="border border-gold/20 p-6 text-center">
            <p className="text-gold text-xs tracking-[0.2em] uppercase mb-2">Visit</p>
            <p className="text-ivory/80 mb-2">{contact.address}</p>
            <a href={mapLink} target="_blank" rel="noreferrer" className="text-gold text-sm hover:text-gold-soft transition-colors">Get directions</a>
          </div>
        </div>

        {socials.length > 0 && (
          <div className="flex justify-center flex-wrap gap-6 mb-12">
            {socials.map((s) => (
              <a key={s.name} href={s.url} target="_blank" rel="noreferrer" className="text-ivory/70 hover:text-gold transition-colors text-sm tracking-wide">{s.name}</a>
            ))}
          </div>
        )}

        <p className="text-center text-ivory/30 text-xs pt-8 border-t border-gold/10">© {new Date().getFullYear()} Adorned by Cherry. All rights reserved.</p>
      </div>
    </section>
  );
}