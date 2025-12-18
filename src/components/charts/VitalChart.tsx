import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';
import { cn } from '@/lib/utils';

interface VitalChartProps {
  title: string;
  data: { time: string; value?: number; systolic?: number; diastolic?: number }[];
  dataKey?: string;
  color: string;
  unit: string;
  showBloodPressure?: boolean;
}

export function VitalChart({
  title,
  data,
  dataKey = 'value',
  color,
  unit,
  showBloodPressure = false,
}: VitalChartProps) {
  return (
    <div className="rounded-xl bg-card p-4 shadow-md">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-semibold text-foreground">{title}</h3>
        <span className="text-xs text-muted-foreground">{unit}</span>
      </div>

      <div className="h-[180px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 5, right: 10, bottom: 5, left: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
            <XAxis
              dataKey="time"
              tick={{ fontSize: 10, fill: 'hsl(var(--muted-foreground))' }}
              tickLine={false}
              axisLine={false}
            />
            <YAxis
              tick={{ fontSize: 10, fill: 'hsl(var(--muted-foreground))' }}
              tickLine={false}
              axisLine={false}
              width={35}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: 'hsl(var(--card))',
                border: '1px solid hsl(var(--border))',
                borderRadius: '8px',
                fontSize: '12px',
              }}
            />
            {showBloodPressure ? (
              <>
                <Line
                  type="monotone"
                  dataKey="systolic"
                  stroke="hsl(210, 100%, 50%)"
                  strokeWidth={2}
                  dot={false}
                  name="Systolic"
                />
                <Line
                  type="monotone"
                  dataKey="diastolic"
                  stroke="hsl(210, 100%, 70%)"
                  strokeWidth={2}
                  dot={false}
                  name="Diastolic"
                />
                <Legend
                  wrapperStyle={{ fontSize: '10px' }}
                  iconType="line"
                />
              </>
            ) : (
              <Line
                type="monotone"
                dataKey={dataKey}
                stroke={color}
                strokeWidth={2}
                dot={false}
              />
            )}
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
