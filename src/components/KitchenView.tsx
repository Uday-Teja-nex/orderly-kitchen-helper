
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Check, Timer, Pencil } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Input } from "@/components/ui/input";
import { toast } from "@/hooks/use-toast";
import { useOrderStore, Order, OrderItem } from "@/utils/orderStore";
import { useState } from "react";

export function KitchenView() {
  const { orders, updateOrder, updateOrderItem } = useOrderStore();
  const [editingOrder, setEditingOrder] = useState<Order | null>(null);

  const activeOrders = orders.filter((order) => order.status === "progress");
  const completedOrders = orders.filter((order) => order.status === "completed");

  const handleQuantityChange = (itemIndex: number, newQuantity: string) => {
    if (!editingOrder) return;
    
    const quantity = parseInt(newQuantity) || 0;
    if (quantity < 0) return;

    const updatedItems = editingOrder.items.map((item, index) => {
      if (index === itemIndex) {
        return { ...item, quantity };
      }
      return item;
    });

    const newTotal = updatedItems.reduce(
      (sum, item) => sum + item.quantity * item.price,
      0
    );

    setEditingOrder({
      ...editingOrder,
      items: updatedItems,
      total: newTotal,
    });
  };

  const saveChanges = () => {
    if (!editingOrder) return;
    
    updateOrder(editingOrder.id, editingOrder);
    
    toast({
      title: "Order updated",
      description: `Order #${editingOrder.id} has been updated successfully.`,
    });
    
    setEditingOrder(null);
  };

  const markItemStatus = (orderId: string, itemIndex: number, status: "progress" | "completed") => {
    updateOrderItem(orderId, itemIndex, status);
    
    toast({
      title: `Item ${status === "completed" ? "completed" : "in progress"}`,
      description: `The item has been marked as ${status === "completed" ? "completed" : "in progress"}.`,
    });
  };

  const OrderCard = ({ order }: { order: Order }) => (
    <Card 
      key={order.id} 
      className="order-card animate-fadeIn p-6"
      data-status={order.status}
    >
      <div className="flex items-center justify-between mb-4">
        <div>
          <div className="flex items-center space-x-2">
            <Badge variant="outline" className="bg-secondary">
              #{order.id}
            </Badge>
            <p className="font-semibold">{order.customerName}</p>
          </div>
          <div className="flex items-center text-sm text-muted-foreground">
            <Timer className="mr-1 h-4 w-4" />
            {new Date(order.timestamp).toLocaleTimeString()}
          </div>
        </div>
        <Badge
          className={`status-badge status-badge-${order.status}`}
          variant="outline"
        >
          {order.status}
        </Badge>
      </div>
      <Sheet>
        <SheetTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className="absolute top-2 right-2 h-8 w-8"
            onClick={() => setEditingOrder(order)}
          >
            <Pencil className="h-4 w-4" />
          </Button>
        </SheetTrigger>
        <SheetContent>
          <SheetHeader>
            <SheetTitle>Edit Order #{order.id}</SheetTitle>
          </SheetHeader>
          {editingOrder && editingOrder.id === order.id && (
            <div className="mt-6 space-y-4">
              {editingOrder.items.map((item, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between space-x-4"
                >
                  <span className="flex-grow">{item.name}</span>
                  <Input
                    type="number"
                    value={item.quantity}
                    onChange={(e) =>
                      handleQuantityChange(index, e.target.value)
                    }
                    className="w-20"
                    min="0"
                  />
                </div>
              ))}
              <Button className="w-full mt-4" onClick={saveChanges}>
                Save Changes
              </Button>
            </div>
          )}
        </SheetContent>
      </Sheet>
      <ul className="space-y-2 mb-4">
        {order.items.map((item, index) => (
          <li
            key={index}
            className="flex items-center justify-between text-sm"
          >
            <div className="flex items-center space-x-2">
              <span>{item.name}</span>
              <Badge 
                variant="outline" 
                className={`text-xs ${item.status === "completed" ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"}`}
              >
                {item.status || "progress"}
              </Badge>
            </div>
            <div className="flex items-center space-x-2">
              <span className="font-medium">x{item.quantity}</span>
              {order.status !== "completed" && (
                <>
                  {item.status !== "completed" ? (
                    <Button
                      size="sm"
                      variant="outline"
                      className="h-7 px-2 text-xs"
                      onClick={() => markItemStatus(order.id, index, "completed")}
                    >
                      <Check className="mr-1 h-3 w-3" />
                      Done
                    </Button>
                  ) : (
                    <Button
                      size="sm"
                      variant="outline"
                      className="h-7 px-2 text-xs"
                      onClick={() => markItemStatus(order.id, index, "progress")}
                    >
                      In Progress
                    </Button>
                  )}
                </>
              )}
            </div>
          </li>
        ))}
      </ul>
      <div className="flex justify-end space-x-2">
        {order.status !== "completed" && (
          <Button
            size="sm"
            onClick={() => {
              // Fix type issue by properly specifying the status type
              const allItemsCompleted = order.items.map(item => ({
                ...item,
                status: "completed" as const
              }));
              
              updateOrder(order.id, { 
                status: "completed",
                items: allItemsCompleted
              });
            }}
          >
            <Check className="mr-1 h-4 w-4" />
            Mark All Complete
          </Button>
        )}
      </div>
    </Card>
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold tracking-tight">Kitchen View</h2>
      </div>
      {activeOrders.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Active Orders</h3>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {activeOrders.map((order) => (
              <OrderCard key={order.id} order={order} />
            ))}
          </div>
        </div>
      )}
      {completedOrders.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Completed Orders</h3>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {completedOrders.map((order) => (
              <OrderCard key={order.id} order={order} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
