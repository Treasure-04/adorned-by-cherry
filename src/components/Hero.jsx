import { Link } from "react-router-dom";

export default function Hero() {
  return (
    <section id="home" className="min-h-screen flex items-center bg-ink pt-24 pb-16 px-6 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-ink-light/40 via-ink to-ink" />
      <div className="max-w-6xl mx-auto w-full relative grid md:grid-cols-2 gap-8 md:gap-12 items-center">
        <div className="flex justify-center">
          <img src="/logo.jpg" alt="Adorned by Cherry" className="hero-logo mix-blend-lighten w-52 sm:w-60 md:w-full md:max-w-md" />
        </div>
        <div>
          <p className="hero-item text-gold tracking-[0.2em] uppercase text-xs mb-4" style={{ animationDelay: "1s" }}>Port Harcourt, Nigeria</p>
          <h1 className="hero-item font-display text-4xl sm:text-5xl md:text-6xl lg:text-7xl leading-tight mb-6" style={{ animationDelay: "1.3s" }}>Fine-line piercing.<br /><span className="text-gold">Beautiful</span> jewelry.</h1>
          <p className="hero-item text-ivory/70 text-lg mb-8 max-w-md" style={{ animationDelay: "1.6s" }}>Adorned by Cherry is a studio built on precision and care. Sterile, expert piercings and fine jewelry, chosen to make you feel adorned, naturally.</p>
          <div className="hero-item flex flex-wrap gap-4" style={{ animationDelay: "1.9s" }}>
            <a href="#booking" className="bg-gold text-ink px-8 py-3 text-sm tracking-wide font-medium hover:bg-gold-soft transition-colors">Book a Piercing</a>
            <a href="#services" className="border border-gold/50 text-ivory px-8 py-3 text-sm tracking-wide hover:border-gold transition-colors">View Price List</a>
            <Link to="/shop" className="border border-gold text-gold px-8 py-3 text-sm tracking-wide hover:bg-gold hover:text-ink transition-colors">Shop Jewelry</Link>
          </div>
        </div>
      </div>
    </section>
  );
}