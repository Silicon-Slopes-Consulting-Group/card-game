import { StatusCodes } from 'http-status-codes';
import { registry, singleton } from 'tsyringe';
import AdminService from '../services/admin-service';
import AbstractController from './abstract-controller';

@singleton()
@registry([{ token: AbstractController.token, useClass: AdminController }])
export default class AdminController extends AbstractController {
    constructor(private readonly adminService: AdminService) {
        super();
        this.path = '/admin';
    }

    bindRoutes(): void {
        this.router.post('/populate', async (req, res, next) => {
            try {
                await this.adminService.populateDB();
                res.status(StatusCodes.CREATED).send();
            } catch (error) {
                next(error);
            }
        });

        this.router.delete('/clear', async (req, res, next) => {
            try {
                await this.adminService.clearDB();
                res.status(StatusCodes.NO_CONTENT).send();
            } catch (error) {
                next(error);
            }
        });
    }
}