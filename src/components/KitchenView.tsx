
import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Check, Timer } from "lucide-react";

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

  const updateOrderStatus = (orderId: string, newStatus: Order["status"]) => {
    setOrders((prevOrders) =>
      prevOrders.map((order) =>
        order.id === orderId ? { ...order, status: newStatus } : order
      )
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold tracking-tight">Kitchen View</h2>
      </div>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {orders.map((order) => (
          <Card key={order.id} className="order-card animate-fadeIn">
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="font-semibold">{order.customerName}</p>
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
        ))}
      </div>
    </div>
  );
}
