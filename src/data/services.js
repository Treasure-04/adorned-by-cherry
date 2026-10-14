const piercingNote = "Done with sterile, single-use needles. Aftercare instructions are given at your appointment.";

export const serviceCategories = [
  {
    id: "facial",
    label: "Facial Piercings",
    description: piercingNote,
    items: [
      { name: "Nose", price: 10000 },
      { name: "High Nostril", price: 10000 },
      { name: "Septum", price: 10000 },
      { name: "Bridge", price: 15000 },
      { name: "Eyebrow", price: 15000 },
      { name: "Medusa", price: 12000 },
      { name: "Monroe", price: 12000 },
      { name: "Labret", price: 12000 },
      { name: "Vertical Labret", price: 12000 },
      { name: "Cheek / Front Cheek", price: 15000 },
    ],
  },
  {
    id: "body",
    label: "Body Piercings",
    description: piercingNote,
    items: [
      { name: "Nape", price: 15000 },
      { name: "Nipple", price: 15000 },
      { name: "Both Nipples", price: 30000 },
      { name: "Surface", price: 15000 },
      { name: "Dermal", price: 40000 },
    ],
  },
  {
    id: "oral",
    label: "Oral Piercings",
    description: piercingNote,
    items: [
      { name: "Tongue", price: 15000 },
      { name: "Smiley", price: 12000 },
      { name: "Frowny", price: 12000 },
    ],
  },
  {
    id: "ear",
    label: "Ear Piercings",
    description: piercingNote,
    items: [
      { name: "Lobe", price: 5000 },
      { name: "Double Lobe", price: 10000 },
      { name: "Upper Lobe", price: 7000 },
      { name: "Helix", price: 7000 },
      { name: "Forward Helix", price: 7000 },
      { name: "Flat", price: 7000 },
      { name: "Conch", price: 8000 },
      { name: "Inner Conch", price: 8000 },
      { name: "Daith", price: 8000 },
      { name: "Rook", price: 8000 },
      { name: "Snug", price: 8000 },
      { name: "Tragus", price: 7000 },
      { name: "Anti-Tragus", price: 8000 },
      { name: "Industrial", price: 12000 },
    ],
  },
];

export const formatNaira = (amount) =>
  new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    maximumFractionDigits: 0,
  }).format(amount);