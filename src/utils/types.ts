// V2 Types from backend
export interface Coordinate {
  lng: number;
  lat: number;
}

export interface GeoJson {
  type: string;
  coordinates: number[][][];
}

export interface DistributionFit {
  distribution_name: string;
  args: number[];
  pvalue: number;
  statistic: number;
}

export interface Signatures {
  mean_q: number;
  q1: number;
  q95: number;
  q90: number;
  q99: number;
  q710: number;
  q710_bestfit: DistributionFit
}

export interface ResultTask {
  task_id: string;
  outlet_point?: Coordinate;
  snapped?: Coordinate;
  catchment: GeoJson;
  climate_attributes: Record<string, number>;
  topography_attributes: Record<string, number>;
  time_index: string[]; // Using string for datetime for now
  precipitation: number[];
  runoff_simulation: number[];
  metrics: Signatures;
}

export interface PredictRequest {
  outlet?: Coordinate;
  catchment?: GeoJson;
}

export interface TaskResponse {
  task_id: string;
}

export type TaskStatus = "pending" | "running" | "completed" | "failed";

export interface TaskStatusResponse {
  task_id: string;
  status: TaskStatus;
  result?: ResultTask;
  error?: string;
}
