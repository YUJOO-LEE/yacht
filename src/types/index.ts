export type PlayerData = {
  id: string;
  name: string;
}

export type Score = {
  aces?: number;
  deuces?: number;
  threes?: number;
  fours?: number;
  fives?: number;
  sixes?: number;
  choice?: number;
  fourOfAKind?: number;
  fullHouse?: number;
  smallStraight?: number;
  largeStraight?: number;
  yacht?: number;
  subTotal: number;
  bonus: number | string;
  total: number;
}

export type GameData = {
  currentPlayer: string;
  players: PlayerData[];
  score: Record<string, Score>;
}

export type PlayerScore = PlayerData & { score?: Score };