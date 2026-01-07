import { useState } from 'react';
import { useI18n } from '../i18n';
import type { TaskStatusResponse } from '../utils/types';

interface LogViewerProps {
  data: TaskStatusResponse | undefined;
}

/**
 * LogViewer - Collapsible log display section
 * 
 * Provides a toggleable view of task status logs in JSON format.
 * Shows a "polling for status" message when data is not available.
 * 
 * @example
 * ```tsx
 * <LogViewer data={statusQ.data} />
 * ```
 */
export default function LogViewer({ data }: LogViewerProps) {
  const [isLogVisible, setIsLogVisible] = useState(false);
  const { t } = useI18n();

  return (
    <div className="bg-brazflow-panel rounded-[10px] shadow-[0_4px_8px_rgba(0,0,0,0.2)] border border-brazflow-panel-border mb-6 py-2.5 px-5">
      <button
        onClick={() => setIsLogVisible(!isLogVisible)}
        className="bg-none border-none p-0 text-brazflow-text cursor-pointer font-bold"
      >
        {isLogVisible ? t('hide_log_details') : t('show_log_details')}
      </button>
      {isLogVisible && (
        <>
          <h3 className="mt-3 mb-2">{t('logs')}</h3>
          <pre className="h-[300px] overflow-auto bg-brazflow-panel text-[#eee] p-2 whitespace-pre-wrap rounded">
            {data ? JSON.stringify(data, null, 2) : t('polling_for_status')}
          </pre>
        </>
      )}
    </div>
  );
}
