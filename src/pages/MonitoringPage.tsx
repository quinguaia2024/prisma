import { useSensorData } from "@/hooks/useSensorData";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { useState } from "react";

const periods = [
  { label: "1h", hours: 1 },
  { label: "6h", hours: 6 },
  { label: "24h", hours: 24 },
  { label: "7d", hours: 168 },
];

export default function MonitoringPage() {
  const { getFilteredHistory } = useSensorData();
  const [selectedPeriod, setSelectedPeriod] = useState(6);

  const data = getFilteredHistory(selectedPeriod).map(d => ({
    time: d.timestamp.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
    umidade: d.soilMoisture,
    temperatura: d.temperature,
    agua: d.waterLevel,
    ar: d.airQuality,
  }));

  const charts = [
    { key: 'umidade', label: 'Umidade do Solo (%)', color: 'hsl(var(--chart-1))' },
    { key: 'temperatura', label: 'Temperatura (°C)', color: 'hsl(var(--chart-3))' },
    { key: 'agua', label: 'Nível de Água (%)', color: 'hsl(var(--chart-2))' },
    { key: 'ar', label: 'Qualidade do Ar (AQI)', color: 'hsl(var(--chart-4))' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-2">
        <div>
          <h2 className="text-xl font-bold">Monitoramento em Tempo Real</h2>
          <p className="text-sm text-muted-foreground">Dados históricos dos sensores</p>
        </div>
        <div className="flex gap-1">
          {periods.map(p => (
            <Button key={p.hours} variant={selectedPeriod === p.hours ? "default" : "outline"} size="sm" onClick={() => setSelectedPeriod(p.hours)}>
              {p.label}
            </Button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {charts.map(chart => (
          <Card key={chart.key}>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">{chart.label}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-56">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={data}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis dataKey="time" tick={{ fontSize: 10 }} stroke="hsl(var(--muted-foreground))" />
                    <YAxis tick={{ fontSize: 10 }} stroke="hsl(var(--muted-foreground))" />
                    <Tooltip contentStyle={{ background: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: '8px', fontSize: '12px' }} />
                    <Line type="monotone" dataKey={chart.key} stroke={chart.color} strokeWidth={2} dot={false} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
