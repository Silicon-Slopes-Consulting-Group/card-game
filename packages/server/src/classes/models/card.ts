import { Document, model, Schema } from 'mongoose';
import { CardTypes } from '../card-types';

interface ICard extends Document {
    content: string;
    content2: string;
}

const CardSchema = new Schema({
    content: {
        type: String,
        required: true,
        trim: true,
    },
    content2: {
        type: String,
        required: false,
        default: '',
        trim: true,
    },
    color: {
        type: String,
        required: true,
        default: '#000000',
        trim: true,
    },
    color2: {
        type: String,
        required: true,
        default: '#FFFFFF',
        trim: true,
    },
    type: {
        type: String,
        enum: CardTypes,
        default: CardTypes.default,
    }
});

const Card = model<ICard>('Card', CardSchema);

export { ICard, CardSchema, Card };