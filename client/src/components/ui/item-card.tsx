import { Item } from "@/lib/mock-data";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Clock, ArrowRight } from "lucide-react";
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
      whileHover={{ y: -4 }}
      transition={{ duration: 0.2 }}
    >
      <Card className="overflow-hidden group h-full border-border/50 hover:border-primary/20 transition-colors shadow-sm hover:shadow-md bg-card">
        <div className="aspect-[4/3] overflow-hidden relative bg-muted">
          <img 
            src={item.image} 
            alt={item.title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
          <div className="absolute top-3 right-3">
            <Badge variant={isAvailable ? "secondary" : "outline"} className="backdrop-blur-md bg-background/80">
              {item.status}
            </Badge>
          </div>
          <div className="absolute top-3 left-3">
            <Badge variant="outline" className="backdrop-blur-md bg-background/80 text-xs">
              {item.category}
            </Badge>
          </div>
        </div>
        
        <CardContent className="p-5 space-y-3">
          <div className="flex justify-between items-start gap-2">
            <h3 className="font-display font-bold text-lg leading-tight line-clamp-2 text-foreground group-hover:text-primary transition-colors">
              {item.title}
            </h3>
          </div>
          
          <p className="text-sm text-muted-foreground line-clamp-2 h-10">
            {item.description}
          </p>
          
          <div className="flex items-center gap-2 text-xs text-muted-foreground pt-2">
            <Badge variant="outline" className="rounded-full px-2 py-0 h-5 text-[10px] font-normal border-border">
              {item.condition}
            </Badge>
            <span className="flex items-center gap-1 ml-auto">
              <Clock className="w-3 h-3" />
              {formatDistanceToNow(new Date(item.postedAt), { addSuffix: true })}
            </span>
          </div>
        </CardContent>
        
        <CardFooter className="p-4 pt-0 flex items-center justify-between border-t border-border/50 mt-auto bg-muted/20 h-14">
          <div className="flex items-center gap-2">
            <Avatar className="w-6 h-6 border border-border">
              <AvatarImage src={item.owner.avatar} />
              <AvatarFallback>{item.owner.name[0]}</AvatarFallback>
            </Avatar>
            <span className="text-xs font-medium text-muted-foreground truncate max-w-[100px]">
              {item.owner.name}
            </span>
          </div>
          
          <Button 
            size="sm" 
            variant={isAvailable ? "default" : "secondary"}
            disabled={!isAvailable}
            onClick={() => onRequest(item.id)}
            className="h-8 px-3 text-xs gap-1"
          >
            {isAvailable ? 'Request' : 'Details'}
            {isAvailable && <ArrowRight className="w-3 h-3" />}
          </Button>
        </CardFooter>
      </Card>
    </motion.div>
  );
}
