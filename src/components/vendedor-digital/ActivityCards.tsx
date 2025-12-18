import { ActivityItem } from "../../lib/vendedorDigital/types";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Badge } from "../ui/badge";
import { Skeleton } from "../ui/skeleton";

interface ActivityCardsProps {
  items: ActivityItem[];
  loading?: boolean;
}

export function ActivityCards({ items, loading }: ActivityCardsProps) {
  return (
    <div className="grid gap-3 md:hidden">
      {loading
        ? [1, 2, 3].map((id) => (
            <Card key={id}>
              <CardHeader>
                <Skeleton className="h-4 w-40" />
              </CardHeader>
              <CardContent className="space-y-2">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-4 w-36" />
              </CardContent>
            </Card>
          ))
        : items.map((item, idx) => (
            <Card key={`${item.title}-${idx}`}>
              <CardHeader className="pb-2">
                <CardTitle className="text-base">{item.title}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm">
                <div className="text-muted-foreground">{item.detail || "—"}</div>
                <div className="flex items-center justify-between">
                  <span>{item.meta || "—"}</span>
                  <Badge variant="secondary">
                    {item.status === "success"
                      ? "Completado"
                      : item.status === "error"
                      ? "Error"
                      : "En curso"}
                  </Badge>
                </div>
              </CardContent>
            </Card>
          ))}
    </div>
  );
}
