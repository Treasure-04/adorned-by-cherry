import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import About from "./components/About";
import Services from "./components/Services";
import Gallery from "./components/Gallery";
import Reviews from "./components/Reviews";
import Booking from "./components/Booking";
import FAQ from "./components/FAQ";
import Contact from "./components/Contact";
import WhatsAppButton from "./components/WhatsappButton";
import Admin from "./pages/Admin";
import Shop from "./pages/Shop";

function Home() {
  return (
    <div>
      <Navbar />
      <Hero />
      <About />
      <Services />
      <Gallery />
      <Reviews />
      <Booking />
      <FAQ />
      <Contact />
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/shop" element={<Shop />} />
        <Route path="/admin" element={<Admin />} />
      </Routes>
      <WhatsAppButton />
    </BrowserRouter>
  );
}

export default App;