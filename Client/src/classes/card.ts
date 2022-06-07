import { CardTypes } from "./card-types";

export interface Card {
    _id: string;
    content: string;
    content2?: string;
    color?: string;
    color2?: string;
    type?: CardTypes;
}

export interface PlayingCard extends Card {
    played?: boolean;
}