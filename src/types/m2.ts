export interface M2Supply {
  date: string;
  value: number;
  indicator: string;
}

export interface M2SupplyResponse {
  message: string;
  items: M2Supply[];
}
