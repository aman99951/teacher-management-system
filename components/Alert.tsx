
interface AlertProps {
  type: 'success' | 'error'
  message: string
}

export default function Alert({ type, message }: AlertProps) {
  const bgColor =
    type === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'

  return (
    <div role="alert" className={`rounded p-3 mb-4 ${bgColor}`}>
      {message}
    </div>
  )
}