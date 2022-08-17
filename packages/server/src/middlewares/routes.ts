import { Request, Response, NextFunction } from 'express';
import passport from 'passport';

export function privateRoute(req: Request, res: Response, next: NextFunction) {
    return passport.authenticate('jwt')(req, res, next);
}

export function publicRoute(req: Request, res: Response, next: NextFunction) {
    passport.authenticate('jwt', (err, user) => {
        if (user) req.login(user, next);
        else next();
    })(req, res, next);
}