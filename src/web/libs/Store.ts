import { create } from "zustand";

/* Load states typing */
interface GameLoadStates {
  featureBundle: boolean;
  gameRequest: boolean;
  gameSocket: boolean;
  gameStage: boolean;
  initialLoad: boolean;
}

/* Game options typings */
interface GameOptions {
  antialias: boolean;
  gameMode: "classic" | "nemein";
  performanceDisplay: boolean;
  powerPreference: "default" | "high-performance" | "low-power";
  stageShake: boolean;
}

/* Game performance typings */
interface GamePerformance {
  currentLatency: number;
  frameRate: number;
  frameTime: number;
}

/* Tetromino enum types */
export enum TetrominoType {
  Blank = 0,
  Square = 1,
  I = 2,
  T = 3,
  J = 4,
  L = 5,
  Z = 6,
  S = 7,
  Grey = 8,
  Ghost = 9,
}

/* Classic game state typings */
export interface ClassicStates {
  gameField: {
    colArr: number[];
    lowestY: number;
  }[];
  type: "classic";
}

/* Nemein game state typings */
export enum DmgType {
  Physical = 0,
  Fire = 1,
  Cold = 2,
  Lightning = 3,
}

export interface ClearRecord {
  dmgDealt: {
    dominantDmgType: DmgType;
    value: number;
  };
  idx: number;
  lineTypeArr: TetrominoType[];
  wasCrit: boolean;
}

export interface NemeinStates {
  clearRecordsArr: ClearRecord[];
  gameField: {
    colArr: {
      type: TetrominoType;
      hp: number;
    }[];
    lowestY: number;
  }[];
  type: "nemein";
}

/* Combined game state typings */
export type GameStates = {
  level: number;
  score: number;
  gameOver: boolean;
  heldTetromino: TetrominoType;
  spawnedTetrominos: TetrominoType[];
} & (ClassicStates | NemeinStates);

/* Game status typings */
type GameStatus = "initializing" | "ongoing" | "pausing" | "ending";

/* Game theme typings, gives autocomplete while satifies string | undefined */
type GameTheme = "light" | "dark" | (string & {}) | undefined;

/* Game store typings */
interface GameStoreState {
  gameLoadStates: GameLoadStates;
  gameOptions: GameOptions;
  gamePerformance: GamePerformance;
  gameStates: GameStates | null;
  gameStatus: GameStatus;
  gameTheme: GameTheme;
}

interface GameStoreAction {
  updateGameLoadStates: (gameLoadStates: Partial<GameLoadStates>) => void;
  updateGameOptions: (gameOptions: Partial<GameOptions>) => void;
  updateGamePerformance: (gamePerformance: Partial<GamePerformance>) => void;
  updateGameStates: (gameStates: GameStates) => void;
  updateGameStatus: (gameStatus: GameStatus) => void;
  updateGameTheme: (gameTheme: GameTheme) => void;
}

/* Builds the game store */
export const useGameStore = create<GameStoreState & GameStoreAction>((set) => ({
  gameLoadStates: {
    featureBundle: false,
    gameRequest: false,
    gameSocket: false,
    gameStage: false,
    initialLoad: true,
  },
  gameOptions: {
    antialias: true,
    gameMode: "nemein",
    performanceDisplay: import.meta.env.DEV,
    powerPreference: "default",
    stageShake: true,
  },
  gamePerformance: {
    currentLatency: 0,
    frameRate: 0,
    frameTime: 0,
  },
  gameStates: null,
  gameStatus: "initializing",
  gameTheme: "dark",
  updateGameLoadStates: (gameLoadStates: Partial<GameLoadStates>) =>
    set((state) => ({
      gameLoadStates: {
        ...state.gameLoadStates,
        ...gameLoadStates,
      },
    })),
  updateGameOptions: (gameOptions: Partial<GameOptions>) =>
    set((state) => ({ gameOptions: { ...state.gameOptions, ...gameOptions } })),
  updateGamePerformance: (gamePerformance: Partial<GamePerformance>) =>
    set((state) => ({
      gamePerformance: { ...state.gamePerformance, ...gamePerformance },
    })),
  updateGameStates: (gameStates: GameStates) => set(() => ({ gameStates })),
  updateGameStatus: (gameStatus: GameStatus) => set(() => ({ gameStatus })),
  updateGameTheme: (gameTheme: GameTheme) => set(() => ({ gameTheme })),
}));
