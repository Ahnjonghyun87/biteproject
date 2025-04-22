export interface DollarIndex {
  date: string;
  value: string;
}

export interface DollarIndexResponse {
  message: string;
  items: DollarIndex[];
}
