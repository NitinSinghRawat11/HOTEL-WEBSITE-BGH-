import React, { useState, useEffect } from 'react';
import {
    Mountain,
    Star,
    Car,
    Phone,
    Mail,
    MapPin,
    ShieldCheck,
    Compass,
    ExternalLink,
    Calendar,
    Users,
    Clock,
    X,
    CheckCircle2,
    ChevronRight,
    Loader2,
    Camera,
    Map as MapIcon,
    Landmark,
    Snowflake,
    Navigation,
    Info,
    MapPinned,
    Pointer,
    Instagram,
    Flame,
    Tent,
    Waves,
    Footprints,
    History,
    MessageSquare,
    Maximize2
} from 'lucide-react';
import { initializeApp } from 'firebase/app';
import { 
  getFirestore, collection, addDoc, onSnapshot, 
  query, where, doc, deleteDoc 
} from 'firebase/firestore';
import { 
  getAuth, signInAnonymously, onAuthStateChanged, 
  signInWithCustomToken 
} from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyBUb-NJSdPVAukQjHw5WY55iUpPxVTj72k",
  authDomain: "balram-guest-house.firebaseapp.com",
  projectId: "balram-guest-house",
  storageBucket: "balram-guest-house.firebasestorage.app",
  messagingSenderId: "440246375012",
  appId: "1:440246375012:web:456d140412cd9bbf400571",
  measurementId: "G-CBF5R1KB1V"
};
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const appId = typeof __app_id !== 'undefined' ? __app_id : 'Balram-Guest-House';

const App = () => {
  const [user, setUser] = useState(null);
  const [scrolled, setScrolled] = useState(false);
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [isTaxiOpen, setIsTaxiOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [notification, setNotification] = useState(null);
  
  // Hero Slideshow Logic
  const [currentSlide, setCurrentSlide] = useState(0);
  const heroSlides = [
    "/bbh1.jpeg",
    "https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?auto=format&fit=crop&q=80&w=1600",
    "/bbh2.jpg",
  ];

  const instagramHandle = "@_himalayan_stories";

  const galleryImages = [
    { url: "/joshimath.jpg", title: "Snow over Joshimath", size: "large" },
    { url: "/mountains.jpeg", title: "Morning View", size: "small" },
    { url: "/dining.jpeg", title: "Dining Area with best mountain View", size: "small" },
    { url: "/bbh3.jpeg", title: "Evening Terrace View", size: "wide" },
    { url: "/sunrise.jpeg", title: "Himalayan Sunrise", size: "small" },
    { url: "/front.jpeg", title: "Clean Entrance", size: "small" },
    { url: "/Auli1.jpg", title: "Snow Covered Surroundings", size: "small" },
    { url: "/Auli2.jpg", title: "Snow Capped Peak - Mount NANDA DEVI", size: "small" },
    { url: "/i1.jpg", title: "Sunset View", size: "small" },
    { url: "/badrinath2.jpg", title: "Badrinath Mandir", size: "large" },
    { url: "/balcony.jpeg", title: "Mountain View from Balram Guest House", size: "large" },
    { url: "/front1.jpg", title: "Hotel Parking", size: "large" },
    { url: "/i2.jpg", title: "Winter Snow", size: "large" },
    { url: "/narshing-mandir.jpg", title: "Narshing Temple", size: "small" },
    { url: "/snow.jpg", title: "Sunset over Snow cover Peaks", size: "small" },
    { url: "/dining-view.jpg", title: "View from our hotel dining area", size: "large" },
    { url: "/front5.jpg", title: "Mountain View from Balram Guest House", size: "large" },
    { url: "/dining view.jpg", title: "Dining Area with best mountain View", size: "large" },
  ];

 const attractions = [
    { 
      name: "Narsingh Temple", 
      category: "spiritual", 
      distance: "0.5 km", 
      desc: "The winter seat of Badrinath and a historic 1200-year-old temple.", 
      icon: <Landmark className="w-5 h-5" />, 
      img: "/narshing-mandir.jpg" 
    },
    { 
      name: "Badrinath Temple", 
      category: "spiritual", 
      distance: "45 km", 
      desc: "The sacred pinnacle of the Char Dham Yatra, dedicated to Lord Vishnu.", 
      icon: <Flame className="w-5 h-5" />, 
      img: "/badrinath2.jpg" 
    },
    { 
      name: "Auli Ski Resort", 
      category: "adventure", 
      distance: "12 km", 
      desc: "India's premier skiing destination with stunning panoramic Himalayan views.", 
      icon: <Snowflake className="w-5 h-5" />, 
      img: "/auli.jpg" 
    },
    { 
      name: "Valley of Flowers", 
      category: "nature", 
      distance: "25 km", 
      desc: "A UNESCO World Heritage site featuring hundreds of species of wildflowers.", 
      icon: <Tent className="w-5 h-5" />, 
      img: "/valley-of-flower.jpg" 
    },
    { 
      name: "Bhavishya Badri", 
      category: "spiritual", 
      distance: "17 km + Small Trek", 
      desc: "The 'Future Badrinath' temple nestled in a serene cedar forest, reached by a beautiful 3km trek.", 
      icon: <History className="w-5 h-5" />, 
      img: "/Bhavishya-badri.png" 
    },
    { 
      name: "Niti-Malari Valley", 
      category: "adventure", 
      distance: "85 km", 
      desc: "Known as the 'Ladakh of Uttarakhand,' this remote border valley offers raw Himalayan beauty and Bhotia culture.", 
      icon: <Compass className="w-5 h-5" />, 
      img: "/NITI.jpg" 
    },
    { 
      name: "India's First Village- MANA", 
      category: "Spiritual", 
      distance: "50 km + Trek", 
      desc: "Known as the 'First Village of India,' Mana is a quaint hamlet near Badrinath, rich in mythology and natural beauty.", 
      icon: <Compass className="w-5 h-5" />, 
      img: "/MANA.jpg" 
    }
  ];

  const suites = [
    { name: "Nanda Devi Royal Suite", price: 2000, features: ["Panoramic Peak View", "King Size Bed"], img: "/four-bed.jpg" },
    { name: "Heritage Triple Room", price: 1800, features: ["Traditional Decor", "Mountain View"], img: "/three-bed.jpg" }
  ];

  const [formData, setFormData] = useState({ roomType: 'Heritage Double Room', checkIn: '', checkOut: '', name: '', phone: '' });
  const [taxiData, setTaxiData] = useState({ destination: 'Auli Ski Resort', date: '' });

  useEffect(() => {
    const initAuth = async () => {
      try {
        if (typeof __initial_auth_token !== 'undefined' && __initial_auth_token) {
          await signInWithCustomToken(auth, __initial_auth_token);
        } else {
          await signInAnonymously(auth);
        }
      } catch (err) { console.error("Auth failed", err); }
    };
    initAuth();
    const unsubscribe = onAuthStateChanged(auth, (user) => setUser(user));
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Slide interval timer
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const handleBookingSubmit = async (e) => {
    e.preventDefault();
    if (!user) return;
    setLoading(true);
    try {
      await addDoc(collection(db, 'artifacts', appId, 'users', user.uid, 'bookings'), { ...formData, status: 'Confirmed', createdAt: new Date().toISOString() });
      setNotification("Reservation Confirmed!");
      setIsBookingOpen(false);
      setTimeout(() => setNotification(null), 3000);
    } catch (err) { console.error(err); } finally { setLoading(false); }
  };

  const handleTaxiSubmit = async (e) => {
    e.preventDefault();
    if (!user) return;
    setLoading(true);
    try {
      await addDoc(collection(db, 'artifacts', appId, 'users', user.uid, 'taxis'), { ...taxiData, status: 'Requested', createdAt: new Date().toISOString() });
      setNotification("Taxi Service Requested!");
      setIsTaxiOpen(false);
      setTimeout(() => setNotification(null), 3000);
    } catch (err) { console.error(err); } finally { setLoading(false); }
  };

  const scrollToSection = (id) => {
    const element = document.getElementById(id);
    if (element) {
      window.scrollTo({ top: element.offsetTop - 80, behavior: 'smooth' });
    }
  };

  return (
    <div className="bg-[#fcfaf7] text-[#3d2b1f] min-h-screen font-serif">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,600;0,700;1,400&family=Outfit:wght@300;400;600&display=swap');
        h1, h2, h3, h4 { font-family: 'Cormorant Garamond', serif; }
        body { font-family: 'Outfit', sans-serif; }
        
        .ken-burns {
          animation: kenburns 15s ease-out infinite alternate;
        }
        @keyframes kenburns {
          from { transform: scale(1); }
          to { transform: scale(1.15); }
        }
      `}</style>

      {/* Notification Toast */}
      {notification && (
        <div className="fixed top-24 left-1/2 -translate-x-1/2 z-[100] bg-green-600 text-white px-6 py-3 rounded-full shadow-2xl flex items-center gap-3 animate-bounce">
          <CheckCircle2 className="w-5 h-5" />
          <span className="text-sm font-bold uppercase tracking-widest">{notification}</span>
        </div>
      )}

      {/* Nav */}
      <nav className={`fixed top-0 w-full z-50 transition-all duration-500 ${scrolled ? 'py-3 bg-white shadow-md' : 'py-6 bg-transparent'}`}>
        <div className="container mx-auto px-6 flex justify-between items-center">
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => window.scrollTo({top: 0, behavior: 'smooth'})}>
            <div className="w-10 h-10 bg-[#8b4513] rounded-sm flex items-center justify-center rotate-45">
              <Mountain className="text-white w-5 h-5 -rotate-45" />
            </div>
            <div>
              <h1 className={`text-xl font-bold tracking-tight leading-none ${scrolled ? 'text-[#5d3a1a]' : 'text-white'}`}>BALRAM</h1>
              <p className={`text-[8px] tracking-[0.3em] font-bold uppercase ${scrolled ? 'text-[#a67c52]' : 'text-[#e5d9c9]'}`}>Guest House</p>
            </div>
          </div>
          <div className={`hidden md:flex items-center gap-8 text-[11px] font-semibold uppercase tracking-widest ${scrolled ? 'text-[#3d2b1f]' : 'text-white'}`}>
            <button onClick={() => scrollToSection('rooms')} className="hover:text-[#8b4513]">Suites</button>
            <button onClick={() => scrollToSection('gallery')} className="hover:text-[#8b4513]">Gallery</button>
            <button onClick={() => scrollToSection('explore')} className="hover:text-[#8b4513]">Explore</button>
            <button onClick={() => scrollToSection('contact')} className="hover:text-[#8b4513]">Contact</button>
            <button onClick={() => setIsBookingOpen(true)} className="bg-[#d97706] text-white px-6 py-2.5 rounded-sm shadow-lg hover:bg-[#b45309] transition-colors">Book Now</button>
          </div>
        </div>
      </nav>

      {/* Hero Section with Animated Slideshow */}
      <section className="relative h-screen flex items-center justify-center text-center overflow-hidden">
        {/* Slideshow Container */}
        <div className="absolute inset-0 z-0">
          {heroSlides.map((slide, index) => (
            <div
              key={index}
              className={`absolute inset-0 transition-opacity duration-[2000ms] ease-in-out ${index === currentSlide ? 'opacity-100' : 'opacity-0'}`}
            >
              <img 
                src={slide} 
                className="w-full h-full object-cover ken-burns" 
                alt={`Heritage Scene ${index + 1}`} 
              />
              <div className="absolute inset-0 bg-black/40" />
            </div>
          ))}
        </div>

        {/* Hero Content */}
        <div className="relative z-10 px-6">
          <span className="text-white uppercase tracking-[0.5em] text-sm mb-6 block font-bold animate-in fade-in slide-in-from-bottom-4 duration-1000">
            Joshimath, Uttarakhand
          </span>
          <h2 className="text-7xl md:text-[10rem] text-white mb-8 italic drop-shadow-2xl leading-none animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-200">
            Timeless <span className="not-italic font-bold">Peace</span>
          </h2>
          <div className="animate-in fade-in slide-in-from-bottom-12 duration-1000 delay-500">
            <button onClick={() => setIsBookingOpen(true)} className="bg-[#d97706] text-white px-12 py-5 font-bold uppercase tracking-widest text-xs hover:bg-[#b45309] transition-all shadow-2xl">
              Reserve Now
            </button>
          </div>
        </div>

        {/* Slide Indicators */}
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex gap-3 z-20">
          {heroSlides.map((_, i) => (
            <div 
              key={i} 
              className={`h-1 transition-all duration-500 rounded-full ${i === currentSlide ? 'w-8 bg-[#d97706]' : 'w-4 bg-white/30'}`}
            />
          ))}
        </div>
      </section>

      {/* Attractions */}
      <section id="explore" className="py-24 bg-white">
        <div className="container mx-auto px-6 text-center mb-16">
          <span className="text-[#a67c52] uppercase tracking-[0.3em] text-xs font-bold mb-4 block">Himalayan Discovery Guide</span>
          <h2 className="text-5xl md:text-6xl font-bold mb-4">Nearby <span className="italic font-normal">Sights &</span> Shrines</h2>
        </div>
        <div className="container mx-auto px-6 grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {attractions.map((place, i) => (
            <div key={i} className="group bg-[#fcfaf7] border border-[#e5d9c9] rounded-sm overflow-hidden hover:shadow-xl transition-all">
              <div className="h-48 overflow-hidden relative">
                <img src={place.img} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" alt={place.name} />
                <div className="absolute bottom-4 right-4 bg-white/90 px-2 py-1 text-[9px] font-bold rounded-full">{place.distance}</div>
              </div>
              <div className="p-6">
                <div className="flex items-center gap-2 text-[#d97706] mb-2">{place.icon} <span className="text-[9px] font-bold uppercase tracking-widest opacity-60">{place.category}</span></div>
                <h4 className="text-xl font-bold mb-2">{place.name}</h4>
                <p className="text-xs text-gray-500 mb-6 leading-relaxed">{place.desc}</p>
                <button onClick={() => { setTaxiData({...taxiData, destination: place.name}); setIsTaxiOpen(true); }} className="w-full border py-2 text-[9px] font-bold uppercase tracking-widest hover:bg-[#3d2b1f] hover:text-white transition-colors">Book Taxi</button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Rooms */}
      <section id="rooms" className="py-24 bg-[#fdfaf6]">
        <div className="container mx-auto px-6 grid md:grid-cols-2 gap-12">
          {suites.map((suite, idx) => (
            <div key={idx} className="group cursor-pointer">
              <div className="relative overflow-hidden mb-8 aspect-video rounded-sm shadow-xl">
                <img src={suite.img} className="w-full h-full object-cover group-hover:scale-110 transition-transform" alt={suite.name} />
                <div className="absolute top-6 left-6 bg-white/90 px-4 py-2 text-[10px] font-bold uppercase text-[#8b4513]">From ₹{suite.price}</div>
              </div>
              <h3 className="text-3xl font-bold mb-4">{suite.name}</h3>
              <button onClick={() => { setFormData({...formData, roomType: suite.name}); setIsBookingOpen(true); }} className="bg-[#3d2b1f] text-white px-8 py-3 font-bold uppercase text-[10px] tracking-widest hover:bg-[#d97706] transition-colors">Select Suite</button>
            </div>
          ))}
        </div>
      </section>

      {/* Gallery Section */}
      <section id="gallery" className="py-24 bg-white overflow-hidden">
        <div className="container mx-auto px-6">
          <div className="mb-16">
            <span className="text-[#a67c52] uppercase tracking-[0.3em] text-xs font-bold mb-4 block">Visual Heritage</span>
            <h2 className="text-5xl md:text-6xl font-bold">Through <span className="italic font-normal">Our Lens</span></h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 auto-rows-[250px]">
            {galleryImages.map((img, i) => (
              <div 
                key={i} 
                className={`group relative overflow-hidden rounded-sm cursor-pointer shadow-md hover:shadow-2xl transition-all duration-500
                  ${img.size === 'large' ? 'md:row-span-2 md:col-span-1' : ''}
                  ${img.size === 'wide' ? 'md:col-span-2' : ''}
                `}
                onClick={() => setSelectedImage(img)}
              >
                <div className="absolute inset-0 bg-[#3d2b1f]/20 group-hover:bg-transparent transition-colors z-10" />
                <img src={img.url} alt={img.title} className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-1000" />
                <div className="absolute inset-x-0 bottom-0 p-6 bg-gradient-to-t from-black/80 to-transparent translate-y-full group-hover:translate-y-0 transition-transform z-20">
                   <p className="text-white text-xs font-bold uppercase tracking-widest flex items-center gap-2">
                    <Maximize2 className="w-3 h-3" /> {img.title}
                   </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-24 bg-[#fcfaf7] border-t border-[#e5d9c9]">
        <div className="container mx-auto px-6">
          <div className="grid lg:grid-cols-3 gap-16">
            <div>
              <span className="text-[#a67c52] uppercase tracking-[0.3em] text-xs font-bold mb-6 block">Get in Touch</span>
              <h2 className="text-5xl font-bold text-[#3d2b1f] mb-8 leading-tight">Start Your <span className="italic font-normal">Journey</span></h2>
              
              <div className="space-y-8">
                {/* Location */}
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-white border border-[#e5d9c9] flex items-center justify-center rounded-sm shrink-0">
                    <MapPin className="text-[#d97706] w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-lg mb-1">Our Location</h4>
                    <p className="text-sm text-gray-500">Near Indian Oil Petrol Pump, Joshimath, Uttarakhand 246443</p>
                  </div>
                </div>
                
                {/* Call Us */}
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-white border border-[#e5d9c9] flex items-center justify-center rounded-sm shrink-0">
                    <Phone className="text-[#d97706] w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-lg mb-1">Call Us</h4>
                    <a href="tel:+917579134041" className="text-sm text-gray-500 hover:text-[#d97706] transition-colors">+91 7579134041</a>
                  </div>
                </div>

                {/* Email Us */}
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-white border border-[#e5d9c9] flex items-center justify-center rounded-sm shrink-0">
                    <Mail className="text-[#d97706] w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-lg mb-1">Email Us</h4>
                    <a href="mailto:balramheritage@gmail.com" className="text-sm text-gray-500 hover:text-[#d97706] transition-colors">balramguesthouse11@gmail.com</a>
                  </div>
                </div>
              </div>
            </div>

            <div className="lg:col-span-2">
              <div className="grid md:grid-cols-2 gap-8 h-full">
                <div className="p-8 bg-white border border-[#e5d9c9] rounded-sm group hover:border-[#d97706] transition-colors shadow-sm flex flex-col justify-between">
                  <div>
                    <div className="flex justify-between items-start mb-6">
                      <div className="bg-[#d97706]/10 p-3 rounded-sm"><MessageSquare className="text-[#d97706] w-6 h-6" /></div>
                      <span className="bg-green-100 text-green-700 text-[9px] font-bold uppercase tracking-widest px-2 py-1 rounded-full">Available</span>
                    </div>
                    <h4 className="text-xl font-bold mb-2">General Manager</h4>
                    <p className="text-xs text-gray-500 mb-6">Inquire about group bookings, corporate events or long-term stays.</p>
                  </div>
                  <a href="tel:+919520221151" className="text-[10px] font-bold uppercase tracking-widest text-[#d97706] flex items-center gap-2 group-hover:gap-4 transition-all">
                    WhatsApp Manager <ChevronRight className="w-4 h-4" />
                  </a>
                </div>

                <div className="p-8 bg-white border border-[#e5d9c9] rounded-sm group hover:border-[#d97706] transition-colors shadow-sm flex flex-col justify-between">
                  <div>
                    <div className="flex justify-between items-start mb-6">
                      <div className="bg-[#d97706]/10 p-3 rounded-sm"><Car className="text-[#d97706] w-6 h-6" /></div>
                      <span className="bg-blue-100 text-blue-700 text-[9px] font-bold uppercase tracking-widest px-2 py-1 rounded-full">Tours</span>
                    </div>
                    <h4 className="text-xl font-bold mb-2">Transport Desk</h4>
                    <p className="text-xs text-gray-500 mb-6">Schedule your Badrinath Darshan or Auli skiing equipment transport.</p>
                  </div>
                  <a href="tel:+917579134041" className="text-[10px] font-bold uppercase tracking-widest text-[#d97706] flex items-center gap-2 group-hover:gap-4 transition-all">
                    Speak to Driver <ChevronRight className="w-4 h-4" />
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Instagram Section */}
      <section className="py-24 bg-[#1a120b] text-white">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
            <div>
              <div className="flex items-center gap-2 mb-4 text-[#d97706]">
                <Instagram className="w-5 h-5" />
                <span className="text-xs font-bold uppercase tracking-widest">Connect on Social</span>
              </div>
              <h2 className="text-5xl font-bold italic">Capture the <span className="not-italic">Spirit</span></h2>
            </div>
            <a href={`https://instagram.com/_himalayan_stories`} className="bg-white/10 hover:bg-white/20 border border-white/10 px-8 py-4 rounded-sm transition-all text-[10px] font-bold uppercase tracking-widest">
              Follow {instagramHandle}
            </a>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
  {[
    { type: 'image', src: '/insta1.jpg' },
    { type: 'video', src: '/insta4.mp4' },
    { type: 'image', src: '/insta2.jpg' },
    { type: 'image', src: '/insta3.jpg' },
  ].map((item, i) => (
    <div key={i} className="aspect-square bg-white/5 rounded-sm overflow-hidden relative group cursor-pointer">
      {item.type === 'video' ? (
        <video 
          src={item.src} 
          className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700"
          muted 
          loop 
          onMouseEnter={e => e.target.play()}
          onMouseLeave={e => e.target.pause()}
        />
      ) : (
        <img src={item.src} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700" />
      )}
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity z-10 flex items-center justify-center">
        <Instagram className="w-6 h-6 text-white" />
      </div>
    </div>
  ))}
</div>
        </div>
      </section>

      {/* Image Lightbox */}
      {selectedImage && (
        <div className="fixed inset-0 z-[110] bg-black/95 flex items-center justify-center p-4 animate-in fade-in duration-300" onClick={() => setSelectedImage(null)}>
           <button className="absolute top-10 right-10 text-white hover:rotate-90 transition-transform"><X className="w-10 h-10" /></button>
           <div className="max-w-5xl w-full" onClick={e => e.stopPropagation()}>
              <img src={selectedImage.url} className="w-full h-auto max-h-[85vh] object-contain rounded-sm" alt={selectedImage.title} />
              <p className="text-white mt-6 text-center italic text-xl">{selectedImage.title}</p>
           </div>
        </div>
      )}

      {/* Reservation Modal */}
      {isBookingOpen && (
        <div className="fixed inset-0 z-[100] bg-[#3d2b1f]/90 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-[#fcfaf7] w-full max-w-4xl rounded-sm overflow-hidden shadow-2xl relative animate-in zoom-in-95 duration-300">
            <button onClick={() => setIsBookingOpen(false)} className="absolute top-6 right-6 text-[#3d2b1f] hover:rotate-90 transition-transform"><X className="w-8 h-8" /></button>
            <div className="flex flex-col md:flex-row">
              <div className="md:w-1/3 bg-[#3d2b1f] p-12 text-white">
                <h3 className="text-4xl font-bold italic mb-6">Reservation</h3>
                <p className="text-sm opacity-60">Secure your stay in the sacred town of Joshimath.</p>
              </div>
              <div className="md:w-2/3 p-12">
                <form onSubmit={handleBookingSubmit} className="grid grid-cols-2 gap-6">
                  <div className="col-span-2 space-y-2">
                    <label className="text-[10px] uppercase font-bold tracking-widest text-gray-400">Select Suite</label>
                    <select className="w-full border-b border-[#e5d9c9] bg-transparent py-3 focus:outline-none" value={formData.roomType} onChange={e => setFormData({...formData, roomType: e.target.value})}>
                      {suites.map(s => <option key={s.name} value={s.name}>{s.name} - ₹{s.price}</option>)}
                    </select>
                  </div>
                  <input required placeholder="Full Name" type="text" className="col-span-2 border-b border-[#e5d9c9] bg-transparent py-3 focus:outline-none focus:border-[#d97706]" onChange={e => setFormData({...formData, name: e.target.value})} />
                  <input required placeholder="Phone Number" type="tel" className="col-span-2 border-b border-[#e5d9c9] bg-transparent py-3 focus:outline-none focus:border-[#d97706]" onChange={e => setFormData({...formData, phone: e.target.value})} />
                  <div className="space-y-2">
                    <label className="text-[10px] uppercase font-bold text-gray-400">Check In</label>
                    <input required type="date" className="w-full border-b border-[#e5d9c9] bg-transparent py-3" onChange={e => setFormData({...formData, checkIn: e.target.value})} />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] uppercase font-bold text-gray-400">Check Out</label>
                    <input required type="date" className="w-full border-b border-[#e5d9c9] bg-transparent py-3" onChange={e => setFormData({...formData, checkOut: e.target.value})} />
                  </div>
                  <button disabled={loading} className="col-span-2 bg-[#d97706] text-white py-4 font-bold uppercase tracking-widest text-xs flex justify-center hover:bg-[#b45309] transition-colors">
                    {loading ? <Loader2 className="animate-spin w-4 h-4" /> : "Confirm Reservation"}
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Taxi Modal */}
      {isTaxiOpen && (
        <div className="fixed inset-0 z-[100] bg-[#3d2b1f]/90 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-[#fcfaf7] w-full max-w-lg rounded-sm p-12 relative animate-in zoom-in-95">
            <button onClick={() => setIsTaxiOpen(false)} className="absolute top-6 right-6 hover:rotate-90 transition-transform"><X /></button>
            <h3 className="text-4xl font-bold italic mb-8">Hire a Driver</h3>
            <form onSubmit={handleTaxiSubmit} className="space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] uppercase font-bold text-gray-400">Destination</label>
                <select className="w-full border-b border-[#e5d9c9] bg-transparent py-3 focus:outline-none" value={taxiData.destination} onChange={e => setTaxiData({...taxiData, destination: e.target.value})}>
                  {attractions.map(a => <option key={a.name} value={a.name}>{a.name}</option>)}
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] uppercase font-bold text-gray-400">Date of Journey</label>
                <input required type="date" className="w-full border-b border-[#e5d9c9] bg-transparent py-3" onChange={e => setTaxiData({...taxiData, date: e.target.value})} />
              </div>
              <button disabled={loading} className="w-full bg-[#3d2b1f] text-white py-4 font-bold uppercase tracking-widest text-xs hover:bg-[#1a120b] transition-colors">Request Pickup</button>
            </form>
          </div>
        </div>
      )}

      {/* Google Maps Section */}
      <section className="w-full bg-[#1a120b] py-12 border-t border-white/5">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row gap-8 items-center">
            <div className="md:w-1/3 text-[#e5d9c9] space-y-4">
              <h2 className="text-3xl font-serif italic">Find Us</h2>
              <p className="text-sm opacity-80 leading-relaxed">
                Located in the heart of Joshimath, our guest house is easily accessible 
                and offers the perfect base for your Himalayan adventures.
              </p>
              <div className="flex items-center gap-3 text-sm">
                <MapPin className="w-5 h-5 text-[#d97706]" />
                <span>Badrinath Road, Near Petrol Pump, Joshimath, Uttarakhand</span>
              </div>
            </div>
            <div className="md:w-2/3 w-full h-[400px] rounded-xl overflow-hidden shadow-2xl border border-white/10">
             <iframe 
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3441.2291771195616!2d79.56515827556788!3d30.543596474676527!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3909ddb4096a3151%3A0x6c597146c8ca374e!2sBalram%20Guest%20House!5e0!3m2!1sen!2sin!4v1705500000000!5m2!1sen!2sin"
                width="100%" 
                height="100%" 
               style={{ border: 0 }} 
               allowFullScreen="" 
               loading="lazy" 
               referrerPolicy="no-referrer-when-downgrade"
               title="Balram Guest House Location"
             />
           </div>
         </div>
       </div>
     </section>

      {/* Footer */}
      <footer className="bg-[#1a120b] text-[#e5d9c9] pt-12 pb-12 border-t border-white/5">
        <div className="container mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-3">
            <Mountain className="w-6 h-6 text-[#d97706]" />
            <span className="font-bold tracking-widest uppercase text-sm">Balram Guest House</span>
          </div>
          <p className="text-[10px] uppercase tracking-[0.4em] opacity-30">© 2025 Balram Guest House. Joshimath.</p>
        </div>
      </footer>
      {/* Floating WhatsApp Button */}
      <a
        href="https://wa.me/917579134041?text=Hello!%20I'm%20interested%20in%20booking%20a%20stay%20at%20Balram%20Guest%20House."
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-8 right-8 z-[100] bg-[#25D366] text-white p-4 rounded-full shadow-2xl hover:scale-110 transition-transform duration-300 flex items-center justify-center group"
        aria-label="Chat on WhatsApp"
      >
        <svg 
          viewBox="0 0 24 24" 
          className="w-7 h-7 fill-current" 
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.438 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
        </svg>
        <span className="max-w-0 overflow-hidden group-hover:max-w-xs group-hover:ml-2 transition-all duration-500 font-bold text-sm whitespace-nowrap">
          Contact Us
        </span>
      </a>
    </div>
  );
};

export default App;