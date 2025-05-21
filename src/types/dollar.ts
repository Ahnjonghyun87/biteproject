export interface DollarIndex {
  date: string;
  value: number;
}

export interface DollarIndexResponse {
  message: string;
  items: DollarIndex[];
}
