import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useState } from "react";
import { toast } from "sonner";

export default function SettingsPage() {
  const [moistureMin, setMoistureMin] = useState([35]);
  const [moistureMax, setMoistureMax] = useState([80]);
  const [tempMax, setTempMax] = useState([40]);
  const [waterMin, setWaterMin] = useState([20]);
  const [readingInterval, setReadingInterval] = useState('5');

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold">Configurações</h2>
        <p className="text-sm text-muted-foreground">Ajustes do sistema de monitoramento</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Limites dos Sensores</CardTitle>
          </CardHeader>
          <CardContent className="space-y-5">
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span>Umidade mín. alerta</span>
                <span className="font-medium">{moistureMin[0]}%</span>
              </div>
              <Slider value={moistureMin} onValueChange={setMoistureMin} min={10} max={60} step={5} />
            </div>
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span>Umidade máx. ideal</span>
                <span className="font-medium">{moistureMax[0]}%</span>
              </div>
              <Slider value={moistureMax} onValueChange={setMoistureMax} min={50} max={95} step={5} />
            </div>
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span>Temp. máx. alerta</span>
                <span className="font-medium">{tempMax[0]}°C</span>
              </div>
              <Slider value={tempMax} onValueChange={setTempMax} min={25} max={50} step={1} />
            </div>
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span>Nível água mín. alerta</span>
                <span className="font-medium">{waterMin[0]}%</span>
              </div>
              <Slider value={waterMin} onValueChange={setWaterMin} min={5} max={40} step={5} />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Configuração de Leitura</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label className="text-sm">Intervalo de leitura</Label>
              <Select value={readingInterval} onValueChange={setReadingInterval}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">1 minuto</SelectItem>
                  <SelectItem value="5">5 minutos</SelectItem>
                  <SelectItem value="10">10 minutos</SelectItem>
                  <SelectItem value="30">30 minutos</SelectItem>
                  <SelectItem value="60">1 hora</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label className="text-sm">IP do Gateway</Label>
              <Input defaultValue="192.168.1.100" />
            </div>
            <div className="space-y-2">
              <Label className="text-sm">Porta MQTT</Label>
              <Input defaultValue="1883" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Button onClick={() => toast.success('Configurações salvas com sucesso!')}>
        Salvar Todas as Configurações
      </Button>
    </div>
  );
}
