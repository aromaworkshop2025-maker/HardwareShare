import { useState } from "react";
import { useStore } from "@/lib/store";
import { useAuth } from "@/hooks/use-auth";
import { Navbar } from "@/components/layout/navbar";
import { ItemCard } from "@/components/ui/item-card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Search, SlidersHorizontal, X } from "lucide-react";
import { useLocation } from "wouter";
import { useToast } from "@/hooks/use-toast";
import { motion, AnimatePresence } from "framer-motion";

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
      description: "The owner has been notified of your interest.",
    });
  };

  return (
    <div className="min-h-screen bg-background font-sans selection:bg-primary/10 selection:text-primary">
      <Navbar />
      
      <main>
        {/* Hero Section */}
        <section className="relative overflow-hidden border-b border-border bg-muted/30">
          <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=2072&auto=format&fit=crop')] opacity-[0.03] pointer-events-none mix-blend-multiply"></div>
          <div className="container mx-auto px-4 py-20 md:py-32 flex flex-col items-center text-center max-w-4xl relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <Badge variant="outline" className="mb-6 px-4 py-1.5 text-sm font-medium border-primary/20 text-primary bg-primary/5 rounded-full">
                Beta Access Open
              </Badge>
              <h1 className="text-4xl md:text-6xl font-display font-bold tracking-tight text-foreground mb-6">
                The Hardware Exchange <br className="hidden md:block" />
                <span className="text-muted-foreground">for Tech Professionals.</span>
              </h1>
              <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-2xl leading-relaxed">
                Share your unused equipment with verified peers. Build your setup without breaking the bank. Reduce e-waste.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 w-full max-w-md mx-auto">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input 
                    placeholder="Search for MacBook, Monitor, etc..." 
                    className="pl-10 h-12 bg-background border-border/60 focus:border-primary/50 transition-all"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                  />
                </div>
                <Button size="lg" className="h-12 px-8 font-medium">
                  Explore Gear
                </Button>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Content Section */}
        <section className="container mx-auto px-4 py-12">
          <div className="flex flex-col gap-8">
            
            {/* Filter Bar */}
            <div className="flex flex-col md:flex-row justify-between items-center gap-4 pb-6 border-b border-border/50">
              <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto no-scrollbar pb-2 md:pb-0">
                {CATEGORIES.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setCategory(cat)}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-all whitespace-nowrap ${
                      category === cat 
                        ? "bg-primary text-primary-foreground shadow-md shadow-primary/20" 
                        : "bg-muted/50 text-muted-foreground hover:bg-muted hover:text-foreground"
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
              
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <SlidersHorizontal className="w-4 h-4" />
                <span>{filteredItems.length} items found</span>
              </div>
            </div>

            {/* Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              <AnimatePresence mode="popLayout">
                {filteredItems.length > 0 ? (
                  filteredItems.map((item) => (
                    <ItemCard key={item.id} item={item} onRequest={handleRequest} />
                  ))
                ) : (
                  <div className="col-span-full flex flex-col items-center justify-center py-20 text-center">
                    <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mb-4">
                      <Search className="w-8 h-8 text-muted-foreground" />
                    </div>
                    <h3 className="text-lg font-medium mb-2">No items found</h3>
                    <p className="text-muted-foreground mb-6">Try adjusting your search or filters.</p>
                    <Button variant="outline" onClick={() => {setSearch(''); setCategory('All');}}>
                      Clear Filters
                    </Button>
                  </div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
