export interface FearAndGreedData {
  name: string;
  data: [
    {
      value: string;
      value_classification: string;
      timestamp: string;
      time_until_update: string;
    },
  ];
}

export interface FearAndGreedResponse {
  items: FearAndGreedData[];
}
