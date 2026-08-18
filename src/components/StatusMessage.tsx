export type StatusKind = 'neutral' | 'success' | 'error'

interface StatusMessageProps {
  kind: StatusKind
  message: string
}

const statusMarks: Record<StatusKind, string> = {
  neutral: '•',
  success: '✓',
  error: '!',
}

export function StatusMessage(props: StatusMessageProps) {
  return (
    <footer classList={{ status: true, [props.kind]: true }} role="status" aria-live="polite">
      <span class="status-mark" aria-hidden="true">{statusMarks[props.kind]}</span>
      <p>{props.message}</p>
    </footer>
  )
}
