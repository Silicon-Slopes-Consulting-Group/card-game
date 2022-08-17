import { StatusCodes } from 'http-status-codes';
import passport from 'passport';
import { registry, singleton } from 'tsyringe';
import HttpException from '../classes/http-exception';
import { Card } from '../classes/models/card';
import { IUser } from '../classes/models/user';
import { privateRoute } from '../middlewares/routes';
import AbstractController from './abstract-controller';

@singleton()
@registry([{ token: AbstractController.token, useClass: UserController }])
export default class UserController extends AbstractController {
    constructor() {
        super();
        this.path = '/user';
    }

    bindRoutes(): void {
        this.router.get('/', privateRoute, async (req, res) => {
            const user = req.user as IUser;

            res.status(StatusCodes.OK).send({ user: await user.publicJSON() });
        });

        this.router.post('/signup', passport.authenticate('signup'), async (req, res) => {
            const user = req.user as IUser;
            const token = await user.generateToken();
            res.status(StatusCodes.OK).send({ user: await user.publicJSON(), token });
        });

        this.router.post('/login', passport.authenticate('login'), async (req, res) => {
            const user = req.user as IUser;
            const token = await user.generateToken();
            res.status(StatusCodes.OK).send({ user: await user.publicJSON(), token });
        });

        this.router.patch('/favorites/add/:cardId', privateRoute, async (req, res) => {
            const user = req.user as IUser;
            const card = await Card.findById(req.params.cardId);

            if (!card) throw new HttpException(StatusCodes.NOT_FOUND, `No card found with id "${req.params.cardId}."`);
            if (user.favoriteList.find((id) => card._id.equals(id))) throw new HttpException(StatusCodes.BAD_REQUEST, `Card "${req.params.cardId}" already in list.`);

            user.favoriteList = [...(user.favoriteList ?? []), card.id];
            await user.save();

            res.status(StatusCodes.OK).send({ user: await user.publicJSON() });
        });

        this.router.patch('/favorites/delete/:cardId', privateRoute, async (req, res) => {
            const user = req.user as IUser;
            const card = await Card.findById(req.params.cardId);

            if (!card) throw new HttpException(StatusCodes.NOT_FOUND, `No card found with id "${req.params.cardId}."`);

            const index = user.favoriteList.findIndex((id) => card._id.equals(id));
            
            if (index === -1) throw new HttpException(StatusCodes.BAD_REQUEST, `Card ${req.params.cardId} not in list`);

            user.favoriteList.splice(index, 1);
            await user.save();

            res.status(StatusCodes.OK).send({ user: await user.publicJSON() });
        });
    }
}