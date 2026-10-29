export default function Hero() {
  return (
    <section id="home" className="min-h-screen flex items-center bg-ink pt-24 pb-16 px-6 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-ink-light/40 via-ink to-ink" />
      <div className="max-w-6xl mx-auto relative z-10 grid md:grid-cols-2 gap-12 items-center">
        <div>
          <p className="text-gold tracking-[0.2em] uppercase text-xs mb-4">Port Harcourt, Nigeria</p>
          <h1 className="font-display text-4xl sm:text-5xl md:text-7xl leading-tight mb-6">Fine-line piercing.<br /><span className="text-gold">Beautiful</span> jewelry.</h1>
          <p className="text-ivory/70 text-lg mb-8 max-w-md">Adorned by Cherry is a studio built on precision and care. Sterile, expert piercings and fine jewelry, chosen to make you feel adorned, naturally.</p>
          <div className="flex flex-wrap gap-4">
            <a href="#booking" className="bg-gold text-ink px-8 py-3 text-sm tracking-wide font-medium hover:bg-gold-soft transition-colors">Book a Piercing</a>
            <a href="#services" className="border border-gold/50 text-ivory px-8 py-3 text-sm tracking-wide hover:border-gold transition-colors">View Price List</a>
          </div>
        </div>
        <div className="w-full max-w-sm mx-auto md:max-w-none aspect-square bg-black border border-gold/20 flex items-center justify-center overflow-hidden">
          <img src="/logo.jpg" alt="Adorned by Cherry" className="w-full h-full object-contain" />
        </div>
      </div>
    </section>
  );
}