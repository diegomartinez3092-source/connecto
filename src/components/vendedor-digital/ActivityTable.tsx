import { ActivityItem } from "../../lib/vendedorDigital/types";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../ui/table";
import { Badge } from "../ui/badge";
import { Skeleton } from "../ui/skeleton";

interface ActivityTableProps {
  items: ActivityItem[];
  loading?: boolean;
}

export function ActivityTable({ items, loading }: ActivityTableProps) {
  return (
    <div className="hidden md:block">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Evento</TableHead>
            <TableHead>Meta</TableHead>
            <TableHead>Detalle</TableHead>
            <TableHead>Estado</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {loading
            ? [1, 2, 3].map((id) => (
                <TableRow key={id}>
                  <TableCell><Skeleton className="h-4 w-32" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-40" /></TableCell>
                  <TableCell><Skeleton className="h-5 w-20" /></TableCell>
                </TableRow>
              ))
            : items.map((item, idx) => (
                <TableRow key={`${item.title}-${idx}`}>
                  <TableCell className="font-medium">{item.title}</TableCell>
                  <TableCell>{item.meta || "—"}</TableCell>
                  <TableCell className="text-muted-foreground">{item.detail || "—"}</TableCell>
                  <TableCell>
                    <Badge variant="secondary">
                      {item.status === "success"
                        ? "Completado"
                        : item.status === "error"
                        ? "Error"
                        : "En curso"}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
        </TableBody>
      </Table>
    </div>
  );
}
