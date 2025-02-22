
import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { MoreVertical, Timer } from "lucide-react";

type Order = {
  id: string;
  customerName: string;
  items: { name: string; quantity: number; price: number }[];
  status: "pending" | "progress" | "completed" | "cancelled";
  timestamp: string;
  total: number;
};

export function OrdersList() {
  const [orders, setOrders] = useState<Order[]>([
    {
      id: "1",
      customerName: "John Doe",
      items: [
        { name: "Burger", quantity: 2, price: 10 },
        { name: "Fries", quantity: 1, price: 5 },
      ],
      status: "pending",
      timestamp: "2024-03-19T10:00:00",
      total: 25,
    },
    {
      id: "2",
      customerName: "Jane Smith",
      items: [
        { name: "Pizza", quantity: 1, price: 15 },
        { name: "Salad", quantity: 1, price: 8 },
      ],
      status: "progress",
      timestamp: "2024-03-19T10:15:00",
      total: 23,
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
        <h2 className="text-2xl font-bold tracking-tight">Orders</h2>
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm">
            Filter
          </Button>
        </div>
      </div>
      <div className="space-y-4">
        {orders.map((order) => (
          <Card key={order.id} className="order-card animate-fadeIn">
            <div className="flex items-center justify-between mb-4">
              <div>
                <div className="flex items-center space-x-2">
                  <Badge variant="outline" className="bg-secondary">
                    #{order.id}
                  </Badge>
                  <p className="font-semibold">{order.customerName}</p>
                  <Badge
                    className={`status-badge status-badge-${order.status}`}
                    variant="outline"
                  >
                    {order.status}
                  </Badge>
                </div>
                <div className="flex items-center text-sm text-muted-foreground">
                  <Timer className="mr-1 h-4 w-4" />
                  {new Date(order.timestamp).toLocaleTimeString()}
                </div>
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm">
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-40">
                  <DropdownMenuItem
                    onClick={() => updateOrderStatus(order.id, "progress")}
                  >
                    Start Preparing
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => updateOrderStatus(order.id, "completed")}
                  >
                    Mark Complete
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => updateOrderStatus(order.id, "cancelled")}
                    className="text-red-600"
                  >
                    Cancel Order
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
            <div className="space-y-2">
              {order.items.map((item, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between text-sm"
                >
                  <span>
                    {item.name} x{item.quantity}
                  </span>
                  <span className="font-medium">${item.price * item.quantity}</span>
                </div>
              ))}
              <div className="border-t pt-2 mt-2">
                <div className="flex items-center justify-between font-medium">
                  <span>Total</span>
                  <span>${order.total}</span>
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
