
import { useOrderStore } from "@/utils/orderStore";
import { Button } from "@/components/ui/button";
import { OrderCard } from "./OrderCard";
import { Card } from "@/components/ui/card";
import { IndianRupee, ShoppingBag } from "lucide-react";

export function OrdersList() {
  const { orders, updateOrder } = useOrderStore();

  // Fix: replace "pending" with "progress" since "pending" is not a valid status
  const activeOrders = orders.filter(
    (order) => order.status === "progress"
  );
  const completedOrders = orders.filter((order) => order.status === "completed");

  // Calculate totals
  const totalItems = orders.reduce((sum, order) => 
    sum + order.items.reduce((itemSum, item) => itemSum + item.quantity, 0), 0);
  
  const totalAmount = orders.reduce((sum, order) => sum + order.total, 0);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold tracking-tight">Orders</h2>
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm">
            Filter
          </Button>
        </div>
      </div>

      {/* Order Summary Card */}
      <Card className="p-4 bg-secondary/20">
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <ShoppingBag className="h-5 w-5 text-muted-foreground" />
            <span className="font-medium">Total Items: {totalItems}</span>
          </div>
          <div className="flex items-center space-x-2">
            <IndianRupee className="h-5 w-5 text-muted-foreground" />
            <span className="font-medium">Total Amount: ₹{totalAmount}</span>
          </div>
        </div>
      </Card>

      {activeOrders.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Active Orders</h3>
          {activeOrders.map((order) => (
            <OrderCard key={order.id} order={order} onUpdateOrder={updateOrder} />
          ))}
        </div>
      )}
      {completedOrders.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Completed Orders</h3>
          {completedOrders.map((order) => (
            <OrderCard key={order.id} order={order} onUpdateOrder={updateOrder} />
          ))}
        </div>
      )}
    </div>
  );
}
