import { Item } from "@/lib/mock-data";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Clock, ArrowUpRight } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { motion } from "framer-motion";

interface ItemCardProps {
  item: Item;
  onRequest: (id: string) => void;
}

export function ItemCard({ item, onRequest }: ItemCardProps) {
  const isAvailable = item.status === 'Available';

  return (
    <motion.div
      whileHover={{ y: -8 }}
      transition={{ type: "spring", stiffness: 300 }}
      className="h-full"
    >
      <Card className="h-full border-2 border-black rounded-none shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] transition-all duration-200 flex flex-col bg-white group">
        <div className="aspect-[4/3] overflow-hidden relative border-b-2 border-black">
          <img 
            src={item.image} 
            alt={item.title}
            className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500"
          />
          <div className="absolute top-3 right-3">
            <Badge 
              variant={isAvailable ? "default" : "destructive"} 
              className={`rounded-none border-2 border-black font-bold uppercase tracking-wider ${isAvailable ? 'bg-primary text-black hover:bg-primary' : ''}`}
            >
              {item.status}
            </Badge>
          </div>
        </div>
        
        <CardContent className="p-5 space-y-4 flex-grow">
          <div className="flex justify-between items-start gap-2">
            <h3 className="font-display font-bold text-xl leading-tight uppercase tracking-tight text-black">
              {item.title}
            </h3>
          </div>
          
          <div className="flex gap-2 flex-wrap">
             <Badge variant="outline" className="rounded-none border-black text-xs font-bold uppercase">
              {item.category}
            </Badge>
            <Badge variant="outline" className="rounded-none border-black text-xs font-bold uppercase">
              {item.condition}
            </Badge>
          </div>

          <p className="text-sm text-muted-foreground line-clamp-2 font-medium">
            {item.description}
          </p>
        </CardContent>
        
        <CardFooter className="p-4 pt-0 mt-auto flex items-center justify-between border-t-2 border-black bg-muted/50 h-16">
          <div className="flex items-center gap-3">
            <Avatar className="w-8 h-8 border-2 border-black rounded-none">
              <AvatarImage src={item.owner.avatar} />
              <AvatarFallback className="rounded-none font-bold bg-white text-black">{item.owner.name[0]}</AvatarFallback>
            </Avatar>
            <div className="flex flex-col">
              <span className="text-xs font-bold uppercase tracking-wider text-black">
                {item.owner.name}
              </span>
              <span className="text-[10px] text-muted-foreground uppercase font-bold">
                {formatDistanceToNow(new Date(item.postedAt), { addSuffix: true })}
              </span>
            </div>
          </div>
          
          <Button 
            size="icon"
            variant="default" 
            disabled={!isAvailable}
            onClick={() => onRequest(item.id)}
            className="rounded-none border-2 border-black w-10 h-10 bg-black text-white hover:bg-primary hover:text-black transition-colors"
          >
            <ArrowUpRight className="w-5 h-5" />
          </Button>
        </CardFooter>
      </Card>
    </motion.div>
  );
}
