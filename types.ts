
export type LotteryType = 'Rio de Janeiro' | 'Look de Goiás' | 'Nacional' | 'Bahia' | 'São Paulo' | 'Lotep' | 'Popular';

export interface LotteryResult {
  lottery: LotteryType;
  date: string;
  hour: string;
  results: string[]; // List of numbers (usually 1st to 5th/7th)
  animals: string[]; // Corresponding animals for each result
}

export interface PredictionData {
  thousands: string[];
  hundreds: string[];
  tens: string[];
  groups: string[];
  reasoning: string;
  delayedNumbers: {
    number: string;
    days: number;
  }[];
  sources?: {
    title: string;
    uri: string;
  }[];
}

export interface LotteryState {
  selectedLottery: LotteryType | null;
  loading: boolean;
  prediction: PredictionData | null;
  history: LotteryResult[];
}
