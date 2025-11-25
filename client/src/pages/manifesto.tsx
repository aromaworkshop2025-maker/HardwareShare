import { Navbar } from "@/components/layout/navbar";
import { Button } from "@/components/ui/button";
import { ArrowRight, Target, Shield, Zap, Globe } from "lucide-react";
import Marquee from "@/components/ui/marquee";
import manifestoBg from '@assets/generated_images/abstract_digital_network_nodes.png';

export default function ManifestoPage() {
  return (
    <div className="min-h-screen bg-black text-white font-sans selection:bg-primary selection:text-black">
      <Navbar />
      
      <main>
        {/* MANIFESTO HEADER */}
        <section className="relative pt-32 pb-20 px-4 overflow-hidden border-b-2 border-white/20">
          <div className="absolute top-0 right-0 w-1/2 h-full opacity-20 pointer-events-none">
             <img src={manifestoBg} className="w-full h-full object-cover mix-blend-screen" />
          </div>
          
          <div className="container mx-auto relative z-10">
            <div className="max-w-4xl">
              <h1 className="text-7xl md:text-[10rem] font-display font-bold uppercase leading-[0.85] tracking-tighter mb-12">
                The<br/>
                <span className="text-primary">New</span><br/>
                Standard.
              </h1>
              <p className="text-2xl md:text-3xl font-medium text-zinc-400 max-w-2xl leading-relaxed">
                We believe technology should be accessible, circular, and community-driven. We are building the post-ownership future.
              </p>
            </div>
          </div>
        </section>

        {/* SCROLLING TEXT */}
        <div className="border-b-2 border-white/20 bg-primary overflow-hidden whitespace-nowrap py-6 rotate-1 scale-105 z-20 relative mix-blend-hard-light">
           <Marquee className="py-0" repeat={6}>
              <span className="mx-8 font-display font-black text-6xl text-black uppercase italic">
                 Access &gt; Ownership
              </span>
              <span className="mx-8 font-display font-black text-6xl text-white uppercase italic stroke-black" style={{WebkitTextStroke: '2px black'}}>
                 Kill E-Waste
              </span>
           </Marquee>
        </div>

        {/* VALUES GRID */}
        <section className="grid grid-cols-1 md:grid-cols-2 border-b-2 border-white/20">
          <div className="p-12 md:p-24 border-b-2 md:border-b-0 md:border-r-2 border-white/20 group hover:bg-white/5 transition-colors">
            <Target className="w-16 h-16 text-primary mb-8" />
            <h2 className="text-4xl font-display font-bold uppercase mb-6">01. Purpose</h2>
            <p className="text-xl text-zinc-400 leading-relaxed">
              Hardware is meant to be used, not hoarded. By circulating high-end equipment, we unlock creative potential for everyone, regardless of budget.
            </p>
          </div>
          <div className="p-12 md:p-24 group hover:bg-white/5 transition-colors">
            <Shield className="w-16 h-16 text-primary mb-8" />
            <h2 className="text-4xl font-display font-bold uppercase mb-6">02. Trust</h2>
            <p className="text-xl text-zinc-400 leading-relaxed">
              Anonymity breeds bad actors. EquipShare is built on radical transparency and verified professional identity. We trade with people, not usernames.
            </p>
          </div>
        </section>
        <section className="grid grid-cols-1 md:grid-cols-2 border-b-2 border-white/20">
          <div className="p-12 md:p-24 border-b-2 md:border-b-0 md:border-r-2 border-white/20 group hover:bg-white/5 transition-colors">
            <Zap className="w-16 h-16 text-primary mb-8" />
            <h2 className="text-4xl font-display font-bold uppercase mb-6">03. Speed</h2>
            <p className="text-xl text-zinc-400 leading-relaxed">
              Traditional marketplaces are slow and clunky. We optimize for velocity. List in seconds, request in one click, meet up today.
            </p>
          </div>
          <div className="p-12 md:p-24 group hover:bg-white/5 transition-colors">
            <Globe className="w-16 h-16 text-primary mb-8" />
            <h2 className="text-4xl font-display font-bold uppercase mb-6">04. Sustainability</h2>
            <p className="text-xl text-zinc-400 leading-relaxed">
              Every shared device is one less new device manufactured. We are actively fighting the planned obsolescence cycle through community redistribution.
            </p>
          </div>
        </section>

        {/* CTA */}
        <section className="py-32 container mx-auto px-4 text-center">
          <h2 className="text-5xl md:text-8xl font-display font-bold uppercase mb-12 tracking-tighter">
            Ready to <span className="text-primary">Disrupt?</span>
          </h2>
          <div className="flex flex-col md:flex-row justify-center gap-6">
             <Button size="lg" className="h-20 px-12 rounded-none bg-primary text-black border-2 border-primary hover:bg-transparent hover:text-primary text-2xl font-bold uppercase tracking-wide transition-all">
               Join The Movement
             </Button>
             <Button size="lg" variant="outline" className="h-20 px-12 rounded-none border-2 border-white text-white hover:bg-white hover:text-black text-2xl font-bold uppercase tracking-wide transition-all">
               Read Documentation
             </Button>
          </div>
        </section>
      </main>
    </div>
  );
}
