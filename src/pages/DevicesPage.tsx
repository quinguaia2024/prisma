import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { mockDevices } from "@/lib/mockData";

export default function DevicesPage() {
  const online = mockDevices.filter(d => d.status === 'online').length;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold">Gestão de Dispositivos</h2>
        <p className="text-sm text-muted-foreground">{online}/{mockDevices.length} dispositivos online</p>
      </div>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Nome</TableHead>
                <TableHead>Tipo</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Última Comunicação</TableHead>
                <TableHead>Localização</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mockDevices.map(device => (
                <TableRow key={device.id}>
                  <TableCell className="font-mono text-xs">{device.id}</TableCell>
                  <TableCell className="font-medium text-sm">{device.name}</TableCell>
                  <TableCell className="text-sm">{device.type}</TableCell>
                  <TableCell>
                    <Badge variant={device.status === 'online' ? 'default' : 'secondary'} className="text-xs">
                      {device.status === 'online' ? '🟢 Online' : '🔴 Offline'}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-xs text-muted-foreground">{device.lastCommunication.toLocaleString('pt-BR')}</TableCell>
                  <TableCell className="text-sm">{device.location}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
