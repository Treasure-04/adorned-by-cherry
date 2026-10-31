import { Link } from "react-router-dom";
import { contact } from "../data/contact";

export default function Shop() {
  const whatsappLink = "https://wa.me/" + contact.whatsapp + "?text=" + encodeURIComponent("Hello Adorned by Cherry, I would like to ask about your jewelry.");

  return (
    <div className="min-h-screen bg-ink flex flex-col items-center justify-center px-6 text-center">
      <p className="text-gold tracking-[0.2em] uppercase text-xs mb-4">Jewelry</p>
      <h1 className="font-display text-4xl md:text-6xl mb-4">Our jewelry shop is coming soon</h1>
      <p className="text-ivory/60 max-w-md mb-8">We are putting the finishing touches on our collection. In the meantime, message us on WhatsApp to ask what is available.</p>
      <div className="flex flex-wrap justify-center gap-4">
        <a href={whatsappLink} target="_blank" rel="noreferrer" className="bg-gold text-ink px-8 py-3 text-sm tracking-wide font-medium hover:bg-gold-soft transition-colors">Ask on WhatsApp</a>
        <Link to="/" className="border border-gold text-gold px-8 py-3 text-sm tracking-wide hover:bg-gold hover:text-ink transition-colors">Back to home</Link>
      </div>
    </div>
  );
}