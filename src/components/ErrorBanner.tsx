
import { useI18n } from '../i18n'

export default function ErrorBanner({ message }: { message?: string }) {
  const { t } = useI18n()
  return <div style={{ color: 'red' }}>{message || t('error')}</div>
}
