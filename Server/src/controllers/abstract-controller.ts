import express from 'express';

export default abstract class AbstractController {
    static token = Symbol('Controller');
    router: express.Router;
    path: string;

    constructor() {
        this.router = express.Router();
        this.path = '/';

        this.bindRoutes();
    }
    
    protected abstract bindRoutes(): void;
}