import { StatusCodes } from 'http-status-codes';
import { registry, singleton } from 'tsyringe';
import DatabaseService from '../services/database-service';
import AbstractController from './abstract-controller';

@singleton()
@registry([{ token: AbstractController.token, useClass: DefaultController }])
export default class DefaultController extends AbstractController {
    constructor(private readonly databaseService: DatabaseService) {
        super();
    }

    bindRoutes(): void {
        this.router.get('/', (req, res) => {
            res.status(StatusCodes.OK).send({ status: 'ok', db: this.databaseService.isConnected() });
        });
    }
}