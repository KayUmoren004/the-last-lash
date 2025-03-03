export type Player = {
  id: string;
  name: string;
  score: number;
  isHost: boolean;
  isReady: boolean;
  questions: string[];
};

export type Game = {
  id: string;
  name: string;
  players: Player[];
  currentQuestion: string;
  currentRound: number;
  maxRounds: number;
  maxPlayers: number;
  isPrivate: boolean;
  isStarted: boolean;
  isFinished: boolean;
  winner: Player | null;
  questions: string[];
  createdAt: Date;
};

export type GameStateContextType = {
  loading: boolean;
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
  createGame: (
    name: string,
    maxPlayers: number,
    maxRounds: number,
    isPrivate: boolean,
    player: Partial<Player>
  ) => Promise<void>;
  joinGame: (gameID: string, player: Partial<Player>) => Promise<void>;
  getGame: (gameID: string) => Promise<Game | null>;
};
