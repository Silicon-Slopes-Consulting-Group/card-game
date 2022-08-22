import { Document } from 'mongoose';

export interface ICard extends Document {
    content: string;
    content2: string;
}