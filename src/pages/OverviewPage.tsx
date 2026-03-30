import { Droplets, Thermometer, Waves, Wind, Power, AlertTriangle } from "lucide-react";
import { StatCard } from "@/components/StatCard";
import { useSensorData } from "@/hooks/useSensorData";
import { getStatusColor, mockAlerts } from "@/lib/mockData";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { useState } from "react";

export default function OverviewPage() {
  const { current, getFilteredHistory } = useSensorData();
  const activeAlerts = mockAlerts.filter(a => !a.resolved);
  const [irrigationOn] = useState(true);
  const chartData = getFilteredHistory(6).map(d => ({
    time: d.timestamp.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
    umidade: d.soilMoisture,
    temperatura: d.temperature,
  }));

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold">Visão Geral</h2>
        <p className="text-sm text-muted-foreground">Monitoramento em tempo real da sua propriedade</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        <StatCard title="Umidade do Solo" value={current.soilMoisture} unit="%" icon={Droplets} status={getStatusColor(current.soilMoisture, 'moisture')} />
        <StatCard title="Temperatura" value={current.temperature} unit="°C" icon={Thermometer} status={getStatusColor(current.temperature, 'temperature')} />
        <StatCard title="Nível de Água" value={current.waterLevel} unit="%" icon={Waves} status={getStatusColor(current.waterLevel, 'water')} />
        <StatCard title="Qualidade do Ar" value={current.airQuality} unit="AQI" icon={Wind} status={getStatusColor(current.airQuality, 'air')} />
        <StatCard title="Irrigação" value={irrigationOn ? 'Ativo' : 'Inativo'} icon={Power} status={irrigationOn ? 'good' : 'warning'} />
        <StatCard title="Alertas Ativos" value={activeAlerts.length} icon={AlertTriangle} status={activeAlerts.length > 2 ? 'danger' : activeAlerts.length > 0 ? 'warning' : 'good'} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Umidade & Temperatura (6h)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="time" tick={{ fontSize: 10 }} stroke="hsl(var(--muted-foreground))" />
                  <YAxis tick={{ fontSize: 10 }} stroke="hsl(var(--muted-foreground))" />
                  <Tooltip contentStyle={{ background: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: '8px', fontSize: '12px' }} />
                  <Line type="monotone" dataKey="umidade" stroke="hsl(var(--chart-1))" strokeWidth={2} dot={false} name="Umidade %" />
                  <Line type="monotone" dataKey="temperatura" stroke="hsl(var(--chart-3))" strokeWidth={2} dot={false} name="Temp °C" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Alertas Recentes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {mockAlerts.slice(0, 5).map(alert => (
                <div key={alert.id} className={`flex items-start gap-3 p-2 rounded-lg text-sm ${alert.resolved ? 'opacity-50' : ''} ${alert.severity === 'critical' ? 'bg-destructive/5' : 'bg-muted/50'}`}>
                  <AlertTriangle className={`w-4 h-4 mt-0.5 flex-shrink-0 ${alert.severity === 'critical' ? 'text-destructive' : alert.severity === 'high' ? 'text-destructive' : 'text-warning'}`} />
                  <div className="min-w-0">
                    <p className="text-xs font-medium truncate">{alert.message}</p>
                    <p className="text-[10px] text-muted-foreground">
                      {alert.timestamp.toLocaleString('pt-BR')} {alert.resolved && '• Resolvido'}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
