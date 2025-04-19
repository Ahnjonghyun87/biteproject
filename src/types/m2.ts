export interface M2Supply {
  date: string;
  value: string;
}

export interface M2SupplyResponse {
  message: string;
  items: M2Supply[];
}
