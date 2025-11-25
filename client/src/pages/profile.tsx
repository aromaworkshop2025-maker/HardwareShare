import { useAuth } from "@/hooks/use-auth";
import { Navbar } from "@/components/layout/navbar";
import { useLocation } from "wouter";
import { useEffect } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Settings, MapPin, Link as LinkIcon, Mail } from "lucide-react";
import { useStore } from "@/lib/store";
import { ItemCard } from "@/components/ui/item-card";

export default function ProfilePage() {
  const { user, isAuthenticated } = useAuth();
  const [, setLocation] = useLocation();
  const { items } = useStore();

  useEffect(() => {
    if (!isAuthenticated) {
      setLocation('/auth');
    }
  }, [isAuthenticated, setLocation]);

  if (!user) return null;

  // Filter items for mock "My Listings" (just taking the first 2 for demo)
  const myListings = items.slice(0, 2);
  // Mock "My Requests" (taking the next 2)
  const myRequests = items.slice(2, 4);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          {/* Sidebar - User Info */}
          <div className="md:col-span-1 space-y-6">
            <Card>
              <CardContent className="pt-6 flex flex-col items-center text-center">
                <Avatar className="w-32 h-32 border-4 border-background shadow-xl mb-4">
                  <AvatarImage src={user.avatar} />
                  <AvatarFallback>{user.name[0]}</AvatarFallback>
                </Avatar>
                
                <h2 className="text-2xl font-bold font-display mb-1">{user.name}</h2>
                <p className="text-muted-foreground mb-4">{user.email}</p>
                
                <div className="flex gap-2 mb-6">
                  <Badge variant="secondary" className="rounded-full px-3">Product Designer</Badge>
                  <Badge variant="outline" className="rounded-full px-3">Pro Member</Badge>
                </div>
                
                <Button className="w-full gap-2 mb-2">
                  <Settings className="w-4 h-4" />
                  Edit Profile
                </Button>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="text-sm font-medium uppercase tracking-wider text-muted-foreground">About</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 text-sm">
                <div className="flex items-center gap-3">
                  <MapPin className="w-4 h-4 text-muted-foreground" />
                  <span>San Francisco, CA</span>
                </div>
                <div className="flex items-center gap-3">
                  <LinkIcon className="w-4 h-4 text-muted-foreground" />
                  <a href="#" className="text-primary hover:underline">alexchen.design</a>
                </div>
                <div className="flex items-center gap-3">
                  <Mail className="w-4 h-4 text-muted-foreground" />
                  <span>Contact Me</span>
                </div>
              </CardContent>
            </Card>
          </div>
          
          {/* Main Content - Tabs */}
          <div className="md:col-span-2">
            <Tabs defaultValue="listings" className="w-full">
              <TabsList className="w-full justify-start h-12 bg-muted/50 p-1 mb-8">
                <TabsTrigger value="listings" className="flex-1 max-w-[150px]">My Listings</TabsTrigger>
                <TabsTrigger value="requests" className="flex-1 max-w-[150px]">My Requests</TabsTrigger>
                <TabsTrigger value="history" className="flex-1 max-w-[150px]">History</TabsTrigger>
              </TabsList>
              
              <TabsContent value="listings" className="mt-0">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-xl font-bold font-display">Active Listings ({myListings.length})</h3>
                  <Button size="sm">Add New Item</Button>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {myListings.map(item => (
                    <ItemCard key={item.id} item={item} onRequest={() => {}} />
                  ))}
                </div>
              </TabsContent>
              
              <TabsContent value="requests" className="mt-0">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-xl font-bold font-display">Active Requests ({myRequests.length})</h3>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {myRequests.map(item => (
                    <div key={item.id} className="relative">
                      <div className="absolute top-2 right-2 z-10">
                        <Badge className="bg-yellow-500/10 text-yellow-600 hover:bg-yellow-500/20 border-yellow-500/20">Pending Approval</Badge>
                      </div>
                      <ItemCard item={item} onRequest={() => {}} />
                    </div>
                  ))}
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </main>
    </div>
  );
}
