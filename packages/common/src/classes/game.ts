import { Document } from 'mongoose';

export interface IGame extends Document {
    name: string;
    description: string;
    cards: string[];
}