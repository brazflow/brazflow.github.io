
export default function Button({ children, onClick, disabled=false }: any) {
  return (
    <button onClick={onClick} disabled={disabled} className="px-3 py-1 bg-blue-600 text-white rounded">
      {children}
    </button>
  )
}
