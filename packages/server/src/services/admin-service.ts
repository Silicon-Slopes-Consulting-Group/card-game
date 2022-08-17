import { singleton } from 'tsyringe';
import { CardTypes } from '../classes/card-types';
import { Card } from '../classes/models/card';
import { Game } from '../classes/models/game';

@singleton()
export default class AdminService {
    async clearDB(): Promise<void> {
        await Promise.all([
            Game.deleteMany({}).exec(),
            Card.deleteMany({}).exec(),
        ]);
    }

    async populateDB(): Promise<void> {
        await this.clearDB();

        for (let i = 0; i < 3; ++i) {
            const cards = [];

            const game = new Game({ name: `Game #${i + 1}` });

            const nCards = Math.floor(Math.random() * 10) + 5;
            for (let j = 0; j < nCards; ++j) {
                cards.push(new Card({
                    content: `Card #${j}`,
                    content2: `Card for game #${i}`,
                    type: CardTypes.default,
                    game,
                }));
            }

            game.cards = cards.map((c) => c.id);
            
            await Promise.all([game.save(), ...cards.map((c) => c.save())]);
        }
    }
}