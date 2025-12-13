export type Run = { run_id: string, created_at?: string, status?: string, input_type?: string, result_urls?: any }
export type ResultPackage = { run_id: string, time_series?: Array<{ timestamp: string, value: number }>, summary_stats?: any, download_url?: string }
