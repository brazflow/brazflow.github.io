import { useMemo } from 'react'
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Label } from 'recharts'

interface FlowDurationCurveProps {
  data: Array<number>
}

export default function FlowDurationCurve({ data }: FlowDurationCurveProps) {
  const fdcData = useMemo(() => {
    if (!data || data.length === 0) return []

    // Filter out non-positive values for log scale and sort
    const sortedData = data.filter(value => value > 0).sort((a, b) => b - a)
    
    if (sortedData.length === 0) return []
    
    const exceedance = sortedData.map((_, i) => ((i + 1) / sortedData.length) * 100)

    return sortedData.map((value, i) => ({
      exceedance: exceedance[i],
      flow: value,
    }))
  }, [data])

  // Removed ticks and domain calculation for linear scale
  // const { ticks, domain } = useMemo(() => { ... });

  if (!fdcData || fdcData.length === 0) return <div>No data for Flow Duration Curve</div>

  const formatYAxisTick = (value: number) => {
    return value.toFixed(2) // Simpler formatting for linear scale
  }
  
  const formatTooltipLabel = (label: number) => {
    return `Exceedance: ${label.toFixed(2)}%`;
  };

  return (
    <div className="card">
      <h3 style={{ margin: '0 0 12px 0' }}>Flow Duration Curve</h3>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={fdcData} margin={{ top: 5, right: 30, left: 20, bottom: 25 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="exceedance" type="number" domain={[0, 100]}>
            <Label value="Exceedance [% of time]" offset={-15} position="insideBottom" />
          </XAxis>
          <YAxis tickFormatter={formatYAxisTick} allowDataOverflow> {/* Removed scale, domain, and ticks */}
            <Label value="Streamflow [m³/s]" angle={-90} position="insideLeft" style={{ textAnchor: 'middle' }} />
          </YAxis>
          <Tooltip formatter={(value: number) => value.toFixed(2)} labelFormatter={formatTooltipLabel} />
          <Line type="monotone" dataKey="flow" stroke="#00FF00" dot={false} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}
