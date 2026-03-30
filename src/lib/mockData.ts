export interface SensorData {
  timestamp: Date;
  soilMoisture: number;
  temperature: number;
  waterLevel: number;
  airQuality: number;
}

export interface Alert {
  id: string;
  type: 'fire' | 'water' | 'temperature' | 'air';
  severity: 'low' | 'medium' | 'high' | 'critical';
  message: string;
  timestamp: Date;
  resolved: boolean;
}

export interface Device {
  id: string;
  name: string;
  status: 'online' | 'offline';
  lastCommunication: Date;
  location: string;
  type: string;
}

const rand = (min: number, max: number) => Math.round((Math.random() * (max - min) + min) * 10) / 10;

export function generateCurrentData(): SensorData {
  return {
    timestamp: new Date(),
    soilMoisture: rand(30, 85),
    temperature: rand(18, 42),
    waterLevel: rand(15, 95),
    airQuality: rand(20, 180),
  };
}

export function generateHistoricalData(hours: number): SensorData[] {
  const data: SensorData[] = [];
  const now = Date.now();
  for (let i = hours * 6; i >= 0; i--) {
    data.push({
      timestamp: new Date(now - i * 10 * 60 * 1000),
      soilMoisture: rand(35, 80),
      temperature: rand(20, 38),
      waterLevel: rand(20, 90),
      airQuality: rand(30, 150),
    });
  }
  return data;
}

export const mockAlerts: Alert[] = [
  { id: '1', type: 'temperature', severity: 'high', message: 'Temperatura acima de 38°C no Setor A', timestamp: new Date(Date.now() - 300000), resolved: false },
  { id: '2', type: 'water', severity: 'critical', message: 'Nível de água do reservatório abaixo de 20%', timestamp: new Date(Date.now() - 600000), resolved: false },
  { id: '3', type: 'air', severity: 'medium', message: 'Qualidade do ar em nível de atenção', timestamp: new Date(Date.now() - 1200000), resolved: false },
  { id: '4', type: 'fire', severity: 'critical', message: 'Sensor de fumaça ativado no Setor C', timestamp: new Date(Date.now() - 1800000), resolved: true },
  { id: '5', type: 'water', severity: 'low', message: 'Irrigação do Setor B concluída', timestamp: new Date(Date.now() - 3600000), resolved: true },
  { id: '6', type: 'temperature', severity: 'medium', message: 'Temperatura subindo rapidamente no Setor D', timestamp: new Date(Date.now() - 7200000), resolved: true },
];

export const mockDevices: Device[] = [
  { id: 'SNS-001', name: 'Sensor Umidade Solo A1', status: 'online', lastCommunication: new Date(), location: 'Setor A - Lote 1', type: 'Umidade' },
  { id: 'SNS-002', name: 'Sensor Temperatura A1', status: 'online', lastCommunication: new Date(), location: 'Setor A - Lote 1', type: 'Temperatura' },
  { id: 'SNS-003', name: 'Sensor Nível Água R1', status: 'online', lastCommunication: new Date(Date.now() - 60000), location: 'Reservatório 1', type: 'Nível' },
  { id: 'SNS-004', name: 'Sensor Qualidade Ar B1', status: 'offline', lastCommunication: new Date(Date.now() - 3600000), location: 'Setor B - Lote 1', type: 'Ar' },
  { id: 'ACT-001', name: 'Válvula Irrigação A1', status: 'online', lastCommunication: new Date(), location: 'Setor A', type: 'Atuador' },
  { id: 'ACT-002', name: 'Válvula Irrigação B1', status: 'online', lastCommunication: new Date(Date.now() - 120000), location: 'Setor B', type: 'Atuador' },
  { id: 'SNS-005', name: 'Sensor Fumaça C1', status: 'offline', lastCommunication: new Date(Date.now() - 7200000), location: 'Setor C', type: 'Segurança' },
  { id: 'GW-001', name: 'Gateway Principal', status: 'online', lastCommunication: new Date(), location: 'Central', type: 'Gateway' },
];

export function getStatusColor(value: number, type: 'moisture' | 'temperature' | 'water' | 'air'): 'good' | 'warning' | 'danger' {
  switch (type) {
    case 'moisture':
      return value > 60 ? 'good' : value > 35 ? 'warning' : 'danger';
    case 'temperature':
      return value < 30 ? 'good' : value < 38 ? 'warning' : 'danger';
    case 'water':
      return value > 50 ? 'good' : value > 25 ? 'warning' : 'danger';
    case 'air':
      return value < 50 ? 'good' : value < 100 ? 'warning' : 'danger';
  }
}

export function getAirQualityLabel(value: number): string {
  if (value < 50) return 'Normal';
  if (value < 100) return 'Atenção';
  return 'Perigo';
}

export function getSeverityColor(severity: string) {
  switch (severity) {
    case 'critical': return 'destructive';
    case 'high': return 'destructive';
    case 'medium': return 'warning';
    default: return 'secondary';
  }
}
