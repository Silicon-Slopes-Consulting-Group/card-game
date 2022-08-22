import { Card } from "./card";

export interface AbstractGame {
    _id: string;
    name: string;
    description: string;
}

export interface GameItem extends AbstractGame {
    cards: string[];
}

export interface Game extends AbstractGame {
    cards: Card[];
}