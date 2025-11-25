import { useState } from "react";
import { useStore } from "@/lib/store";
import { useAuth } from "@/hooks/use-auth";
import { Navbar } from "@/components/layout/navbar";
import { ItemCard } from "@/components/ui/item-card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Marquee from "@/components/ui/marquee";
import { Search, ArrowRight, Sparkles, Zap, Box } from "lucide-react";
import { useLocation } from "wouter";
import { useToast } from "@/hooks/use-toast";
import { motion, AnimatePresence } from "framer-motion";
import heroImage from '@assets/generated_images/overhead_shot_of_an_organized_designer_desk.png';
import headphoneImage from '@assets/generated_images/close_up_of_high_end_headphones.png';
import abstractImage from '@assets/generated_images/abstract_tech_hardware_arrangement.png';


const CATEGORIES = ['All', 'Laptop', 'Monitor', 'Peripheral', 'Audio', 'Tablet', 'Other'];

export default function Home() {
  const { items, requestItem } = useStore();
  const { user } = useAuth();
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");

  const filteredItems = items.filter(item => {
    const matchesSearch = item.title.toLowerCase().includes(search.toLowerCase()) || 
                          item.description.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = category === 'All' || item.category === category;
    return matchesSearch && matchesCategory;
  });

  const handleRequest = (id: string) => {
    if (!user) {
      setLocation('/auth');
      return;
    }
    
    requestItem(id);
    toast({
      title: "Request Sent",
      description: "The owner has been notified. Good luck.",
    });
  };

  return (
    <div className="min-h-screen bg-background font-sans selection:bg-primary selection:text-black">
      <Navbar />
      
      <main>
        {/* MARQUEE TICKER */}
        <div className="border-b-2 border-black bg-primary overflow-hidden whitespace-nowrap py-3">
           <Marquee className="py-0" repeat={10}>
              <span className="mx-8 font-bold text-black uppercase tracking-widest text-sm flex items-center gap-4">
                 <Zap className="w-4 h-4 fill-black" /> Available in San Francisco 
                 <span className="w-2 h-2 bg-black rounded-full"></span>
                 324 Active Listings
                 <span className="w-2 h-2 bg-black rounded-full"></span>
                 Verified Owners
                 <span className="w-2 h-2 bg-black rounded-full"></span>
                 Zero Waste
                 <span className="w-2 h-2 bg-black rounded-full"></span>
                 Premium Gear Only
              </span>
           </Marquee>
        </div>

        {/* EDITORIAL HERO */}
        <section className="grid grid-cols-1 lg:grid-cols-12 border-b-2 border-black min-h-[600px]">
          {/* Left: Typography & Search */}
          <div className="lg:col-span-7 p-8 md:p-16 flex flex-col justify-between border-b-2 lg:border-b-0 lg:border-r-2 border-black bg-white relative overflow-hidden">
             <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(#000_1px,transparent_1px)] [background-size:20px_20px] opacity-5 pointer-events-none"></div>
             
             <div className="relative z-10">
                <div className="inline-flex items-center gap-2 px-3 py-1 border-2 border-black bg-black text-white rounded-full text-xs font-bold uppercase tracking-wider mb-8">
                   <Sparkles className="w-3 h-3 text-primary" />
                   Beta Access v1.0
                </div>
                
                <h1 className="text-6xl md:text-8xl font-display font-bold uppercase leading-[0.9] tracking-tighter mb-8">
                   The <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-primary/50 stroke-black" style={{WebkitTextStroke: '2px black'}}>Hardware</span><br/>
                   Exchange.
                </h1>
                
                <p className="text-xl font-medium max-w-md leading-relaxed border-l-4 border-primary pl-6 mb-12 text-zinc-800">
                   Stop letting your premium gear collect dust. Join the exclusive network of creative professionals sharing high-end hardware.
                </p>
             </div>

             <div className="relative z-10 w-full max-w-xl">
                <div className="flex relative group">
                   <div className="absolute inset-0 bg-black translate-y-2 translate-x-2 transition-transform group-focus-within:translate-x-0 group-focus-within:translate-y-0"></div>
                   <div className="relative flex-1 flex border-2 border-black bg-white z-10">
                      <div className="flex items-center justify-center px-4 border-r-2 border-black">
                         <Search className="w-6 h-6" />
                      </div>
                      <input 
                        type="text"
                        placeholder="FIND MACBOOKS, MONITORS, CAMERAS..." 
                        className="w-full h-16 px-4 font-bold uppercase placeholder:text-zinc-400 focus:outline-none bg-transparent text-lg"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                      />
                   </div>
                </div>
             </div>
          </div>

          {/* Right: Visual Grid */}
          <div className="lg:col-span-5 grid grid-rows-2">
             <div className="relative border-b-2 border-black overflow-hidden group">
                <img src={heroImage} className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 grayscale group-hover:grayscale-0" />
                <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors"></div>
                <div className="absolute bottom-0 left-0 bg-white border-t-2 border-r-2 border-black p-3 font-bold uppercase text-xs tracking-wider">
                   Featured: Designer Setup
                </div>
             </div>
             <div className="grid grid-cols-2">
                <div className="relative border-r-2 border-black overflow-hidden group">
                   <img src={headphoneImage} className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 grayscale group-hover:grayscale-0" />
                    <div className="absolute bottom-0 left-0 bg-primary border-t-2 border-r-2 border-black p-2 font-bold uppercase text-xs tracking-wider text-black">
                      Audio
                   </div>
                </div>
                <div className="relative overflow-hidden group">
                   <img src={abstractImage} className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 grayscale group-hover:grayscale-0" />
                    <div className="absolute bottom-0 left-0 bg-white border-t-2 border-r-2 border-black p-2 font-bold uppercase text-xs tracking-wider">
                      Parts
                   </div>
                   <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/50 backdrop-blur-sm">
                      <Button variant="outline" className="border-2 border-white text-white hover:bg-white hover:text-black uppercase font-bold">
                         View All
                      </Button>
                   </div>
                </div>
             </div>
          </div>
        </section>

        {/* MAIN CONTENT */}
        <section className="container mx-auto px-4 py-20">
          <div className="flex flex-col gap-12">
            
            {/* Categories */}
            <div className="flex flex-col md:flex-row justify-between items-end gap-8">
               <div>
                  <h2 className="text-4xl font-display font-bold uppercase mb-2">Inventory</h2>
                  <p className="text-muted-foreground font-medium">Curated equipment from verified peers.</p>
               </div>
               
               <div className="flex flex-wrap gap-2">
                  {CATEGORIES.map((cat) => (
                    <button
                      key={cat}
                      onClick={() => setCategory(cat)}
                      className={`px-6 py-3 border-2 border-black font-bold uppercase text-sm transition-all hover:-translate-y-1 hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] ${
                        category === cat 
                          ? "bg-black text-white" 
                          : "bg-white text-black hover:bg-primary hover:text-black"
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
               </div>
            </div>

            {/* Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
              <AnimatePresence mode="popLayout">
                {filteredItems.length > 0 ? (
                  filteredItems.map((item) => (
                    <ItemCard key={item.id} item={item} onRequest={handleRequest} />
                  ))
                ) : (
                  <div className="col-span-full flex flex-col items-center justify-center py-32 border-2 border-dashed border-black bg-muted/30">
                    <Box className="w-16 h-16 text-muted-foreground mb-6" />
                    <h3 className="text-2xl font-display font-bold uppercase mb-2">Nothing Found</h3>
                    <p className="text-muted-foreground mb-8 font-medium">We couldn't find any gear matching your criteria.</p>
                    <Button size="lg" onClick={() => {setSearch(''); setCategory('All');}} className="rounded-none border-2 border-black bg-primary text-black hover:bg-black hover:text-white font-bold uppercase shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                      Reset Filters
                    </Button>
                  </div>
                )}
              </AnimatePresence>
            </div>
            
            {/* Newsletter / CTA */}
            <div className="mt-20 border-2 border-black bg-black text-white p-12 md:p-24 text-center relative overflow-hidden">
               <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20"></div>
               <div className="relative z-10 max-w-2xl mx-auto">
                  <h2 className="text-4xl md:text-6xl font-display font-bold uppercase mb-6 tracking-tighter">
                     Got Gear Gathering Dust?
                  </h2>
                  <p className="text-xl text-zinc-400 mb-10">
                     Turn your unused hardware into community credit. List your item in under 60 seconds.
                  </p>
                  <Button size="lg" className="h-16 px-10 rounded-none bg-primary text-black border-2 border-transparent hover:border-white hover:bg-black hover:text-white text-xl font-bold uppercase tracking-wide transition-all">
                     Start Listing <ArrowRight className="ml-2 w-6 h-6" />
                  </Button>
               </div>
            </div>
            
          </div>
        </section>
      </main>
      
      <footer className="border-t-2 border-black bg-white py-12">
         <div className="container mx-auto px-4 flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="font-display font-bold text-xl uppercase tracking-tighter">
               Equip<span className="text-primary">Share</span> © 2024
            </div>
            <div className="flex gap-8 text-sm font-bold uppercase tracking-wider">
               <a href="#" className="hover:text-primary transition-colors">Manifesto</a>
               <a href="#" className="hover:text-primary transition-colors">Terms</a>
               <a href="#" className="hover:text-primary transition-colors">Privacy</a>
               <a href="#" className="hover:text-primary transition-colors">Contact</a>
            </div>
         </div>
      </footer>
    </div>
  );
}
