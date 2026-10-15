export default function About() {
  return (
    <section id="about" className="bg-ink-light py-24 px-6">
      <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-12 items-center">
        <div className="aspect-square border border-gold/20 overflow-hidden order-2 md:order-1">
          <img src="/studio.jpg" alt="Adorned by Cherry studio" className="w-full h-full object-cover" />
        </div>
        <div className="order-1 md:order-2">
          <p className="text-gold tracking-[0.2em] uppercase text-xs mb-4">About Us</p>
          <h2 className="font-display text-4xl md:text-5xl mb-6">Piercing, done with care</h2>
          <p className="text-ivory/70 text-lg mb-4">Adorned by Cherry was founded on a simple belief: piercing should feel precise, sterile and personal. Every piercing is treated as its own small piece of craftsmanship, and every piece of jewelry is chosen to last.</p>
          <p className="text-ivory/70 text-lg">Based in Port Harcourt, we work by appointment, so each client gets full attention from consultation to aftercare. You can also browse our jewelry collection.</p>
        </div>
      </div>
    </section>
  );
}