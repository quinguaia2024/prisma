import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import { generateHistoricalData } from "@/lib/mockData";
import { useState } from "react";
import { toast } from "sonner";

const allData = generateHistoricalData(168);

export default function HistoryPage() {
  const [period, setPeriod] = useState(24);
  const cutoff = Date.now() - period * 3600000;
  const filtered = allData.filter(d => d.timestamp.getTime() > cutoff);
  const displayed = filtered.filter((_, i) => i % Math.max(1, Math.floor(filtered.length / 50)) === 0);

  const exportCSV = () => {
    const header = 'Data/Hora,Umidade Solo (%),Temperatura (°C),Nível Água (%),Qualidade Ar (AQI)\n';
    const rows = filtered.map(d =>
      `${d.timestamp.toLocaleString('pt-BR')},${d.soilMoisture},${d.temperature},${d.waterLevel},${d.airQuality}`
    ).join('\n');
    const blob = new Blob([header + rows], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `sensores_${period}h.csv`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success('Arquivo CSV exportado!');
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-2">
        <div>
          <h2 className="text-xl font-bold">Histórico de Dados</h2>
          <p className="text-sm text-muted-foreground">{filtered.length} registros</p>
        </div>
        <div className="flex gap-2">
          <div className="flex gap-1">
            {[{ l: '24h', h: 24 }, { l: '3d', h: 72 }, { l: '7d', h: 168 }].map(p => (
              <Button key={p.h} variant={period === p.h ? "default" : "outline"} size="sm" onClick={() => setPeriod(p.h)}>
                {p.l}
              </Button>
            ))}
          </div>
          <Button variant="outline" size="sm" onClick={exportCSV}>
            <Download className="w-3 h-3 mr-1" /> Exportar CSV
          </Button>
        </div>
      </div>

      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Data/Hora</TableHead>
                  <TableHead>Umidade (%)</TableHead>
                  <TableHead>Temp (°C)</TableHead>
                  <TableHead>Água (%)</TableHead>
                  <TableHead>Ar (AQI)</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {displayed.map((d, i) => (
                  <TableRow key={i}>
                    <TableCell className="text-xs">{d.timestamp.toLocaleString('pt-BR')}</TableCell>
                    <TableCell>{d.soilMoisture}</TableCell>
                    <TableCell>{d.temperature}</TableCell>
                    <TableCell>{d.waterLevel}</TableCell>
                    <TableCell>{d.airQuality}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
