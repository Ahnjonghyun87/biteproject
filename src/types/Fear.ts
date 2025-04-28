export interface FearAndGreedData {
  value: number;
  value_classification: string;
  timestamp: number;
  time_until_update: string;
  classification: string;
  indicator: string;
}

export interface FearAndGreedResponse {
  items: FearAndGreedData[];
}
