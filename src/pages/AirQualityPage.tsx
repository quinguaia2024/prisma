import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useSensorData } from "@/hooks/useSensorData";
import { getAirQualityLabel, getStatusColor } from "@/lib/mockData";
import { GaugeChart } from "@/components/GaugeChart";
import { Wind } from "lucide-react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

export default function AirQualityPage() {
  const { current, getFilteredHistory } = useSensorData();
  const aqi = current.airQuality;
  const label = getAirQualityLabel(aqi);
  const status = getStatusColor(aqi, 'air');
  const colorMap = { good: 'text-success', warning: 'text-warning', danger: 'text-destructive' };
  const bgMap = { good: 'bg-success/10', warning: 'bg-warning/10', danger: 'bg-destructive/10' };

  const data = getFilteredHistory(12).map(d => ({
    time: d.timestamp.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
    aqi: d.airQuality,
  }));

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold">Qualidade do Ar & Segurança</h2>
        <p className="text-sm text-muted-foreground">Monitoramento ambiental</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Índice Atual</CardTitle>
          </CardHeader>
          <CardContent className="text-center space-y-4">
            <div className="flex justify-center">
              <GaugeChart value={aqi} max={200} label="Qualidade do Ar" unit="AQI" thresholds={{ good: 25, warning: 50 }} />
            </div>
            <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full ${bgMap[status]} ${colorMap[status]} font-medium text-sm`}>
              <Wind className="w-4 h-4" /> {label}
            </div>
            <div className="grid grid-cols-3 gap-2 text-xs text-center">
              <div className="p-2 rounded bg-success/10 text-success">0-50<br/>Normal</div>
              <div className="p-2 rounded bg-warning/10 text-warning">50-100<br/>Atenção</div>
              <div className="p-2 rounded bg-destructive/10 text-destructive">100+<br/>Perigo</div>
            </div>
          </CardContent>
        </Card>

        <Card className="md:col-span-2">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Histórico AQI (12h)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={data}>
                  <defs>
                    <linearGradient id="aqiGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="hsl(var(--chart-4))" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="hsl(var(--chart-4))" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="time" tick={{ fontSize: 10 }} stroke="hsl(var(--muted-foreground))" />
                  <YAxis tick={{ fontSize: 10 }} stroke="hsl(var(--muted-foreground))" />
                  <Tooltip contentStyle={{ background: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: '8px', fontSize: '12px' }} />
                  <Area type="monotone" dataKey="aqi" stroke="hsl(var(--chart-4))" fill="url(#aqiGradient)" strokeWidth={2} name="AQI" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
