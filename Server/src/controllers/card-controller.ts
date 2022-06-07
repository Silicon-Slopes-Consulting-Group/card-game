import { StatusCodes } from 'http-status-codes';
import { registry, singleton } from 'tsyringe';
import HttpException from '../classes/http-exception';
import { Card, ICard } from '../classes/models/card';
import { Game } from '../classes/models/game';
import AbstractController from './abstract-controller';

@singleton()
@registry([{ token: AbstractController.token, useClass: CardController }])
export default class CardController extends AbstractController {
    constructor() {
        super();
        this.path = '/card';
    }

    bindRoutes(): void {
        this.router.patch('/:gameId', async (req, res, next) => {
            let cards: (ICard & { _id: string })[];

            if (!Array.isArray(req.body.cards)) cards = [req.body.cards];
            else cards = req.body.cards;

            const game = await Game.findById(req.params.gameId);

            if(!game) throw new HttpException(StatusCodes.NOT_FOUND, `No game for id ${req.params.gameId}`);

            try {
                await Promise.all(cards.map(async (card) => {
                    if (card._id.startsWith('temp-')) {
                        const cardData: Partial<ICard & { _id: string }> = card;
                        delete cardData._id;
                        const newCard = new Card(cardData);
                        await newCard.save();

                        game.cards.push(newCard._id);

                        return newCard;
                    } else {
                        return new Promise((resolve, reject) => {
                            Card.findByIdAndUpdate(card._id, card, {}, (err, data) => {
                                if (err) return reject(err);
                                resolve(data);
                            });
                        });
                    }
                }));

                await game.save();
                
                res.status(StatusCodes.OK).send((await game.populate('cards')).cards);
            } catch (error) {
                next(error);
            }
        });

        this.router.post('/delete/:gameId', async (req, res, next) => {
            try {
                const game = await Game.findById(req.params.gameId);

                if(!game) throw new HttpException(StatusCodes.NOT_FOUND, `No game for id ${req.params.gameId}`);

                await Promise.all(req.body.cards.map(async (id: string) => {
                    // console.log(id);
                    game.cards.splice(game.cards.indexOf(id), 1);
                    await Card.findByIdAndDelete(id);
                }));
                await game.save();
                res.status(StatusCodes.OK).send(await Game.findById(req.params.gameId).populate('cards'));
            } catch (error) {
                next(error);
            }
        });
    }
}