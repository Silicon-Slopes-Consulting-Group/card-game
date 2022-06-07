import { StatusCodes } from 'http-status-codes';
import { registry, singleton } from 'tsyringe';
import { Game } from '../classes/models/game';
import AbstractController from './abstract-controller';

@singleton()
@registry([{ token: AbstractController.token, useClass: GameController }])
export default class GameController extends AbstractController {
    constructor() {
        super();
        this.path = '/game';
    }

    bindRoutes(): void {
        this.router.get('/', async (req, res, next) => {
            try {
                const games = await Game.find({}).exec();
                res.status(StatusCodes.OK).send(games);
            } catch (error) {
                next(error);
            }
        });
        
        this.router.get('/:id', async (req, res, next) => {
            try {
                const game = await Game.findById(req.params.id).populate('cards').exec();
                res.status(StatusCodes.OK).send(game);
            } catch (error) {
                next(error);
            }
        });

        this.router.post('/', async (req, res, next) => {
            try {
                const game = new Game(req.body);
                await game.save();
                res.status(StatusCodes.CREATED).send(game);
            } catch (error) {
                next(error);
            }
        });

        this.router.patch('/:id', async (req, res, next) => {
            Game.findByIdAndUpdate(req.params.id, req.body, {}, (error, update) => {
                if (error) return next(error);
                res.status(StatusCodes.OK).send(update);
            });
        });

        this.router.delete('/:id', async (req, res, next) => {
            try {
                await Game.findByIdAndDelete(req.params.id);
                res.status(StatusCodes.NO_CONTENT).send();
            } catch (error) {
                next(error);
            }
        });
    }
}