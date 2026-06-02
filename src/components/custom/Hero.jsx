"use client";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { FaMapMarkerAlt, FaRobot, FaHotel, FaRoute, FaStar, FaArrowRight } from "react-icons/fa";
import { MdExplore, MdFlightTakeoff } from "react-icons/md";

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 30 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6, ease: [0.4, 0, 0.2, 1], delay },
});

const destinations = [
  { name: "Bali, Indonesia",   tag: "Beach Paradise",  rating: 4.9, img: "https://images.pexels.com/photos/889954/pexels-photo-889954.jpeg" },
  { name: "Paris, France",     tag: "City of Love",    rating: 4.8, img: "https://images.pexels.com/photos/338515/pexels-photo-338515.jpeg?auto=compress&cs=tinysrgb&w=600" },
  { name: "Kyoto, Japan",      tag: "Cultural Gem",    rating: 4.9, img: "https://images.pexels.com/photos/1440476/pexels-photo-1440476.jpeg?auto=compress&cs=tinysrgb&w=600" },
  { name: "Santorini, Greece", tag: "Island Escape",   rating: 4.7, img: "https://images.pexels.com/photos/1010657/pexels-photo-1010657.jpeg?auto=compress&cs=tinysrgb&w=600" },
  { name: "Dubai, UAE",        tag: "Luxury & Wonder", rating: 4.8, img: "https://images.pexels.com/photos/1470502/pexels-photo-1470502.jpeg?auto=compress&cs=tinysrgb&w=600" },
  { name: "New York, USA",     tag: "The Big Apple",   rating: 4.8, img: "https://images.pexels.com/photos/1239162/pexels-photo-1239162.jpeg?auto=compress&cs=tinysrgb&w=600" },
];

const attractions = [
  { name: "Taj Mahal",    place: "Agra, India",    emoji: "🕌", img: "https://images.pexels.com/photos/1603650/pexels-photo-1603650.jpeg?auto=compress&cs=tinysrgb&w=600" },
  { name: "Eiffel Tower", place: "Paris, France",  emoji: "🗼", img: "https://images.pexels.com/photos/28750221/pexels-photo-28750221.jpeg" },
  { name: "Colosseum",    place: "Rome, Italy",    emoji: "🏛️", img: "https://images.pexels.com/photos/2064827/pexels-photo-2064827.jpeg?auto=compress&cs=tinysrgb&w=600" },
  { name: "Great Wall",   place: "Beijing, China", emoji: "🧱", img: "https://images.pexels.com/photos/2412603/pexels-photo-2412603.jpeg?auto=compress&cs=tinysrgb&w=600" },
];

const features = [
  { icon: <FaRobot className="text-3xl text-violet-500" />,       title: "AI-Powered Planning",  desc: "Gemini AI builds your perfect itinerary in seconds based on your preferences." },
  { icon: <FaHotel className="text-3xl text-blue-500" />,         title: "Smart Hotel Picks",    desc: "Get curated hotel recommendations that match your budget and travel style." },
  { icon: <FaRoute className="text-3xl text-emerald-500" />,      title: "Day-by-Day Itinerary", desc: "Every day planned with places, timings, and tips — nothing left to chance." },
  { icon: <MdFlightTakeoff className="text-3xl text-pink-500" />, title: "Instant Trip Save",    desc: "Your trips are saved to the cloud. Access them anytime, anywhere." },
];

const trustItems = [
  { icon: "⚡", text: "Plan trips in seconds" },
  { icon: "🌍", text: "Real place recommendations" },
  { icon: "📅", text: "Smart day-by-day itineraries" },
  { icon: "🆓", text: "Free to try, no signup needed" },
];

const steps = [
  { step: "01", title: "Enter Destination", desc: "Type where you want to go and how many days you have.",          color: "from-violet-500 to-purple-600" },
  { step: "02", title: "Set Preferences",   desc: "Choose your travel group and budget — solo, couple, or family.", color: "from-blue-500 to-cyan-600" },
  { step: "03", title: "AI Generates Plan", desc: "Our Gemini AI crafts a full itinerary with hotels and places.",  color: "from-emerald-500 to-teal-600" },
  { step: "04", title: "Explore & Go!",     desc: "View your trip, explore on maps, and start your adventure.",     color: "from-orange-500 to-pink-600" },
];

export function HeroHighlightDemo() {
  return (
    <div className="w-full overflow-x-hidden">

      {/* ── HERO ── */}
      <section className="relative min-h-[92vh] flex items-center justify-center overflow-hidden bg-gradient-to-br from-slate-950 via-violet-950 to-slate-900">
        <div className="absolute top-[-10%] left-[-5%] w-[500px] h-[500px] bg-violet-600 rounded-full opacity-20 blur-[120px] pointer-events-none" />
        <div className="absolute bottom-[-10%] right-[-5%] w-[400px] h-[400px] bg-blue-500 rounded-full opacity-20 blur-[120px] pointer-events-none" />
        <div className="absolute top-[40%] left-[50%] w-[300px] h-[300px] bg-pink-500 rounded-full opacity-10 blur-[100px] pointer-events-none" />

        <motion.span className="absolute top-[15%] left-[8%] text-4xl select-none"
          animate={{ y: [0, -14, 0] }} transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}>✈️</motion.span>
        <motion.span className="absolute top-[20%] right-[10%] text-3xl select-none"
          animate={{ y: [0, 12, 0] }} transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}>🗺️</motion.span>
        <motion.span className="absolute bottom-[25%] left-[12%] text-3xl select-none"
          animate={{ y: [0, -10, 0] }} transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}>🏖️</motion.span>
        <motion.span className="absolute bottom-[20%] right-[8%] text-4xl select-none"
          animate={{ y: [0, 10, 0] }} transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut", delay: 1.5 }}>🌍</motion.span>

        <div className="relative z-10 text-center px-4 max-w-5xl mx-auto">
          <motion.div {...fadeUp(0)} className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 text-white/90 text-sm px-4 py-2 rounded-full mb-6">
            <span className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
            AI-Powered Travel Planning is here
          </motion.div>

          <motion.h1 {...fadeUp(0.1)} className="text-5xl md:text-7xl font-extrabold text-white leading-tight mb-6">
            Plan Your Dream
            <br />
            <span className="bg-gradient-to-r from-violet-400 via-pink-400 to-blue-400 bg-clip-text text-transparent">
              Journey with GeoBuzz
            </span>
          </motion.h1>

          <motion.p {...fadeUp(0.2)} className="text-lg md:text-xl text-white/70 max-w-2xl mx-auto mb-10 leading-relaxed">
            Tell us where you want to go. Our AI builds a complete itinerary — hotels, attractions, day plans — in seconds.
          </motion.p>

          <motion.div {...fadeUp(0.3)} className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link to="/create-trip">
              <button className="group flex items-center gap-2 bg-gradient-to-r from-violet-600 to-blue-600 hover:from-violet-500 hover:to-blue-500 text-white font-semibold px-8 py-4 rounded-full text-lg shadow-lg shadow-violet-500/30 hover:shadow-violet-500/50 hover:scale-105 transition-all duration-300">
                <MdFlightTakeoff className="text-xl group-hover:translate-x-1 transition-transform" />
                Get Started Free
              </button>
            </Link>
            <a href="#destinations">
              <button className="flex items-center gap-2 bg-white/10 hover:bg-white/20 backdrop-blur-sm border border-white/20 text-white font-semibold px-8 py-4 rounded-full text-lg hover:scale-105 transition-all duration-300">
                <MdExplore className="text-xl" />
                Explore Destinations
              </button>
            </a>
          </motion.div>

          <motion.div {...fadeUp(0.4)} className="mt-10 flex flex-wrap justify-center gap-4">
            {trustItems.map((t, i) => (
              <span key={i} className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/15 text-white/80 text-sm px-4 py-2 rounded-full">
                <span>{t.icon}</span>{t.text}
              </span>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── POPULAR DESTINATIONS ── */}
      <section id="destinations" className="py-20 px-4 bg-gray-50 dark:bg-gray-950 transition-colors duration-300">
        <div className="max-w-6xl mx-auto">
          <motion.div {...fadeUp(0)} className="text-center mb-12">
            <span className="text-violet-600 dark:text-violet-400 font-semibold text-sm uppercase tracking-widest">Explore the World</span>
            <h2 className="text-4xl font-extrabold text-gray-900 dark:text-white mt-2">Popular Destinations</h2>
            <p className="text-gray-500 dark:text-gray-400 mt-3 max-w-xl mx-auto">Handpicked destinations loved by travellers worldwide.</p>
          </motion.div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {destinations.map((d, i) => (
              <motion.div key={i} {...fadeUp(i * 0.08)}
                className="group relative rounded-2xl overflow-hidden shadow-md hover:shadow-2xl transition-all duration-500 cursor-pointer h-[260px]">
                <img src={d.img} alt={d.name} onError={(e) => { e.target.src = "/placeholder.jpg"; }}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                <div className="absolute bottom-0 left-0 p-5">
                  <span className="text-xs bg-white/20 backdrop-blur-sm text-white px-3 py-1 rounded-full border border-white/30">{d.tag}</span>
                  <h3 className="text-white font-bold text-xl mt-2">{d.name}</h3>
                  <div className="flex items-center gap-1 mt-1">
                    <FaStar className="text-yellow-400 text-xs" />
                    <span className="text-white/80 text-sm">{d.rating}</span>
                  </div>
                </div>
                <Link to={"/create-trip?destination=" + encodeURIComponent(d.name)}>
                  <div className="absolute top-4 right-4 bg-white/20 backdrop-blur-sm border border-white/30 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-white/40">
                    <FaArrowRight className="text-sm" />
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── TOP ATTRACTIONS ── */}
      <section className="py-20 px-4 bg-white dark:bg-gray-950 transition-colors duration-300">
        <div className="max-w-6xl mx-auto">
          <motion.div {...fadeUp(0)} className="text-center mb-12">
            <span className="text-pink-500 dark:text-pink-400 font-semibold text-sm uppercase tracking-widest">Must Visit</span>
            <h2 className="text-4xl font-extrabold text-gray-900 dark:text-white mt-2">Top Attractions</h2>
            <p className="text-gray-500 dark:text-gray-400 mt-3 max-w-xl mx-auto">Iconic landmarks and experiences you can't miss.</p>
          </motion.div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {attractions.map((a, i) => (
              <motion.div key={i} {...fadeUp(i * 0.1)}
                className="group relative rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 cursor-pointer bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800">
                <div className="relative h-[180px] overflow-hidden">
                  <img src={a.img} alt={a.name} onError={(e) => { e.target.src = "/placeholder.jpg"; }}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                  <span className="absolute top-3 left-3 text-2xl">{a.emoji}</span>
                </div>
                <div className="p-4">
                  <h3 className="font-bold text-gray-900 dark:text-white text-lg">{a.name}</h3>
                  <div className="flex items-center gap-1 mt-1 text-gray-500 dark:text-gray-400 text-sm">
                    <FaMapMarkerAlt className="text-pink-400 text-xs" />
                    {a.place}
                  </div>
                </div>
                <Link to={"/create-trip?destination=" + encodeURIComponent(a.name + ", " + a.place)}>
                  <div className="absolute top-4 right-4 bg-white/20 backdrop-blur-sm border border-black/10 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-white/40 shadow-sm">
                    <FaArrowRight className="text-sm" />
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── WHY GEOBUZZ ── */}
      <section className="py-20 px-4 bg-gradient-to-br from-violet-50 via-blue-50 to-pink-50 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950 transition-colors duration-300">
        <div className="max-w-6xl mx-auto">
          <motion.div {...fadeUp(0)} className="text-center mb-14">
            <span className="text-blue-600 dark:text-blue-400 font-semibold text-sm uppercase tracking-widest">Why GeoBuzz</span>
            <h2 className="text-4xl font-extrabold text-gray-900 dark:text-white mt-2">Travel Smarter, Not Harder</h2>
            <p className="text-gray-500 dark:text-gray-400 mt-3 max-w-xl mx-auto">Everything you need to plan the perfect trip — powered by AI.</p>
          </motion.div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((f, i) => (
              <motion.div key={i} {...fadeUp(i * 0.1)}
                className="group bg-white dark:bg-gray-900 rounded-2xl p-6 shadow-sm hover:shadow-xl border border-gray-100 dark:border-gray-800 hover:-translate-y-2 transition-all duration-300 text-center">
                <div className="flex justify-center mb-4">
                  <div className="w-14 h-14 rounded-2xl bg-gray-50 dark:bg-gray-800 group-hover:bg-violet-50 dark:group-hover:bg-violet-950/40 flex items-center justify-center transition-colors duration-300">
                    {f.icon}
                  </div>
                </div>
                <h3 className="font-bold text-gray-900 dark:text-white text-lg mb-2">{f.title}</h3>
                <p className="text-gray-500 dark:text-gray-400 text-sm leading-relaxed">{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section className="py-20 px-4 bg-gray-900">
        <div className="max-w-5xl mx-auto">
          <motion.div {...fadeUp(0)} className="text-center mb-14">
            <span className="text-emerald-400 font-semibold text-sm uppercase tracking-widest">Simple Process</span>
            <h2 className="text-4xl font-extrabold text-white mt-2">How It Works</h2>
            <p className="text-gray-400 mt-3 max-w-xl mx-auto">From idea to full itinerary in under 30 seconds.</p>
          </motion.div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {steps.map((s, i) => (
              <motion.div key={i} {...fadeUp(i * 0.1)} className="relative text-center">
                {i < steps.length - 1 && (
                  <div className="hidden lg:block absolute top-8 left-[60%] w-full h-[2px] bg-gradient-to-r from-white/20 to-transparent z-0" />
                )}
                <div className={`relative z-10 w-16 h-16 rounded-2xl bg-gradient-to-br ${s.color} flex items-center justify-center mx-auto mb-4 shadow-lg`}>
                  <span className="text-white font-extrabold text-lg">{s.step}</span>
                </div>
                <h3 className="text-white font-bold text-lg mb-2">{s.title}</h3>
                <p className="text-gray-400 text-sm leading-relaxed">{s.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA BANNER ── */}
      <section className="py-20 px-4 bg-gradient-to-r from-violet-600 via-purple-600 to-blue-600">
        <motion.div {...fadeUp(0)} className="max-w-3xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-extrabold text-white mb-4">Ready to Explore the World?</h2>
          <p className="text-white/80 text-lg mb-8">Let GeoBuzz plan your next adventure — free, fast, and powered by AI.</p>
          <Link to="/create-trip">
            <button className="group inline-flex items-center gap-3 bg-white text-violet-700 font-bold px-10 py-4 rounded-full text-lg hover:bg-violet-50 hover:scale-105 shadow-2xl transition-all duration-300">
              <MdFlightTakeoff className="text-xl group-hover:translate-x-1 transition-transform" />
              Start Planning Now
            </button>
          </Link>
        </motion.div>
      </section>

    </div>
  );
}
