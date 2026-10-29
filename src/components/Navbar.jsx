import { useState } from "react";

const navLinks = [
  { label: "Home", href: "#home" },
  { label: "About", href: "#about" },
  { label: "Services", href: "#services" },
  { label: "Gallery", href: "#gallery" },
  { label: "Reviews", href: "#reviews" },
  { label: "FAQ", href: "#faq" },
  { label: "Contact", href: "#contact" },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 w-full z-50 bg-ink/90 backdrop-blur-md border-b border-gold/20">
      <div className="max-w-6xl mx-auto flex items-center justify-end md:justify-center px-6 py-4">
        <nav className="hidden md:flex items-center gap-10 font-body text-sm tracking-wide text-ivory/90">
          {navLinks.map((link) => (
            <a key={link.href} href={link.href} className="hover:text-gold transition-colors">{link.label}</a>
          ))}
        </nav>
        <button className="md:hidden text-gold text-2xl" onClick={() => setOpen(!open)} aria-label="Toggle menu">{open ? "✕" : "☰"}</button>
      </div>

      {open && (
        <nav className="md:hidden bg-ink-light border-t border-gold/20 px-6 py-4 flex flex-col gap-4">
          {navLinks.map((link) => (
            <a key={link.href} href={link.href} onClick={() => setOpen(false)} className="text-ivory/90 hover:text-gold transition-colors">{link.label}</a>
          ))}
        </nav>
      )}
    </header>
  );
}