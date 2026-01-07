import { useI18n } from '../i18n';

interface StatusDisplayProps {
  taskId: string | undefined;
  status: string | undefined;
  isLoading: boolean;
  error?: string;
}

/**
 * StatusDisplay - Shows job status information
 * 
 * Displays task ID, current status with color coding, and error messages.
 * Status colors: green=completed, red=failed, yellow=running
 * 
 * @example
 * ```tsx
 * <StatusDisplay 
 *   taskId="task-123"
 *   status="completed" 
 *   isLoading={false}
 *   error={undefined}
 * />
 * ```
 */
export default function StatusDisplay({ taskId, status, isLoading, error }: StatusDisplayProps) {
  const { t } = useI18n();

  return (
    <div className="bg-brazflow-panel rounded-[10px] shadow-[0_4px_8px_rgba(0,0,0,0.2)] border border-brazflow-panel-border mb-6 py-2.5 px-5">
      <div className="flex flex-col gap-2">
        <div className="text-sm text-brazflow-muted">
          <span className="font-semibold text-brazflow-text">Task ID:</span> {taskId}
        </div>

        <div className="flex items-center gap-x-2.5">
          <h3 className="m-0">{t('status_label')}</h3>
          <span
            className={`font-bold ${
              status === 'completed'
                ? 'text-green-400'
                : status === 'failed'
                  ? 'text-red-500'
                  : 'text-yellow-400'
            }`}
          >
            {isLoading ? t('loading') : status?.toUpperCase()}
          </span>
        </div>
        {status === 'running' && <span className="italic text-sm">{t('job_running')}</span>}
        {status === 'failed' && <span className="text-red-500 text-sm">{t('job_failed')} {error}</span>}
      </div>
    </div>
  );
}
