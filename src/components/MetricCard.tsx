interface MetricCardProps {
  name: string;
  value: number | string;
  unit?: string;
}

/**
 * MetricCard - Displays a single hydrological signature metric
 * 
 * Formats metric name and value with optional unit display.
 * Numeric values are formatted to 2 decimal places.
 * 
 * @example
 * ```tsx
 * <MetricCard name="mean_q" value={2.5} unit="m³/s" />
 * ```
 */
export default function MetricCard({ name, value, unit }: MetricCardProps) {
  return (
    <div className="flex-[1_1_120px] bg-brazflow-panel p-3 rounded-lg">
      <div className="text-xs text-[#bbb]">{name.replace(/_/g, ' ').toUpperCase()}</div>
      <div className="text-xl font-bold">
        {typeof value === 'number' ? value.toFixed(2) : String(value)}
        {unit && <span className="text-xs text-[#bbb] ml-1">{unit}</span>}
      </div>
    </div>
  );
}
