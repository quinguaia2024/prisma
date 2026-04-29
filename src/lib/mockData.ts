export interface SensorData {
  timestamp: Date;
  soilMoisture: number;
  temperature: number;
  waterLevel: number;
  airQuality: number;
  flameDetected: number;
  ldrValue: number;
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
  value?: number | string;
  unit?: string;
}

// Empty default for when no data is available
export const emptySensorData: SensorData = {
  timestamp: new Date(),
  soilMoisture: 0,
  temperature: 0,
  waterLevel: 0,
  airQuality: 0,
  flameDetected: 0,
  ldrValue: 0,
};

// Conversao do valor bruto (0-100) reportado pelo ESP32 para a
// percentagem real de qualidade do ar exibida na dashboard.
// Em condicoes normais o MQ-135 raramente passa de 6-8% no ambiente
// alvo, por isso aplicamos um factor de escala de 0.08.
export const AIR_QUALITY_DISPLAY_FACTOR = 0.08;
export function scaleAirQuality(raw: number): number {
  const v = Math.round((raw || 0) * AIR_QUALITY_DISPLAY_FACTOR * 10) / 10;
  return Math.min(100, Math.max(0, v));
}

// Boia digital invertida no hardware: o sinal recebido como 1
// corresponde a reservatorio VAZIO e 0 a CHEIO. Esta funcao devolve
// 1 = cheio, 0 = vazio para uso uniforme na dashboard.
export function isReservoirFull(rawWaterLevel: number): boolean {
  return rawWaterLevel === 0;
}

// Generate device list based on current sensor data and connection status
export function generateDevices(sensorData: SensorData, isConnected: boolean, lastReceived: Date | null): Device[] {
  const lastComm = lastReceived || new Date(0);
  
  return [
    {
      id: 'ESP32-001',
      name: 'ESP32 - Processador Principal',
      status: isConnected ? 'online' : 'offline',
      lastCommunication: lastComm,
      location: 'Central de Controle',
      type: 'Processador',
      value: isConnected ? 'Ativo' : 'Inativo',
    },
    {
      id: 'SNS-HUM-001',
      name: 'Sensor de Humidade do Solo',
      status: isConnected && sensorData.soilMoisture > 0 ? 'online' : 'offline',
      lastCommunication: lastComm,
      location: 'Setor A - Lote 1',
      type: 'Humidade',
      value: isConnected ? sensorData.soilMoisture : 'Sem dados',
      unit: isConnected && sensorData.soilMoisture > 0 ? '%' : undefined,
    },
    {
      id: 'SNS-NIV-001',
      name: 'Boia de Nível de Água',
      status: isConnected ? 'online' : 'offline',
      lastCommunication: lastComm,
      location: 'Reservatório Principal',
      type: 'Nível',
      value: isConnected ? (isReservoirFull(sensorData.waterLevel) ? 'Cheio' : 'Vazio') : 'Sem dados',
      unit: undefined,
    },
    {
      id: 'SNS-TMP-001',
      name: 'Sensor de Temperatura',
      status: isConnected && sensorData.temperature > 0 ? 'online' : 'offline',
      lastCommunication: lastComm,
      location: 'Setor A - Lote 1',
      type: 'Temperatura',
      value: isConnected ? sensorData.temperature : 'Sem dados',
      unit: isConnected && sensorData.temperature > 0 ? '°C' : undefined,
    },
    {
      id: 'SNS-FLM-001',
      name: 'Sensor de Chamas',
      status: isConnected ? 'online' : 'offline',
      lastCommunication: lastComm,
      location: 'Setor C - Perímetro',
      type: 'Segurança',
      value: isConnected ? (sensorData.flameDetected > 0 ? 'Detectado' : 'Sem detecção') : 'Sem dados',
      unit: undefined,
    },
    {
      id: 'SNS-AIR-001',
      name: 'Sensor de Qualidade do Ar',
      status: isConnected ? 'online' : 'offline',
      lastCommunication: lastComm,
      location: 'Setor B - Estufa',
      type: 'Qualidade do Ar',
      value: isConnected ? scaleAirQuality(sensorData.airQuality) : 'Sem dados',
      unit: isConnected ? '%' : undefined,
    },
    {
      id: 'SNS-LDR-001',
      name: 'Sensor LDR - Luminosidade',
      status: isConnected && sensorData.ldrValue > 0 ? 'online' : 'offline',
      lastCommunication: lastComm,
      location: 'Área Externa',
      type: 'Luminosidade',
      value: isConnected ? sensorData.ldrValue : 'Sem dados',
      unit: isConnected && sensorData.ldrValue > 0 ? 'lux' : undefined,
    },
  ];
}

export function getStatusColor(value: number, type: 'moisture' | 'temperature' | 'water' | 'air'): 'good' | 'warning' | 'danger' {
  switch (type) {
    case 'moisture':
      // Sincronizado com Arduino: bomba liga abaixo de 28% (danger),
      // zona de atencao 28-40%, normal acima de 40%.
      return value > 40 ? 'good' : value >= 28 ? 'warning' : 'danger';
    case 'temperature':
      return value < 30 ? 'good' : value < 38 ? 'warning' : 'danger';
    case 'water':
      // Boia digital invertida no hardware: 0 = cheio (good), 1 = vazio (danger)
      return isReservoirFull(value) ? 'good' : 'danger';
    case 'air':
      // Air quality as percentage (0-100)
      return value < 40 ? 'good' : value < 70 ? 'warning' : 'danger';
  }
}

export function getAirQualityLabel(value: number): string {
  if (value < 40) return 'Normal';
  if (value < 70) return 'Atenção';
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

// Generate alerts from current sensor data thresholds
export function generateAlertsFromData(data: SensorData): Alert[] {
  const alerts: Alert[] = [];
  const now = data.timestamp;

  if (data.flameDetected > 0) {
    alerts.push({ id: `flame-${now.getTime()}`, type: 'fire', severity: 'critical', message: 'Chamas detectadas pelo sensor', timestamp: now, resolved: false });
  }
  if (data.temperature >= 40) {
    alerts.push({ id: `temp-${now.getTime()}`, type: 'temperature', severity: 'critical', message: `Temperatura crítica: ${data.temperature}°C`, timestamp: now, resolved: false });
  }
  if (data.temperature >= 35 && data.temperature < 40) {
    alerts.push({ id: `temp-warn-${now.getTime()}`, type: 'temperature', severity: 'medium', message: `Temperatura elevada: ${data.temperature}°C`, timestamp: now, resolved: false });
  }
  if (!isReservoirFull(data.waterLevel)) {
    alerts.push({ id: `water-${now.getTime()}`, type: 'water', severity: 'critical', message: 'Reservatório vazio — boia indica nível crítico', timestamp: now, resolved: false });
  }
  const airDisplay = scaleAirQuality(data.airQuality);
  if (airDisplay >= 70) {
    alerts.push({ id: `air-${now.getTime()}`, type: 'air', severity: 'high', message: `Qualidade do ar perigosa: ${airDisplay}%`, timestamp: now, resolved: false });
  } else if (airDisplay >= 40) {
    alerts.push({ id: `air-warn-${now.getTime()}`, type: 'air', severity: 'medium', message: `Qualidade do ar em atenção: ${airDisplay}%`, timestamp: now, resolved: false });
  }

  return alerts;
}
