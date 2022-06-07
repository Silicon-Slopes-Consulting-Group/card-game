import { injectAll, singleton } from 'tsyringe';
import express from 'express';
import AbstractController from './controllers/abstract-controller';
import cors from 'cors';
import logger from 'morgan';
import './controllers';
import './classes/models';
import ProcessUtils from './utils/process';
import { StatusCodes } from 'http-status-codes';
import HttpException from './classes/http-exception';
import errorHandler from './utils/error-handler';
import DatabaseService from './services/database-service';

@singleton()
export default class Application {
    readonly app: express.Application;

    constructor (
        @injectAll(AbstractController.token) private readonly controllers: AbstractController[],
        private readonly databaseService: DatabaseService,
    ) {
        this.app = express();

        this.configure();

        this.bindRoutes();

        this.errorHandler();
    }

    async connect() {
        await this.databaseService.connect();
    }

    private configure() {
        this.app.use(logger('dev', {
            skip: (req, res) => ProcessUtils.isProduction() && res.statusCode < 400,
        }));

        this.app.use(cors({
            origin: process.env.CLIENT_URL || '*',
            credentials: true,
        }));
        this.app.use(express.json());
    }

    private bindRoutes() {
        for (const controller of this.controllers) {
            this.app.use(controller.path, controller.router);
        }

        this.app.get('*', (req) => {
            throw new HttpException(StatusCodes.NOT_FOUND, `Cannot GET <i>${req.path}</i>.`);
        });
    }

    private errorHandler() {
        this.app.use(errorHandler);
    }
}