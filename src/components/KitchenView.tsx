
import { useState } from "react";
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

type Order = {
  id: string;
  customerName: string;
  items: { name: string; quantity: number }[];
  status: "pending" | "progress" | "completed" | "cancelled";
  timestamp: string;
};

export function KitchenView() {
  const [orders, setOrders] = useState<Order[]>([
    {
      id: "1",
      customerName: "John Doe",
      items: [
        { name: "Burger", quantity: 2 },
        { name: "Fries", quantity: 1 },
      ],
      status: "pending",
      timestamp: "2024-03-19T10:00:00",
    },
    {
      id: "2",
      customerName: "Jane Smith",
      items: [
        { name: "Pizza", quantity: 1 },
        { name: "Salad", quantity: 1 },
      ],
      status: "progress",
      timestamp: "2024-03-19T10:15:00",
    },
  ]);

  const [editingOrder, setEditingOrder] = useState<Order | null>(null);

  const activeOrders = orders.filter(
    (order) => order.status === "pending" || order.status === "progress"
  );
  const completedOrders = orders.filter((order) => order.status === "completed");

  const updateOrderStatus = (orderId: string, newStatus: Order["status"]) => {
    setOrders((prevOrders) =>
      prevOrders.map((order) =>
        order.id === orderId ? { ...order, status: newStatus } : order
      )
    );
  };

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

    setEditingOrder({
      ...editingOrder,
      items: updatedItems,
    });
  };

  const saveChanges = () => {
    if (!editingOrder) return;
    
    setOrders((prevOrders) =>
      prevOrders.map((order) =>
        order.id === editingOrder.id ? editingOrder : order
      )
    );
    
    toast({
      title: "Order updated",
      description: `Order #${editingOrder.id} has been updated successfully.`,
    });
    
    setEditingOrder(null);
  };

  const OrderCard = ({ order }: { order: Order }) => (
    <Card key={order.id} className="order-card animate-fadeIn p-6">
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
      <ul className="space-y-2 mb-4">
        {order.items.map((item, index) => (
          <li
            key={index}
            className="flex items-center justify-between text-sm"
          >
            <span>{item.name}</span>
            <span className="font-medium">x{item.quantity}</span>
          </li>
        ))}
      </ul>
      <div className="flex justify-end space-x-2">
        <Sheet>
          <SheetTrigger asChild>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setEditingOrder(order)}
            >
              <Pencil className="h-4 w-4" />
              Edit
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
        {order.status === "pending" && (
          <Button
            size="sm"
            onClick={() => updateOrderStatus(order.id, "progress")}
          >
            Start Preparing
          </Button>
        )}
        {order.status === "progress" && (
          <Button
            size="sm"
            onClick={() => updateOrderStatus(order.id, "completed")}
          >
            <Check className="mr-1 h-4 w-4" />
            Mark Complete
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
