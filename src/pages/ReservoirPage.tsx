import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useSensorData } from "@/hooks/useSensorData";
import { Progress } from "@/components/ui/progress";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

export default function ReservoirPage() {
  const { current, getFilteredHistory } = useSensorData();
  const level = current.waterLevel;
  const risk = level > 50 ? 'Baixo' : level > 25 ? 'Médio' : 'Alto';
  const riskColor = level > 50 ? 'text-success' : level > 25 ? 'text-warning' : 'text-destructive';

  const consumptionData = getFilteredHistory(24)
    .filter((_, i) => i % 6 === 0)
    .map(d => ({
      time: d.timestamp.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
      nivel: d.waterLevel,
    }));

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold">Monitoramento do Reservatório</h2>
        <p className="text-sm text-muted-foreground">Nível e consumo de água</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="md:col-span-1">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Nível Atual</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-center">
              <span className="text-5xl font-bold">{level}</span>
              <span className="text-xl text-muted-foreground">%</span>
            </div>
            <Progress value={level} className="h-4" />
            <div className="flex justify-between text-sm">
              <span>Risco:</span>
              <span className={`font-semibold ${riskColor}`}>{risk}</span>
            </div>
            <div className="grid grid-cols-3 gap-2 text-center text-xs">
              <div className="p-2 rounded bg-destructive/10 text-destructive">0-25%<br/>Alto</div>
              <div className="p-2 rounded bg-warning/10 text-warning">25-50%<br/>Médio</div>
              <div className="p-2 rounded bg-success/10 text-success">50-100%<br/>Baixo</div>
            </div>
          </CardContent>
        </Card>

        <Card className="md:col-span-2">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Histórico de Nível (24h)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={consumptionData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="time" tick={{ fontSize: 10 }} stroke="hsl(var(--muted-foreground))" />
                  <YAxis tick={{ fontSize: 10 }} stroke="hsl(var(--muted-foreground))" domain={[0, 100]} />
                  <Tooltip contentStyle={{ background: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: '8px', fontSize: '12px' }} />
                  <Bar dataKey="nivel" fill="hsl(var(--chart-2))" radius={[4, 4, 0, 0]} name="Nível %" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
