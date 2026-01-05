import { useState, useMemo } from 'react'
import { ComposedChart, Line, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend, CartesianGrid, Label } from 'recharts'

interface TimeSeriesData {
  timestamp: string
  runoff: number
  precipitation: number
}

export default function TimeSeriesChart({ data }: { data: Array<TimeSeriesData> }) {
  const [selectedYear, setSelectedYear] = useState<string>('2024') // Default to 2024

  const years = useMemo(() => {
    if (!data) return ['All']
    const yearSet = new Set(data.map(d => new Date(d.timestamp).getFullYear().toString()))
    return ['All', ...Array.from(yearSet)]
  }, [data])

  const filteredData = useMemo(() => {
    const dataToFilter = selectedYear === 'All' ? data : data.filter(d => new Date(d.timestamp).getFullYear().toString() === selectedYear);

    // If 2024 is selected but no data for 2024, fallback to 'All' or first available year
    if (selectedYear === '2024' && dataToFilter.length === 0 && data.length > 0) {
      const firstAvailableYear = new Date(data[0].timestamp).getFullYear().toString();
      setSelectedYear(firstAvailableYear); // Update state to first available year
      return data.filter(d => new Date(d.timestamp).getFullYear().toString() === firstAvailableYear);
    }
    
    return dataToFilter;
  }, [data, selectedYear]);

  const maxPrecipitation = useMemo(() => {
    if (!filteredData || filteredData.length === 0) return 0
    return Math.max(...filteredData.map(d => d.precipitation))
  }, [filteredData])

  // Custom formatter for tooltip label (timestamp)
  const formatTooltipLabel = (label: string) => {
    return label.split('T')[0]; // Split by 'T' and take the first part (date only)
  };

  // Custom formatter for tooltip values (runoff, precipitation)
  const formatTooltipValue = (value: number) => {
    return value.toFixed(2); // Format to two decimal places
  };

  // Custom formatter for Y-axis ticks (precipitation)
  const formatYAxisTick = (value: number) => {
    return value.toFixed(2); // Format to two decimal places
  };

  if (!data || data.length === 0) return <div>No data</div>

  return (
    <div className="card">
      <div style={{ marginBottom: 12, display: 'flex', alignItems: 'center', gap: 12 }}>
        <h3 style={{ margin: 0 }}>Streamflow and Precipitation</h3>
        <select value={selectedYear} onChange={e => setSelectedYear(e.target.value)} style={{ padding: '4px 8px' }}>
          {years.map(year => (
            <option key={year} value={year}>{year}</option>
          ))}
        </select>
      </div>
      <ResponsiveContainer width="100%" height={400}>
        <ComposedChart data={filteredData} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="timestamp" tickFormatter={(tickItem) => new Date(tickItem).toLocaleString('default', { month: 'short' })}>
            <Label value="Date" offset={-10} position="insideBottom" />
          </XAxis>
          <YAxis yAxisId="left">
            <Label value="Runoff (m³/s)" angle={-90} position="insideLeft" style={{ textAnchor: 'middle' }} />
          </YAxis>
          <YAxis yAxisId="right" orientation="right" reversed domain={[0, maxPrecipitation > 0 ? maxPrecipitation + 20: 100]} tickFormatter={formatYAxisTick}>
            <Label value="Precipitation (mm)" angle={90} position="insideRight" style={{ textAnchor: 'middle' }} />
          </YAxis>
          <Tooltip formatter={formatTooltipValue} labelFormatter={formatTooltipLabel} />
          <Legend />
          <Bar yAxisId="right" dataKey="precipitation" fill="#8BC34A" name="Precipitation" />
          <Line yAxisId="left" type="monotone" dataKey="runoff" stroke="#1E90FF" dot={false} name="Runoff" />
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  )
}
