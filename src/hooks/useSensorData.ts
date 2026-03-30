import { useState, useEffect, useCallback } from 'react';
import { SensorData, generateCurrentData, generateHistoricalData } from '@/lib/mockData';

export function useSensorData(refreshInterval = 5000) {
  const [current, setCurrent] = useState<SensorData>(generateCurrentData());
  const [history, setHistory] = useState<SensorData[]>(() => generateHistoricalData(24));

  useEffect(() => {
    const interval = setInterval(() => {
      const newData = generateCurrentData();
      setCurrent(newData);
      setHistory(prev => [...prev.slice(-150), newData]);
    }, refreshInterval);
    return () => clearInterval(interval);
  }, [refreshInterval]);

  const getFilteredHistory = useCallback((hours: number) => {
    const cutoff = Date.now() - hours * 3600000;
    return history.filter(d => d.timestamp.getTime() > cutoff);
  }, [history]);

  return { current, history, getFilteredHistory };
}
