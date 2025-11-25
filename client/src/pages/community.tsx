import { Navbar } from "@/components/layout/navbar";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { MessageSquare, ThumbsUp, TrendingUp, Users, ArrowUpRight, Hash } from "lucide-react";
import Marquee from "@/components/ui/marquee";
import communityHero from '@assets/generated_images/gritty_black_and_white_crowd_shot.png';

const DISCUSSIONS = [
  {
    id: 1,
    title: "Is the M3 Max overkill for Figma?",
    author: "Sarah Jenkins",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
    replies: 42,
    likes: 128,
    tag: "Advice",
    time: "2h ago"
  },
  {
    id: 2,
    title: "Looking for a Keychron K2 custom keycap set",
    author: "Mike Ross",
    avatar: "https://images.unsplash.com/photo-1599566150163-29194dcaad36?auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
    replies: 15,
    likes: 45,
    tag: "Request",
    time: "4h ago"
  },
  {
    id: 3,
    title: "Best monitor arm for heavy ultrawides?",
    author: "Alex Chen",
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
    replies: 89,
    likes: 230,
    tag: "Hardware",
    time: "6h ago"
  },
  {
    id: 4,
    title: "Review: Sony WH-1000XM5 after 6 months",
    author: "Jessica Wu",
    avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
    replies: 56,
    likes: 342,
    tag: "Review",
    time: "1d ago"
  }
];

const TOP_CONTRIBUTORS = [
  { name: "Davide", role: "Power User", score: 9850 },
  { name: "Elena", role: "Moderator", score: 8400 },
  { name: "Marcus", role: "Trader", score: 7200 },
];

export default function CommunityPage() {
  return (
    <div className="min-h-screen bg-background font-sans selection:bg-primary selection:text-black">
      <Navbar />
      
      <main>
        {/* HERO SECTION */}
        <section className="relative min-h-[50vh] flex flex-col justify-end border-b-2 border-black overflow-hidden bg-black text-white">
          <div className="absolute inset-0 opacity-40">
            <img src={communityHero} className="w-full h-full object-cover grayscale mix-blend-screen" />
          </div>
          <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent"></div>
          
          <div className="container mx-auto px-4 py-12 relative z-10">
            <div className="inline-flex items-center gap-2 px-3 py-1 border border-white/30 bg-white/10 backdrop-blur-md rounded-full text-xs font-bold uppercase tracking-wider mb-6 text-primary">
              <Users className="w-3 h-3" />
              The Hive Mind
            </div>
            <h1 className="text-6xl md:text-9xl font-display font-bold uppercase leading-[0.8] tracking-tighter mb-6">
              Global<br/>
              <span className="text-primary">Connect</span>
            </h1>
            <p className="text-xl md:text-2xl font-medium max-w-2xl text-zinc-300 leading-relaxed border-l-4 border-primary pl-6">
              Connect with 15,000+ hardware enthusiasts. Trade tips, swap gear, and build the ultimate setup.
            </p>
          </div>
        </section>

        {/* STATS TICKER */}
        <div className="border-b-2 border-black bg-white overflow-hidden whitespace-nowrap py-4">
           <Marquee className="py-0" repeat={8}>
              <span className="mx-12 font-display font-bold text-4xl text-black uppercase opacity-20">
                 Community
              </span>
              <span className="mx-12 font-display font-bold text-4xl text-primary uppercase stroke-black" style={{WebkitTextStroke: '1px black'}}>
                 Collaborate
              </span>
              <span className="mx-12 font-display font-bold text-4xl text-black uppercase opacity-20">
                 Exchange
              </span>
              <span className="mx-12 font-display font-bold text-4xl text-primary uppercase stroke-black" style={{WebkitTextStroke: '1px black'}}>
                 Build
              </span>
           </Marquee>
        </div>

        <section className="grid grid-cols-1 lg:grid-cols-12 min-h-screen">
          
          {/* LEFT COLUMN - DISCUSSIONS */}
          <div className="lg:col-span-8 p-6 md:p-12 border-b-2 lg:border-b-0 lg:border-r-2 border-black bg-[#f4f4f0]">
            <div className="flex justify-between items-end mb-12">
              <div>
                <h2 className="text-4xl font-display font-bold uppercase mb-2">Live Feed</h2>
                <p className="text-muted-foreground font-medium">Real-time discussions from the community.</p>
              </div>
              <Button className="rounded-none border-2 border-black bg-black text-white hover:bg-primary hover:text-black font-bold uppercase shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                Start Thread
              </Button>
            </div>

            <div className="space-y-4">
              {DISCUSSIONS.map((thread) => (
                <div key={thread.id} className="group relative bg-white border-2 border-black p-6 transition-all hover:-translate-y-1 hover:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] shadow-[4px_4px_0px_0px_rgba(0,0,0,0)]">
                  <div className="flex items-start gap-4">
                    <div className="flex-col items-center gap-2 hidden sm:flex min-w-[60px]">
                      <div className="flex flex-col items-center p-2 bg-muted/30 border-2 border-black/10 rounded-none w-full">
                        <ArrowUpRight className="w-5 h-5 mb-1" />
                        <span className="font-bold text-sm">{thread.likes}</span>
                      </div>
                    </div>
                    
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <Badge variant="outline" className="rounded-none border-black text-[10px] font-bold uppercase bg-primary text-black">
                          {thread.tag}
                        </Badge>
                        <span className="text-xs text-muted-foreground font-medium uppercase tracking-wider">Posted by {thread.author} • {thread.time}</span>
                      </div>
                      <h3 className="text-xl font-bold font-display uppercase leading-tight mb-3 group-hover:text-primary transition-colors cursor-pointer">
                        {thread.title}
                      </h3>
                      <div className="flex items-center gap-4 text-sm font-bold text-muted-foreground">
                        <span className="flex items-center gap-1 hover:text-black cursor-pointer transition-colors">
                          <MessageSquare className="w-4 h-4" /> {thread.replies} Replies
                        </span>
                        <span className="flex items-center gap-1 hover:text-black cursor-pointer transition-colors sm:hidden">
                          <ThumbsUp className="w-4 h-4" /> {thread.likes} Likes
                        </span>
                      </div>
                    </div>
                    
                    <Avatar className="w-12 h-12 border-2 border-black rounded-none hidden sm:block">
                      <AvatarImage src={thread.avatar} />
                      <AvatarFallback>U</AvatarFallback>
                    </Avatar>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="mt-8 text-center">
              <Button variant="outline" className="w-full py-8 border-2 border-black border-dashed bg-transparent hover:bg-black hover:text-white hover:border-solid font-bold uppercase tracking-widest text-muted-foreground hover:text-white transition-all">
                Load More Threads
              </Button>
            </div>
          </div>

          {/* RIGHT COLUMN - SIDEBAR */}
          <div className="lg:col-span-4 bg-white flex flex-col">
            {/* TRENDING TAGS */}
            <div className="p-8 border-b-2 border-black bg-primary/10">
               <h3 className="font-display font-bold text-xl uppercase mb-6 flex items-center gap-2">
                 <Hash className="w-5 h-5" /> Trending Tags
               </h3>
               <div className="flex flex-wrap gap-2">
                 {['#SetupWars', '#MechanicalKeys', '#MacStudio', '#CableManagement', '#DeskPad', '#ThriftFinds'].map(tag => (
                   <span key={tag} className="px-3 py-1 bg-white border-2 border-black font-bold text-xs uppercase cursor-pointer hover:bg-black hover:text-white transition-colors">
                     {tag}
                   </span>
                 ))}
               </div>
            </div>

            {/* LEADERBOARD */}
            <div className="p-8 flex-1">
               <h3 className="font-display font-bold text-xl uppercase mb-6 flex items-center gap-2">
                 <TrendingUp className="w-5 h-5" /> Top Contributors
               </h3>
               
               <div className="space-y-6">
                 {TOP_CONTRIBUTORS.map((user, i) => (
                   <div key={i} className="flex items-center gap-4 group">
                     <div className="font-display font-bold text-4xl text-muted-foreground/30 w-8">
                       0{i + 1}
                     </div>
                     <div className="flex-1">
                       <div className="font-bold uppercase text-lg leading-none group-hover:text-primary transition-colors cursor-pointer">{user.name}</div>
                       <div className="text-xs font-medium text-muted-foreground uppercase tracking-wider">{user.role}</div>
                     </div>
                     <div className="font-mono font-bold text-sm bg-black text-white px-2 py-1">
                       {user.score}
                     </div>
                   </div>
                 ))}
               </div>

               <div className="mt-12 p-6 border-2 border-black bg-black text-white text-center">
                  <h4 className="font-display font-bold text-xl uppercase mb-2 text-primary">Join the Ranks</h4>
                  <p className="text-sm text-zinc-400 mb-4">Earn points by listing gear and helping others.</p>
                  <Button className="w-full rounded-none bg-white text-black hover:bg-primary border-none font-bold uppercase">
                    View Rules
                  </Button>
               </div>
            </div>
          </div>

        </section>
      </main>
    </div>
  );
}
