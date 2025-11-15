import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { BarChart3, Download, Calendar, TrendingUp, Users, DollarSign } from "lucide-react";

const ventasPorVendedor = [
  { vendedor: "María G.", ventas: 345, meta: 300 },
  { vendedor: "Carlos R.", ventas: 298, meta: 300 },
  { vendedor: "Ana M.", ventas: 276, meta: 280 },
  { vendedor: "Luis T.", ventas: 234, meta: 250 },
  { vendedor: "Sofia L.", ventas: 198, meta: 220 },
];

const ventasPorLinea = [
  { linea: "Láminas", ene: 145, feb: 168, mar: 152 },
  { linea: "Paneles", ene: 98, feb: 112, mar: 124 },
  { linea: "Perfiles", ene: 76, feb: 82, mar: 89 },
  { linea: "Accesorios", ene: 45, feb: 52, mar: 48 },
];

export function Reportes() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl mb-2">Reportes y Analítica</h1>
          <p className="text-muted-foreground">
            Analiza el desempeño de tu equipo y operación
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Select defaultValue="mes">
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="semana">Esta Semana</SelectItem>
              <SelectItem value="mes">Este Mes</SelectItem>
              <SelectItem value="trimestre">Este Trimestre</SelectItem>
              <SelectItem value="año">Este Año</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline">
            <Download className="w-4 h-4 mr-2" />
            Exportar
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Ventas Totales</p>
                <p className="text-2xl mb-1">$1.8M</p>
                <p className="text-sm text-green-600 flex items-center gap-1">
                  <TrendingUp className="w-3 h-3" />
                  +18.5%
                </p>
              </div>
              <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-lg flex items-center justify-center">
                <DollarSign className="w-5 h-5" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Órdenes Cerradas</p>
                <p className="text-2xl mb-1">67</p>
                <p className="text-sm text-green-600 flex items-center gap-1">
                  <TrendingUp className="w-3 h-3" />
                  +12.3%
                </p>
              </div>
              <div className="w-10 h-10 bg-green-50 text-green-600 rounded-lg flex items-center justify-center">
                <BarChart3 className="w-5 h-5" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Ticket Promedio</p>
                <p className="text-2xl mb-1">$26.8k</p>
                <p className="text-sm text-green-600 flex items-center gap-1">
                  <TrendingUp className="w-3 h-3" />
                  +5.2%
                </p>
              </div>
              <div className="w-10 h-10 bg-purple-50 text-purple-600 rounded-lg flex items-center justify-center">
                <Calendar className="w-5 h-5" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Clientes Nuevos</p>
                <p className="text-2xl mb-1">23</p>
                <p className="text-sm text-green-600 flex items-center gap-1">
                  <TrendingUp className="w-3 h-3" />
                  +31.8%
                </p>
              </div>
              <div className="w-10 h-10 bg-orange-50 text-orange-600 rounded-lg flex items-center justify-center">
                <Users className="w-5 h-5" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Desempeño por Vendedor</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={ventasPorVendedor}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="vendedor" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="ventas" fill="#3b82f6" name="Ventas ($k)" />
                <Bar dataKey="meta" fill="#e5e7eb" name="Meta ($k)" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Ventas por Línea de Producto</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={[
                { mes: "Ene", laminas: 145, paneles: 98, perfiles: 76 },
                { mes: "Feb", laminas: 168, paneles: 112, perfiles: 82 },
                { mes: "Mar", laminas: 152, paneles: 124, perfiles: 89 },
              ]}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="mes" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="laminas" stroke="#3b82f6" strokeWidth={2} name="Láminas" />
                <Line type="monotone" dataKey="paneles" stroke="#10b981" strokeWidth={2} name="Paneles" />
                <Line type="monotone" dataKey="perfiles" stroke="#f59e0b" strokeWidth={2} name="Perfiles" />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Reports */}
      <Card>
        <CardHeader>
          <CardTitle>Reportes Disponibles</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              { title: "Ventas por Región", description: "Análisis geográfico de ventas" },
              { title: "Productos más Vendidos", description: "Top SKUs del periodo" },
              { title: "Análisis de Márgenes", description: "Rentabilidad por producto" },
              { title: "Conversión de Pipeline", description: "Efectividad del embudo" },
              { title: "Tiempo de Cierre", description: "Días promedio por etapa" },
              { title: "ROI de Campañas", description: "Retorno de inversión marketing" },
            ].map((reporte) => (
              <div
                key={reporte.title}
                className="p-4 rounded-lg border-2 border-border hover:border-primary hover:bg-accent transition-all"
              >
                <h4 className="font-semibold mb-1">{reporte.title}</h4>
                <p className="text-sm text-muted-foreground mb-3">
                  {reporte.description}
                </p>
                <Button variant="outline" size="sm" className="w-full">
                  Generar Reporte
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
