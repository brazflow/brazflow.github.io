
export default function ErrorBanner({ message }: { message?: string }) { return <div style={{ color: 'red' }}>{message || 'Error'}</div> }
