
export default function SummaryTable({ summary }: { summary?: Record<string, number> }) {
  if (!summary) return <div>No summary available</div>
  return (
    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
      <tbody>
        {Object.entries(summary).map(([k, v]) => (
          <tr key={k}>
            <td style={{ padding: 6, borderBottom: '1px solid #eee' }}>{k}</td>
            <td style={{ padding: 6, borderBottom: '1px solid #eee', textAlign: 'right' }}>{typeof v === 'number' ? v.toFixed(2) : String(v)}</td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}
