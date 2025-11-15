import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "./ui/tabs";
import { TrendingUp, Users, FileText, Target, DollarSign, Clock, Trophy, BarChart3, Percent, CheckCircle2, Award, CalendarDays, Briefcase, PieChart, MapPin, Download, Filter } from "lucide-react";
import { BarChart, Bar, LineChart, Line, PieChart as RechartsPie, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";

interface DashboardProps {
  onNavigate: (view: string) => void;
}

export function Dashboard({ onNavigate }: DashboardProps) {
  
  // ============= DATA FOR VENDEDOR =============
  const vendedorFunnelData = [
    { name: "Contacto Inicial", value: 32, color: "#3b82f6" },
    { name: "Calificado", value: 24, color: "#10b981" },
    { name: "Cotización", value: 18, color: "#f59e0b" },
    { name: "Negociación", value: 12, color: "#8b5cf6" },
    { name: "Ganado", value: 8, color: "#22c55e" },
  ];

  const vendedorSalesData = [
    { month: "Ene", ventas: 12 },
    { month: "Feb", ventas: 15 },
    { month: "Mar", ventas: 11 },
    { month: "Abr", ventas: 18 },
    { month: "May", ventas: 16 },
    { month: "Jun", ventas: 22 },
  ];

  const vendedorProductosData = [
    { producto: "Panel Aislante", ventas: 45 },
    { producto: "Acero Estructural", ventas: 38 },
    { producto: "Lámina Galvanizada", ventas: 32 },
    { producto: "Perfil Metálico", ventas: 28 },
    { producto: "Cubierta Termo", ventas: 22 },
  ];

  const vendedorMetaProgress = [
    { name: "Logrado", value: 68, color: "#10b981" },
    { name: "Pendiente", value: 32, color: "#e5e7eb" },
  ];

  // ============= DATA FOR GERENTE =============
  const gerenteSalesData = [
    { month: "Ene", ventas: 245 },
    { month: "Feb", ventas: 298 },
    { month: "Mar", ventas: 267 },
    { month: "Abr", ventas: 312 },
    { month: "May", ventas: 289 },
    { month: "Jun", ventas: 345 },
  ];

  const gerenteFunnelData = [
    { name: "Prospectos", value: 145, color: "#3b82f6" },
    { name: "Cotizaciones", value: 89, color: "#10b981" },
    { name: "Negociación", value: 42, color: "#f59e0b" },
    { name: "Ganadas", value: 67, color: "#22c55e" },
  ];

  const gerenteVendedoresData = [
    { name: "María G.", ventas: 345 },
    { name: "Carlos R.", ventas: 298 },
    { name: "Ana M.", ventas: 276 },
    { name: "Luis T.", ventas: 234 },
    { name: "Sofia L.", ventas: 198 },
  ];

  const gerenteRegionData = [
    { region: "Norte", ventas: 245 },
    { region: "Centro", ventas: 198 },
    { region: "Sur", ventas: 167 },
    { region: "Occidente", ventas: 189 },
  ];

  // ============= DATA FOR ADMINISTRADOR =============
  const adminSalesData = [
    { month: "Ene", ventas: 1245 },
    { month: "Feb", ventas: 1398 },
    { month: "Mar", ventas: 1267 },
    { month: "Abr", ventas: 1512 },
    { month: "May", ventas: 1489 },
    { month: "Jun", ventas: 1645 },
  ];

  const adminRegionData = [
    { region: "Norte", ventas: 3245 },
    { region: "Centro", ventas: 2898 },
    { region: "Sur", ventas: 2167 },
    { region: "Occidente", ventas: 2689 },
  ];

  const adminMargenesData = [
    { producto: "Panel Aislante", margen: 28 },
    { producto: "Acero Estructural", margen: 22 },
    { producto: "Lámina Galv.", margen: 18 },
    { producto: "Cubierta Termo", margen: 25 },
  ];

  const adminCampanasData = [
    { campana: "Digital", roi: 245 },
    { campana: "Referidos", roi: 189 },
    { campana: "Ferias", roi: 156 },
    { campana: "Email", roi: 134 },
  ];

  // ============= REPORTES DISPONIBLES (COMÚN PARA TODOS) =============
  const reportesDisponibles = [
    {
      id: 1,
      titulo: "Ventas por Región",
      descripcion: "Análisis de ventas distribuidas por zona geográfica",
      icono: MapPin,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
    },
    {
      id: 2,
      titulo: "Productos más Vendidos",
      descripcion: "Top productos con mayor volumen de ventas",
      icono: Trophy,
      color: "text-green-600",
      bgColor: "bg-green-50",
    },
    {
      id: 3,
      titulo: "Análisis de Márgenes",
      descripcion: "Rentabilidad por producto y categoría",
      icono: PieChart,
      color: "text-purple-600",
      bgColor: "bg-purple-50",
    },
    {
      id: 4,
      titulo: "Conversión de Pipeline",
      descripcion: "Tasa de conversión en cada etapa del embudo",
      icono: Target,
      color: "text-orange-600",
      bgColor: "bg-orange-50",
    },
    {
      id: 5,
      titulo: "Tiempo de Cierre",
      descripcion: "Análisis de ciclo de venta promedio",
      icono: Clock,
      color: "text-indigo-600",
      bgColor: "bg-indigo-50",
    },
    {
      id: 6,
      titulo: "ROI de Campañas",
      descripcion: "Retorno de inversión por canal de marketing",
      icono: TrendingUp,
      color: "text-pink-600",
      bgColor: "bg-pink-50",
    },
  ];

  // ============= MÉTRICAS =============
  const vendedorMetrics = [
    {
      title: "Cotizaciones Activas",
      value: "18",
      icon: FileText,
      iconColor: "#4285F4",
      iconBg: "#E8F0FE",
    },
    {
      title: "Tasa de Conversión",
      value: "68%",
      icon: Percent,
      iconColor: "#10B981",
      iconBg: "#E9F8F2",
    },
    {
      title: "Ventas del Mes",
      value: "$247K",
      icon: DollarSign,
      iconColor: "#F59E0B",
      iconBg: "#FFF4E5",
    },
    {
      title: "Tiempo Promedio Cierre",
      value: "12 días",
      icon: Clock,
      iconColor: "#8B5CF6",
      iconBg: "#EDEAFF",
    },
    {
      title: "Prospectos Nuevos (7d)",
      value: "8",
      icon: Users,
      iconColor: "#1E88E5",
      iconBg: "#DCEAFE",
    },
    {
      title: "Clientes Activos",
      value: "32",
      icon: CheckCircle2,
      iconColor: "#22c55e",
      iconBg: "#dcfce7",
    },
    {
      title: "Avance de Meta",
      value: "68%",
      icon: Target,
      iconColor: "#F97316",
      iconBg: "#FFEFE3",
    },
  ];

  const gerenteMetrics = [
    {
      title: "Ventas del Equipo",
      value: "$1.8M",
      icon: DollarSign,
      iconColor: "#10B981",
      iconBg: "#E9F8F2",
    },
    {
      title: "Tasa Conversión Equipo",
      value: "64%",
      icon: Percent,
      iconColor: "#4285F4",
      iconBg: "#E8F0FE",
    },
    {
      title: "Cotizaciones Abiertas",
      value: "89",
      icon: FileText,
      iconColor: "#F59E0B",
      iconBg: "#FFF4E5",
    },
    {
      title: "Avance Meta Grupal",
      value: "72%",
      icon: Target,
      iconColor: "#F97316",
      iconBg: "#FFEFE3",
    },
    {
      title: "Nuevos Clientes",
      value: "24",
      icon: Users,
      iconColor: "#1E88E5",
      iconBg: "#DCEAFE",
    },
    {
      title: "Tiempo Cierre Promedio",
      value: "14 días",
      icon: Clock,
      iconColor: "#8B5CF6",
      iconBg: "#EDEAFF",
    },
    {
      title: "Top Vendedor",
      value: "María G.",
      icon: Trophy,
      iconColor: "#EAB308",
      iconBg: "#fef9c3",
    },
  ];

  const adminMetrics = [
    {
      title: "Ventas Totales (YTD)",
      value: "$8.2M",
      icon: DollarSign,
      iconColor: "#10B981",
      iconBg: "#E9F8F2",
    },
    {
      title: "Margen Promedio",
      value: "23%",
      icon: Percent,
      iconColor: "#F59E0B",
      iconBg: "#FFF4E5",
    },
    {
      title: "Clientes Activos",
      value: "248",
      icon: Users,
      iconColor: "#4285F4",
      iconBg: "#E8F0FE",
    },
    {
      title: "ROI Campañas",
      value: "182%",
      icon: TrendingUp,
      iconColor: "#22c55e",
      iconBg: "#dcfce7",
    },
    {
      title: "Pipeline Consolidado",
      value: "$3.4M",
      icon: Briefcase,
      iconColor: "#8B5CF6",
      iconBg: "#EDEAFF",
    },
    {
      title: "LTV Promedio",
      value: "$98K",
      icon: Award,
      iconColor: "#EAB308",
      iconBg: "#fef9c3",
    },
    {
      title: "Facturación Pendiente",
      value: "$456K",
      icon: CalendarDays,
      iconColor: "#F97316",
      iconBg: "#FFEFE3",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="mb-2">Dashboard Ejecutivo</h1>
        <p className="text-[#5A5A5A]">
          Vista general de operación comercial por rol
        </p>
      </div>

      {/* Tabs Navigation */}
      <Tabs defaultValue="vendedor" className="w-full">
        <TabsList className="grid w-full max-w-md grid-cols-3 mb-6">
          <TabsTrigger value="vendedor">Vendedor</TabsTrigger>
          <TabsTrigger value="gerente">Gerente</TabsTrigger>
          <TabsTrigger value="administrador">Administrador</TabsTrigger>
        </TabsList>

        {/* ============= TAB VENDEDOR ============= */}
        <TabsContent value="vendedor" className="space-y-6">
          <div>
            <h2 className="mb-1">Hola Roberto, aquí tu resumen de ventas.</h2>
            <p className="text-[#5A5A5A]">
              Vista personal de tu desempeño y oportunidades
            </p>
          </div>

          {/* Métricas */}
          <div className="grid grid-cols-1 md:grid-cols-7 gap-4">
            {vendedorMetrics.map((metric) => {
              const Icon = metric.icon;
              return (
                <Card key={metric.title} className="border-[#E0E0E0] hover:shadow-md transition-shadow cursor-pointer">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between gap-3">
                      <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ backgroundColor: metric.iconBg }}>
                        <Icon className="w-5 h-5" style={{ color: metric.iconColor }} />
                      </div>
                      <div className="text-right">
                        <p className="text-[28px] font-semibold text-[#242424]">{metric.value}</p>
                      </div>
                    </div>
                    <p className="text-sm text-[#5A5A5A] text-center mt-2">{metric.title}</p>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {/* Gráficas */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Funnel Personal */}
            <Card className="border-[#E0E0E0]">
              <CardHeader>
                <CardTitle>Mi Pipeline Personal</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <RechartsPie>
                    <Pie
                      data={vendedorFunnelData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, value }) => `${name}: ${value}`}
                      outerRadius={100}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {vendedorFunnelData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </RechartsPie>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Tendencia de Ventas */}
            <Card className="border-[#E0E0E0]">
              <CardHeader>
                <CardTitle>Tendencia de Mis Ventas</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={vendedorSalesData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line
                      type="monotone"
                      dataKey="ventas"
                      stroke="#10b981"
                      strokeWidth={3}
                      name="Ventas"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Productos Más Vendidos */}
            <Card className="border-[#E0E0E0]">
              <CardHeader>
                <CardTitle>Mis Productos Top (Unidades)</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={vendedorProductosData} layout="vertical">
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                    <XAxis type="number" />
                    <YAxis type="category" dataKey="producto" width={120} />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="ventas" fill="#3b82f6" name="Ventas" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Progreso de Meta */}
            <Card className="border-[#E0E0E0]">
              <CardHeader>
                <CardTitle>Progreso de Mi Meta Mensual</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <RechartsPie>
                    <Pie
                      data={vendedorMetaProgress}
                      cx="50%"
                      cy="50%"
                      innerRadius={80}
                      outerRadius={120}
                      fill="#8884d8"
                      dataKey="value"
                      startAngle={90}
                      endAngle={-270}
                    >
                      {vendedorMetaProgress.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </RechartsPie>
                </ResponsiveContainer>
                <div className="text-center mt-4">
                  <p className="text-[#5A5A5A]">Meta: $360K MXN</p>
                  <p className="text-[28px] font-semibold text-[#10b981]">68% Completado</p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Acciones Rápidas */}
          <Card className="border-[#E0E0E0]">
            <CardHeader>
              <CardTitle>Acciones Rápidas</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Button
                  onClick={() => onNavigate("cotizaciones")}
                  variant="outline"
                  className="h-auto p-6 justify-start border-2 hover:border-[#242424] hover:bg-[#F3F2EF]"
                >
                  <FileText className="w-6 h-6 mr-3 text-[#242424]" />
                  <div className="text-left">
                    <p className="font-semibold">Nueva Cotización</p>
                    <p className="text-sm text-[#5A5A5A] font-normal">Crear cotización para un cliente</p>
                  </div>
                </Button>
                <Button
                  onClick={() => onNavigate("pipeline")}
                  variant="outline"
                  className="h-auto p-6 justify-start border-2 hover:border-[#242424] hover:bg-[#F3F2EF]"
                >
                  <BarChart3 className="w-6 h-6 mr-3 text-[#242424]" />
                  <div className="text-left">
                    <p className="font-semibold">Ver Mi Pipeline</p>
                    <p className="text-sm text-[#5A5A5A] font-normal">Gestionar mis oportunidades</p>
                  </div>
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Reportes Disponibles */}
          <Card className="border-[#E0E0E0]">
            <CardHeader>
              <CardTitle>Reportes Disponibles</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {reportesDisponibles.map((reporte) => {
                  const Icon = reporte.icono;
                  return (
                    <div
                      key={reporte.id}
                      className="p-4 border border-[#E0E0E0] rounded-lg hover:shadow-md transition-all cursor-pointer"
                    >
                      <div className="flex items-start gap-3 mb-3">
                        <div className={`${reporte.bgColor} ${reporte.color} p-2 rounded-lg`}>
                          <Icon className="w-5 h-5" />
                        </div>
                        <div className="flex-1">
                          <h4 className="font-semibold mb-1">{reporte.titulo}</h4>
                          <p className="text-sm text-[#5A5A5A]">{reporte.descripcion}</p>
                        </div>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        className="w-full underline"
                        onClick={() => onNavigate("reportes")}
                      >
                        Generar Reporte
                      </Button>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* ============= TAB GERENTE ============= */}
        <TabsContent value="gerente" className="space-y-6">
          <div>
            <h2 className="mb-1">Panel de Gestión de Equipo</h2>
            <p className="text-[#5A5A5A]">
              Supervisión del desempeño y métricas del equipo comercial
            </p>
          </div>

          {/* Métricas */}
          <div className="grid grid-cols-1 md:grid-cols-7 gap-4">
            {gerenteMetrics.map((metric) => {
              const Icon = metric.icon;
              return (
                <Card key={metric.title} className="border-[#E0E0E0] hover:shadow-md transition-shadow cursor-pointer">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between gap-3">
                      <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ backgroundColor: metric.iconBg }}>
                        <Icon className="w-5 h-5" style={{ color: metric.iconColor }} />
                      </div>
                      <div className="text-right">
                        <p className="text-[28px] font-semibold text-[#242424]">{metric.value}</p>
                      </div>
                    </div>
                    <p className="text-sm text-[#5A5A5A] text-center mt-2">{metric.title}</p>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {/* Gráficas */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Comparativo Vendedores */}
            <Card className="border-[#E0E0E0]">
              <CardHeader>
                <CardTitle>Desempeño por Vendedor (Miles MXN)</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={gerenteVendedoresData} layout="vertical">
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                    <XAxis type="number" />
                    <YAxis type="category" dataKey="name" width={80} />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="ventas" fill="#10b981" name="Ventas ($k)" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Pipeline Consolidado */}
            <Card className="border-[#E0E0E0]">
              <CardHeader>
                <CardTitle>Pipeline Consolidado del Equipo</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <RechartsPie>
                    <Pie
                      data={gerenteFunnelData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, value }) => `${name}: ${value}`}
                      outerRadius={100}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {gerenteFunnelData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </RechartsPie>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Tendencia de Ventas del Equipo */}
            <Card className="border-[#E0E0E0]">
              <CardHeader>
                <CardTitle>Tendencia de Ventas del Equipo (Miles MXN)</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={gerenteSalesData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line
                      type="monotone"
                      dataKey="ventas"
                      stroke="#3b82f6"
                      strokeWidth={3}
                      name="Ventas ($k)"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Ventas por Región */}
            <Card className="border-[#E0E0E0]">
              <CardHeader>
                <CardTitle>Ventas por Región (Miles MXN)</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={gerenteRegionData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                    <XAxis dataKey="region" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="ventas" fill="#8b5cf6" name="Ventas ($k)" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          {/* Acciones Rápidas */}
          <Card className="border-[#E0E0E0]">
            <CardHeader>
              <CardTitle>Acciones Rápidas</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Button
                  onClick={() => onNavigate("reportes")}
                  variant="outline"
                  className="h-auto p-6 justify-start border-2 hover:border-[#242424] hover:bg-[#F3F2EF]"
                >
                  <Users className="w-6 h-6 mr-3 text-[#242424]" />
                  <div className="text-left">
                    <p className="font-semibold">Ver Detalle por Vendedor</p>
                    <p className="text-sm text-[#5A5A5A] font-normal">Análisis individual de desempeño</p>
                  </div>
                </Button>
                <Button
                  onClick={() => onNavigate("reportes")}
                  variant="outline"
                  className="h-auto p-6 justify-start border-2 hover:border-[#242424] hover:bg-[#F3F2EF]"
                >
                  <Download className="w-6 h-6 mr-3 text-[#242424]" />
                  <div className="text-left">
                    <p className="font-semibold">Descargar Reporte Semanal</p>
                    <p className="text-sm text-[#5A5A5A] font-normal">Exportar métricas del equipo</p>
                  </div>
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Reportes Disponibles */}
          <Card className="border-[#E0E0E0]">
            <CardHeader>
              <CardTitle>Reportes Disponibles</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {reportesDisponibles.map((reporte) => {
                  const Icon = reporte.icono;
                  return (
                    <div
                      key={reporte.id}
                      className="p-4 border border-[#E0E0E0] rounded-lg hover:shadow-md transition-all cursor-pointer"
                    >
                      <div className="flex items-start gap-3 mb-3">
                        <div className={`${reporte.bgColor} ${reporte.color} p-2 rounded-lg`}>
                          <Icon className="w-5 h-5" />
                        </div>
                        <div className="flex-1">
                          <h4 className="font-semibold mb-1">{reporte.titulo}</h4>
                          <p className="text-sm text-[#5A5A5A]">{reporte.descripcion}</p>
                        </div>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        className="w-full underline"
                        onClick={() => onNavigate("reportes")}
                      >
                        Generar Reporte
                      </Button>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* ============= TAB ADMINISTRADOR ============= */}
        <TabsContent value="administrador" className="space-y-6">
          <div>
            <h2 className="mb-1">Panel Ejecutivo Global</h2>
            <p className="text-[#5A5A5A]">
              Visión estratégica del negocio y rendimiento financiero
            </p>
          </div>

          {/* Métricas */}
          <div className="grid grid-cols-1 md:grid-cols-7 gap-4">
            {adminMetrics.map((metric) => {
              const Icon = metric.icon;
              return (
                <Card key={metric.title} className="border-[#E0E0E0] hover:shadow-md transition-shadow cursor-pointer">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between gap-3">
                      <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ backgroundColor: metric.iconBg }}>
                        <Icon className="w-5 h-5" style={{ color: metric.iconColor }} />
                      </div>
                      <div className="text-right">
                        <p className="text-[28px] font-semibold text-[#242424]">{metric.value}</p>
                      </div>
                    </div>
                    <p className="text-sm text-[#5A5A5A] text-center mt-2">{metric.title}</p>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {/* Gráficas */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Ventas por Región */}
            <Card className="border-[#E0E0E0]">
              <CardHeader>
                <CardTitle>Ventas por Región (Miles MXN)</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={adminRegionData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                    <XAxis dataKey="region" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="ventas" fill="#3b82f6" name="Ventas ($k)" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Análisis de Márgenes */}
            <Card className="border-[#E0E0E0]">
              <CardHeader>
                <CardTitle>Márgenes por Producto (%)</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={adminMargenesData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                    <XAxis dataKey="producto" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="margen" fill="#f59e0b" name="Margen %" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Tendencia Global */}
            <Card className="border-[#E0E0E0]">
              <CardHeader>
                <CardTitle>Tendencia Global de Ventas (Miles MXN)</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={adminSalesData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line
                      type="monotone"
                      dataKey="ventas"
                      stroke="#10b981"
                      strokeWidth={3}
                      name="Ventas ($k)"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* ROI de Campañas */}
            <Card className="border-[#E0E0E0]">
              <CardHeader>
                <CardTitle>ROI por Canal de Marketing (%)</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={adminCampanasData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                    <XAxis dataKey="campana" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="roi" fill="#8b5cf6" name="ROI %" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          {/* Acciones Rápidas */}
          <Card className="border-[#E0E0E0]">
            <CardHeader>
              <CardTitle>Acciones Rápidas</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Button
                  onClick={() => onNavigate("reportes")}
                  variant="outline"
                  className="h-auto p-6 justify-start border-2 hover:border-[#242424] hover:bg-[#F3F2EF]"
                >
                  <Download className="w-6 h-6 mr-3 text-[#242424]" />
                  <div className="text-left">
                    <p className="font-semibold">Exportar Reporte Ejecutivo</p>
                    <p className="text-sm text-[#5A5A5A] font-normal">Descargar análisis completo</p>
                  </div>
                </Button>
                <Button
                  onClick={() => onNavigate("reportes")}
                  variant="outline"
                  className="h-auto p-6 justify-start border-2 hover:border-[#242424] hover:bg-[#F3F2EF]"
                >
                  <Filter className="w-6 h-6 mr-3 text-[#242424]" />
                  <div className="text-left">
                    <p className="font-semibold">Filtrar por Empresa/Región</p>
                    <p className="text-sm text-[#5A5A5A] font-normal">Segmentar análisis</p>
                  </div>
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Reportes Disponibles */}
          <Card className="border-[#E0E0E0]">
            <CardHeader>
              <CardTitle>Reportes Disponibles</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {reportesDisponibles.map((reporte) => {
                  const Icon = reporte.icono;
                  return (
                    <div
                      key={reporte.id}
                      className="p-4 border border-[#E0E0E0] rounded-lg hover:shadow-md transition-all cursor-pointer"
                    >
                      <div className="flex items-start gap-3 mb-3">
                        <div className={`${reporte.bgColor} ${reporte.color} p-2 rounded-lg`}>
                          <Icon className="w-5 h-5" />
                        </div>
                        <div className="flex-1">
                          <h4 className="font-semibold mb-1">{reporte.titulo}</h4>
                          <p className="text-sm text-[#5A5A5A]">{reporte.descripcion}</p>
                        </div>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        className="w-full underline"
                        onClick={() => onNavigate("reportes")}
                      >
                        Generar Reporte
                      </Button>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
