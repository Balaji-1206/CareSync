import { useEffect, useState } from 'react';
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer } from 'recharts';
import { generateECGData } from '@/data/mockData';
import { Activity } from 'lucide-react';

interface ECGChartProps {
  isLive?: boolean;
}

export function ECGChart({ isLive = true }: ECGChartProps) {
  const [data, setData] = useState(generateECGData(100));

  useEffect(() => {
    if (!isLive) return;

    const interval = setInterval(() => {
      setData(generateECGData(100));
    }, 3000);

    return () => clearInterval(interval);
  }, [isLive]);

  return (
    <div className="rounded-xl bg-card p-4 shadow-md">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="rounded-lg bg-vital-ecg/10 p-2">
            <Activity className="h-5 w-5 text-vital-ecg" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-foreground">ECG Monitor</h3>
            <p className="text-xs text-muted-foreground">Real-time electrocardiogram</p>
          </div>
        </div>
        {isLive && (
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-status-normal animate-pulse" />
            <span className="text-xs font-medium text-status-normal">LIVE</span>
          </div>
        )}
      </div>

      <div className="h-[200px] w-full bg-sidebar/5 rounded-lg p-2">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 5, right: 5, bottom: 5, left: 5 }}>
            <XAxis dataKey="time" hide />
            <YAxis domain={[-0.5, 1.5]} hide />
            <Line
              type="monotone"
              dataKey="value"
              stroke="hsl(145, 70%, 45%)"
              strokeWidth={2}
              dot={false}
              isAnimationActive={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="mt-3 flex items-center justify-between text-xs text-muted-foreground">
        <span>Lead II</span>
        <span>25mm/s | 10mm/mV</span>
      </div>
    </div>
  );
}
