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
  bonus?: number;
  choice?: number;
  fourOfAKind?: number;
  fullHouse?: number;
  smallStraight?: number;
  largeStraight?: number;
  yacht?: number;
  total?: number;
}

export type GameData = {
  currentPlayer: string;
  players: PlayerData[];
}