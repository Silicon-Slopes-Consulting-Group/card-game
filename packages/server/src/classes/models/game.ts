import { Document, model, Schema } from 'mongoose';

interface IGame extends Document {
    name: string;
    description: string;
    cards: string[];
}

const GameSchema = new Schema({
    name: {
        type: String,
        required: true,
        trim: true,
    },
    description: {
        type: String,
        default: '',
        trim: true,
    },
    cards: [{
        type: Schema.Types.ObjectId,
        ref: 'Card',
        default: [],
    }]
});

const Game = model<IGame>('Game', GameSchema);

export { IGame, GameSchema, Game };