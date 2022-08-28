import { GameItem } from "common";

export interface GameSession {
    date: Date;
    game: string;
    cards: string[];
    index: number;
}

export interface GameSessionLoaded extends Omit<GameSession, 'game'> {
    game: GameItem;
}