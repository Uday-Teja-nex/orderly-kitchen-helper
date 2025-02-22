
import { useState } from "react";
import {
  SidebarProvider,
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { KitchenView } from "@/components/KitchenView";
import { OrdersList } from "@/components/OrdersList";
import { NewOrderForm } from "@/components/NewOrderForm";
import { Button } from "@/components/ui/button";
import { Kitchen, ClipboardList, PlusCircle } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function Index() {
  const [view, setView] = useState("orders");

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <Sidebar>
          <SidebarHeader className="border-b px-6 py-4">
            <h2 className="text-lg font-semibold tracking-tight">Food Orders</h2>
          </SidebarHeader>
          <SidebarContent className="px-4 py-2">
            <div className="space-y-2">
              <Button
                variant={view === "orders" ? "secondary" : "ghost"}
                className="w-full justify-start"
                onClick={() => setView("orders")}
              >
                <ClipboardList className="mr-2 h-4 w-4" />
                Orders
              </Button>
              <Button
                variant={view === "kitchen" ? "secondary" : "ghost"}
                className="w-full justify-start"
                onClick={() => setView("kitchen")}
              >
                <Kitchen className="mr-2 h-4 w-4" />
                Kitchen
              </Button>
              <Button
                variant={view === "new" ? "secondary" : "ghost"}
                className="w-full justify-start"
                onClick={() => setView("new")}
              >
                <PlusCircle className="mr-2 h-4 w-4" />
                New Order
              </Button>
            </div>
          </SidebarContent>
        </Sidebar>

        <main className="flex-1 overflow-auto">
          <div className="container py-6">
            <SidebarTrigger />
            <Tabs value={view} className="mt-6">
              <TabsContent value="orders" className="mt-0">
                <OrdersList />
              </TabsContent>
              <TabsContent value="kitchen" className="mt-0">
                <KitchenView />
              </TabsContent>
              <TabsContent value="new" className="mt-0">
                <NewOrderForm />
              </TabsContent>
            </Tabs>
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
}
