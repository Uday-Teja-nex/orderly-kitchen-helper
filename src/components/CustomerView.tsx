
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Timer } from "lucide-react";
import { useOrderStore, Order } from "@/utils/orderStore";

export function CustomerView() {
  const { orders } = useOrderStore();

  const activeOrders = orders.filter((order) => order.status === "progress");
  const completedOrders = orders.filter((order) => order.status === "completed");

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
      <ul className="space-y-2 mb-4">
        {order.items.map((item, index) => (
          <li
            key={index}
            className="flex items-center justify-between text-sm"
          >
            <div className="flex items-center space-x-2">
              <span>{item.name}</span>
              {item.status && (
                <Badge 
                  variant="outline" 
                  className={`text-xs ${item.status === "completed" ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"}`}
                >
                  {item.status}
                </Badge>
              )}
            </div>
            <span className="font-medium">x{item.quantity}</span>
          </li>
        ))}
      </ul>
    </Card>
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold tracking-tight">Order Status</h2>
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
