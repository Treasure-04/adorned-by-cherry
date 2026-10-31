const piercingNote = "Done with sterile, single-use needles. Aftercare instructions are given at your appointment.";

export const serviceCategories = [
  {
    id: "facial",
    label: "Facial Piercings",
    description: piercingNote,
    items: [
      { name: "Nose", price: 10000, image: "/piercings/nose.jpg" },
      { name: "High Nostril", price: 10000, image: "/piercings/high-nostril.jpg" },
      { name: "Septum", price: 10000, image: "/piercings/septum.jpg" },
      { name: "Bridge", price: 15000, image: "/piercings/bridge.jpg" },
      { name: "Eyebrow", price: 15000, image: "/piercings/brow.jpeg" },
      { name: "Medusa", price: 12000, image: "/piercings/medusa.jpg" },
      { name: "Monroe", price: 12000, image: "/piercings/monroe.jpg" },
      { name: "Labret", price: 12000, image: "/piercings/labret.jpg" },
      { name: "Vertical Labret", price: 12000, image: "/piercings/vertical-labret.jpg" },
      { name: "Cheek / Front Cheek", price: 15000, image: "/piercings/cheek.jpg" },
    ],
  },
  {
    id: "body",
    label: "Body Piercings",
    description: piercingNote,
    items: [
      { name: "Nape", price: 15000, image: "/piercings/nape.jpg" },
      { name: "Nipple", price: 15000, image: "/piercings/nipple.jpg" },
      { name: "Both Nipples", price: 30000, image: "/piercings/nipple.jpg" },
      { name: "Surface", price: 15000, image: "/piercings/surface.jpg" },
      { name: "Dermal", price: 40000, image: "/piercings/dermal.jpg" },
    ],
  },
  {
    id: "oral",
    label: "Oral Piercings",
    description: piercingNote,
    items: [
      { name: "Tongue", price: 15000, image: "/piercings/tongue.jpg" },
      { name: "Smiley", price: 12000, image: "/piercings/smiley.jpeg" },
      { name: "Frowny", price: 12000, image: "/piercings/frowny.jpg" },
    ],
  },
  {
    id: "ear",
    label: "Ear Piercings",
    description: piercingNote,
    items: [
      { name: "Lobe", price: 5000, image: "/piercings/lobe.jpg" },
      { name: "Double Lobe", price: 10000, image: "/piercings/double-lobe.jpg" },
      { name: "Upper Lobe", price: 7000, image: "/piercings/upper-lobe.jpg" },
      { name: "Helix", price: 7000, image: "/piercings/helix.jpg" },
      { name: "Forward Helix", price: 7000, image: "/piercings/forward-helix.jpg" },
      { name: "Flat", price: 7000, image: "/piercings/flat.jpg" },
      { name: "Conch", price: 8000, image: "/piercings/conch.jpg" },
      { name: "Inner Conch", price: 8000, image: "/piercings/inner-conch.jpg" },
      { name: "Daith", price: 8000, image: "/piercings/daith.jpg" },
      { name: "Rook", price: 8000, image: "/piercings/rook.jpg" },
      { name: "Snug", price: 8000, image: "/piercings/snug.jpg" },
      { name: "Tragus", price: 7000, image: "/piercings/tragus.jpeg" },
      { name: "Anti-Tragus", price: 8000, image: "/piercings/anti-tragus.jpg" },
      { name: "Industrial", price: 12000, image: "/piercings/industrial.jpg" },
    ],
  },
];

export const formatNaira = (amount) =>
  new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    maximumFractionDigits: 0,
  }).format(amount);