import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FileText, ClipboardList } from "lucide-react";
import FICFrontForm from "@/components/FICFrontForm";
import FICBackForm from "@/components/FICBackForm";

const Index = () => {
  const [activeTab, setActiveTab] = useState("front");

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-form-header text-form-header-foreground shadow-lg">
        <div className="container py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <ClipboardList className="w-6 h-6" />
            <div>
              <h1 className="text-lg font-bold tracking-wide">FIC Digital Forms</h1>
              <p className="text-xs opacity-80">Final Inspection Card System</p>
            </div>
          </div>
          <div className="flex items-center gap-2 text-xs">
            <span className="px-2 py-1 bg-primary/20 rounded font-mono">VIN: 5J8YD9H43TL000680</span>
          </div>
        </div>
      </header>

      {/* Main Content with Tabs */}
      <main className="container pb-24">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <div className="sticky top-[60px] z-40 bg-background pt-4 pb-2 -mx-4 px-4 border-b border-border">
            <TabsList className="grid w-full max-w-md mx-auto grid-cols-2 h-14">
              <TabsTrigger 
                value="front" 
                className="text-sm font-medium data-[state=active]:bg-primary data-[state=active]:text-primary-foreground h-12 gap-2"
              >
                <FileText className="w-4 h-4" />
                Front (Page 1)
              </TabsTrigger>
              <TabsTrigger 
                value="back" 
                className="text-sm font-medium data-[state=active]:bg-primary data-[state=active]:text-primary-foreground h-12 gap-2"
              >
                <FileText className="w-4 h-4" />
                Back (Page 2)
              </TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="front" className="mt-0 focus-visible:outline-none">
            <FICFrontForm />
          </TabsContent>

          <TabsContent value="back" className="mt-0 focus-visible:outline-none">
            <FICBackForm />
          </TabsContent>
        </Tabs>
      </main>

      {/* Footer */}
      <footer className="fixed bottom-0 left-0 right-0 bg-card border-t border-border py-3 px-4">
        <div className="container flex items-center justify-between">
          <span className="text-xs text-muted-foreground">TS2-VQ0099 Rev.3</span>
          <div className="flex gap-2">
            <button className="px-4 py-2 text-sm font-medium bg-secondary text-secondary-foreground rounded-md hover:bg-secondary/80 transition-colors touch-target">
              Clear Form
            </button>
            <button className="px-4 py-2 text-sm font-medium bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors touch-target">
              Save Progress
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
