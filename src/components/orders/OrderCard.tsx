
import { Order } from "@/utils/orderStore";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ChevronRight, Timer, IndianRupee } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Input } from "@/components/ui/input";
import { toast } from "@/hooks/use-toast";
import { useState } from "react";

interface OrderCardProps {
  order: Order;
  onUpdateOrder: (orderId: string, updates: Partial<Order>) => void;
}

export function OrderCard({ order, onUpdateOrder }: OrderCardProps) {
  const [editingOrder, setEditingOrder] = useState<Order | null>(null);

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
    
    onUpdateOrder(editingOrder.id, editingOrder);
    
    toast({
      title: "Order updated",
      description: `Order #${editingOrder.id} has been updated successfully.`,
    });
    
    setEditingOrder(null);
  };

  const totalItems = order.items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <Card className="p-4">
      <Sheet>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4 flex-1">
            <Badge variant="outline" className="bg-secondary">
              #{order.id}
            </Badge>
            <span className="font-medium">{order.customerName}</span>
            <div className="flex items-center text-sm text-muted-foreground">
              <Timer className="mr-1 h-4 w-4" />
              {new Date(order.timestamp).toLocaleTimeString()}
            </div>
            <Badge
              className={`status-badge status-badge-${order.status}`}
              variant="outline"
            >
              {order.status}
            </Badge>
            <span className="text-sm text-muted-foreground">
              {totalItems} items
            </span>
            <span className="font-medium flex items-center">
              <IndianRupee className="h-4 w-4 mr-1" />
              {order.total}
            </span>
          </div>
          <SheetTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              className="ml-2"
              onClick={() => setEditingOrder(order)}
            >
              <ChevronRight className="h-4 w-4" />
              Details
            </Button>
          </SheetTrigger>
        </div>
        <SheetContent>
          <SheetHeader>
            <SheetTitle>Order #{order.id} Details</SheetTitle>
          </SheetHeader>
          <div className="mt-6">
            <div className="space-y-4">
              <div>
                <h3 className="font-medium mb-2">Customer</h3>
                <p>{order.customerName}</p>
              </div>
              <div>
                <h3 className="font-medium mb-2">Items</h3>
                {editingOrder && editingOrder.id === order.id ? (
                  <div className="space-y-2">
                    {editingOrder.items.map((item, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between space-x-4"
                      >
                        <span className="flex-grow">{item.name}</span>
                        <div className="flex items-center space-x-2">
                          <Input
                            type="number"
                            value={item.quantity}
                            onChange={(e) =>
                              handleQuantityChange(index, e.target.value)
                            }
                            className="w-20"
                            min="0"
                          />
                          <span className="w-20 text-right flex items-center justify-end">
                            <IndianRupee className="h-3 w-3 mr-1" />
                            {item.price * item.quantity}
                          </span>
                        </div>
                      </div>
                    ))}
                    <Button className="w-full mt-4" onClick={saveChanges}>
                      Save Changes
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-2">
                    {order.items.map((item, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between"
                      >
                        <span>
                          {item.name} x{item.quantity}
                        </span>
                        <span className="font-medium flex items-center">
                          <IndianRupee className="h-3 w-3 mr-1" />
                          {item.price * item.quantity}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              <div className="border-t pt-4">
                <div className="flex items-center justify-between font-medium">
                  <span>Total</span>
                  <span className="flex items-center">
                    <IndianRupee className="h-4 w-4 mr-1" />
                    {order.total}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </Card>
  );
}
