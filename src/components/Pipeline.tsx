import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { DollarSign, Calendar, User, MoreVertical, TrendingUp } from "lucide-react";
import { cn } from "./ui/utils";

interface Oportunidad {
  id: string;
  titulo: string;
  cliente: string;
  valor: number;
  probabilidad: number;
  vendedor: string;
  fechaCierre: string;
  notas: string;
}

interface Columna {
  id: string;
  titulo: string;
  color: string;
  oportunidades: Oportunidad[];
}

export function Pipeline() {
  const [columnas, setColumnas] = useState<Columna[]>([
    {
      id: "prospectos",
      titulo: "Prospectos",
      color: "bg-blue-500",
      oportunidades: [
        {
          id: "1",
          titulo: "Láminas para Almacén",
          cliente: "Constructora del Norte",
          valor: 125400,
          probabilidad: 20,
          vendedor: "María González",
          fechaCierre: "2025-11-15",
          notas: "Primera conversación, interés en láminas galvanizadas",
        },
        {
          id: "2",
          titulo: "Paneles Aislantes",
          cliente: "Industrias del Bajío",
          valor: 89750,
          probabilidad: 30,
          vendedor: "Carlos Ruiz",
          fechaCierre: "2025-11-20",
          notas: "Requieren cotización formal",
        },
      ],
    },
    {
      id: "cotizaciones",
      titulo: "Cotizaciones Enviadas",
      color: "bg-yellow-500",
      oportunidades: [
        {
          id: "3",
          titulo: "Perfiles y Estructuras",
          cliente: "Metales y Más",
          valor: 234500,
          probabilidad: 50,
          vendedor: "Ana Martínez",
          fechaCierre: "2025-10-25",
          notas: "Cotización enviada, pendiente respuesta",
        },
        {
          id: "4",
          titulo: "Láminas para Naves",
          cliente: "Agroindustrias GS",
          valor: 178900,
          probabilidad: 60,
          vendedor: "Luis Torres",
          fechaCierre: "2025-10-30",
          notas: "Cliente evaluando propuesta",
        },
      ],
    },
    {
      id: "negociacion",
      titulo: "Negociación",
      color: "bg-orange-500",
      oportunidades: [
        {
          id: "5",
          titulo: "Proyecto Expansión",
          cliente: "Paneles Industriales",
          valor: 456800,
          probabilidad: 75,
          vendedor: "María González",
          fechaCierre: "2025-10-18",
          notas: "Negociando descuentos y plazos de entrega",
        },
      ],
    },
    {
      id: "ganadas",
      titulo: "Ganadas",
      color: "bg-green-500",
      oportunidades: [
        {
          id: "6",
          titulo: "Revestimiento Bodega",
          cliente: "Constructora Moderna",
          valor: 345600,
          probabilidad: 100,
          vendedor: "Carlos Ruiz",
          fechaCierre: "2025-10-10",
          notas: "Orden de compra recibida",
        },
        {
          id: "7",
          titulo: "Mantenimiento Anual",
          cliente: "Fábrica del Norte",
          valor: 123400,
          probabilidad: 100,
          vendedor: "Ana Martínez",
          fechaCierre: "2025-10-08",
          notas: "Contrato firmado",
        },
      ],
    },
    {
      id: "perdidas",
      titulo: "Perdidas",
      color: "bg-red-500",
      oportunidades: [
        {
          id: "8",
          titulo: "Láminas Especiales",
          cliente: "Industrias del Sur",
          valor: 98500,
          probabilidad: 0,
          vendedor: "Luis Torres",
          fechaCierre: "2025-09-30",
          notas: "Cliente eligió otro proveedor",
        },
      ],
    },
  ]);

  const [draggedItem, setDraggedItem] = useState<{
    oportunidad: Oportunidad;
    columnaOrigen: string;
  } | null>(null);

  const handleDragStart = (oportunidad: Oportunidad, columnaId: string) => {
    setDraggedItem({ oportunidad, columnaOrigen: columnaId });
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (columnaDestinoId: string) => {
    if (!draggedItem) return;

    const nuevasColumnas = columnas.map((columna) => {
      // Remover de columna origen
      if (columna.id === draggedItem.columnaOrigen) {
        return {
          ...columna,
          oportunidades: columna.oportunidades.filter(
            (op) => op.id !== draggedItem.oportunidad.id
          ),
        };
      }
      // Agregar a columna destino
      if (columna.id === columnaDestinoId) {
        return {
          ...columna,
          oportunidades: [...columna.oportunidades, draggedItem.oportunidad],
        };
      }
      return columna;
    });

    setColumnas(nuevasColumnas);
    setDraggedItem(null);
  };

  const calcularTotalColumna = (oportunidades: Oportunidad[]) => {
    return oportunidades.reduce((sum, op) => sum + op.valor, 0);
  };

  const calcularTotalPipeline = () => {
    return columnas.reduce(
      (sum, columna) => sum + calcularTotalColumna(columna.oportunidades),
      0
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl mb-2">Pipeline de Ventas</h1>
        <p className="text-muted-foreground">
          Gestiona tus oportunidades a través del embudo de ventas
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <p className="text-sm text-muted-foreground mb-1">Valor Total Pipeline</p>
            <p className="text-2xl">
              ${(calcularTotalPipeline() / 1000).toFixed(0)}k
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-sm text-muted-foreground mb-1">Oportunidades Activas</p>
            <p className="text-2xl">
              {columnas.reduce((sum, c) => sum + c.oportunidades.length, 0)}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-sm text-muted-foreground mb-1">Tasa de Cierre</p>
            <div className="flex items-center gap-2">
              <p className="text-2xl">68%</p>
              <TrendingUp className="w-5 h-5 text-green-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-sm text-muted-foreground mb-1">Cierre Proyectado</p>
            <p className="text-2xl">$1.2M</p>
          </CardContent>
        </Card>
      </div>

      {/* Pipeline Board */}
      <div className="overflow-x-auto pb-4">
        <div className="flex gap-4 min-w-max">
          {columnas.map((columna) => (
            <div
              key={columna.id}
              className="flex-shrink-0 w-80"
              onDragOver={handleDragOver}
              onDrop={() => handleDrop(columna.id)}
            >
              <Card>
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className={cn("w-3 h-3 rounded-full", columna.color)} />
                      <CardTitle className="text-base">{columna.titulo}</CardTitle>
                      <Badge variant="secondary">
                        {columna.oportunidades.length}
                      </Badge>
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground mt-2">
                    ${(calcularTotalColumna(columna.oportunidades) / 1000).toFixed(0)}k
                  </p>
                </CardHeader>
                <CardContent className="space-y-3">
                  {columna.oportunidades.length === 0 ? (
                    <div className="border-2 border-dashed border-border rounded-lg p-8 text-center">
                      <p className="text-sm text-muted-foreground">
                        Arrastra oportunidades aquí
                      </p>
                    </div>
                  ) : (
                    columna.oportunidades.map((oportunidad) => (
                      <div
                        key={oportunidad.id}
                        draggable
                        onDragStart={() => handleDragStart(oportunidad, columna.id)}
                        className="bg-card border border-border rounded-lg p-4 cursor-move hover:shadow-md transition-shadow"
                      >
                        <div className="flex items-start justify-between mb-3">
                          <h4 className="font-semibold">{oportunidad.titulo}</h4>
                          <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                            <MoreVertical className="w-4 h-4" />
                          </Button>
                        </div>

                        <p className="text-sm text-muted-foreground mb-3">
                          {oportunidad.cliente}
                        </p>

                        <div className="space-y-2 mb-3">
                          <div className="flex items-center gap-2 text-sm">
                            <DollarSign className="w-4 h-4 text-muted-foreground" />
                            <span className="font-semibold">
                              ${oportunidad.valor.toLocaleString("es-MX")}
                            </span>
                          </div>
                          <div className="flex items-center gap-2 text-sm">
                            <Calendar className="w-4 h-4 text-muted-foreground" />
                            <span>
                              {new Date(oportunidad.fechaCierre).toLocaleDateString(
                                "es-MX"
                              )}
                            </span>
                          </div>
                          <div className="flex items-center gap-2 text-sm">
                            <User className="w-4 h-4 text-muted-foreground" />
                            <span>{oportunidad.vendedor}</span>
                          </div>
                        </div>

                        <div className="space-y-1">
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-muted-foreground">Probabilidad</span>
                            <span className="font-semibold">
                              {oportunidad.probabilidad}%
                            </span>
                          </div>
                          <div className="w-full bg-muted rounded-full h-2">
                            <div
                              className={cn(
                                "h-2 rounded-full transition-all",
                                columna.color
                              )}
                              style={{ width: `${oportunidad.probabilidad}%` }}
                            />
                          </div>
                        </div>

                        {oportunidad.notas && (
                          <p className="text-xs text-muted-foreground mt-3 line-clamp-2">
                            {oportunidad.notas}
                          </p>
                        )}
                      </div>
                    ))
                  )}
                </CardContent>
              </Card>
            </div>
          ))}
        </div>
      </div>

      {/* Instructions */}
      <Card className="bg-accent/50">
        <CardContent className="p-4">
          <p className="text-sm text-muted-foreground">
            💡 <strong>Tip:</strong> Arrastra y suelta las tarjetas entre columnas para
            actualizar el estado de tus oportunidades. El pipeline se actualiza en tiempo
            real.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
