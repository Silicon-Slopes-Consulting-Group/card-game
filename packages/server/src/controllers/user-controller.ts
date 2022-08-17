import { StatusCodes } from 'http-status-codes';
import passport from 'passport';
import { registry, singleton } from 'tsyringe';
import { IUser } from '../classes/models/user';
import { privateRoute, publicRoute } from '../middlewares/routes';
import AbstractController from './abstract-controller';

@singleton()
@registry([{ token: AbstractController.token, useClass: UserController }])
export default class UserController extends AbstractController {
    constructor() {
        super();
        this.path = '/user';
    }

    bindRoutes(): void {
        this.router.get('/', privateRoute, (req, res) => {
            const user = req.user as IUser;
            res.status(StatusCodes.OK).send({ user: user.publicJSON() });
        });

        this.router.post('/signup', passport.authenticate('signup'), async (req, res) => {
            const user = req.user as IUser;
            const token = await user.generateToken();
            res.status(StatusCodes.OK).send({ user: user.publicJSON(), token });
        });

        this.router.post('/login', passport.authenticate('login'), async (req, res) => {
            const user = req.user as IUser;
            const token = await user.generateToken();
            res.status(StatusCodes.OK).send({ user: user.publicJSON(), token });
        });
    }
}