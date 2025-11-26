import { Link, useLocation } from "wouter";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { CircuitBoard, LogOut, Plus, User as UserIcon, Menu } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useState } from "react";

export function Navbar() {
  const { user, logout } = useAuth();
  const [location, setLocation] = useLocation();
  const [open, setOpen] = useState(false);

  const NavItems = () => (
    <>
      <Link href="/">
        <a className={`text-sm font-bold uppercase tracking-wider hover:text-primary transition-colors ${location === "/" ? "underline decoration-2 decoration-primary underline-offset-4" : ""}`}>
          Start
        </a>
      </Link>
      <Link href="/community">
        <a className="text-sm font-bold uppercase tracking-wider hover:text-primary transition-colors">
          Community
        </a>
      </Link>
      <Link href="/about">
        <a className="text-sm font-bold uppercase tracking-wider hover:text-primary transition-colors">
          Manifesto
        </a>
      </Link>
    </>
  );

  return (
    <header className="sticky top-0 z-50 w-full border-b-2 border-black bg-background">
      <div className="container mx-auto px-4 h-20 flex items-center justify-between">
        <Link href="/">
          <a className="flex items-center gap-2 group">
            <div className="p-2 bg-black text-primary group-hover:bg-primary group-hover:text-black transition-colors border-2 border-black">
              <CircuitBoard className="w-6 h-6" />
            </div>
            <span className="font-display font-bold text-2xl tracking-tighter uppercase hidden sm:block">
              Equip<span className="text-primary">Share</span>
            </span>
          </a>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-8">
          <NavItems />
        </nav>

        <div className="flex items-center gap-4">
          {user ? (
            <>
              <Button className="hidden sm:flex rounded-none border-2 border-black bg-primary text-black hover:bg-black hover:text-white font-bold uppercase tracking-wide shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-y-[2px] hover:translate-x-[2px] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all">
                <Plus className="w-4 h-4 mr-2" />
                List Gear
              </Button>
              
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-10 w-10 rounded-none border-2 border-black p-0 overflow-hidden hover:bg-accent">
                    <Avatar className="h-full w-full rounded-none">
                      <AvatarImage src={user.avatar || undefined} alt={user.name} />
                      <AvatarFallback className="rounded-none font-bold">{user.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56 rounded-none border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                  <div className="flex items-center justify-start gap-2 p-2 bg-muted/50 border-b-2 border-black">
                    <div className="flex flex-col space-y-1 leading-none">
                      <p className="font-bold uppercase truncate">{user.name}</p>
                      <p className="text-xs text-muted-foreground truncate">{user.email}</p>
                    </div>
                  </div>
                  <DropdownMenuItem onClick={() => setLocation('/profile')} className="rounded-none focus:bg-primary focus:text-black cursor-pointer font-medium">
                    <UserIcon className="mr-2 h-4 w-4" />
                    Profile
                  </DropdownMenuItem>
                  <DropdownMenuSeparator className="bg-black/20" />
                  <DropdownMenuItem onClick={logout} className="rounded-none focus:bg-destructive focus:text-white cursor-pointer font-medium text-destructive">
                    <LogOut className="mr-2 h-4 w-4" />
                    Log out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          ) : (
            <div className="flex items-center gap-4">
              <Link href="/auth">
                <a className="text-sm font-bold uppercase tracking-wider hover:underline decoration-2 decoration-primary underline-offset-4">
                  Login
                </a>
              </Link>
              <Link href="/auth">
                <Button className="rounded-none border-2 border-black bg-black text-white hover:bg-primary hover:text-black font-bold uppercase tracking-wide shadow-[4px_4px_0px_0px_rgba(0,0,0,0.3)] hover:translate-y-[1px] hover:translate-x-[1px] hover:shadow-none transition-all">
                  Join Now
                </Button>
              </Link>
            </div>
          )}

          {/* Mobile Menu */}
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden rounded-none border-2 border-black">
                <Menu className="w-6 h-6" />
              </Button>
            </SheetTrigger>
            <SheetContent className="w-[300px] border-l-2 border-black sm:w-[400px] p-0 rounded-none">
               <div className="h-full flex flex-col p-6 bg-background">
                  <div className="font-display font-bold text-2xl mb-8 uppercase">Menu</div>
                  <nav className="flex flex-col gap-6">
                    <NavItems />
                    <hr className="border-black" />
                    {user && (
                      <Button className="rounded-none border-2 border-black bg-primary text-black font-bold uppercase">
                        List New Item
                      </Button>
                    )}
                  </nav>
               </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
