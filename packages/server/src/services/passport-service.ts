import { singleton } from 'tsyringe';
import passport from 'passport';
import { Strategy as LocalStrategy } from 'passport-local';
import { IUser, User } from '../classes/models/user';
import { Strategy as JWTStrategy, ExtractJwt } from 'passport-jwt';
import { getVariable } from '../utils/environement';
import HttpException from '../classes/http-exception';
import { StatusCodes } from 'http-status-codes';

@singleton()
export default class PassportService {
    configure() {
        this.configureStategies();
        this.configureSerialization();
    }

    configureStategies() {
        passport.use(
            'signup',
            new LocalStrategy(
                {
                    usernameField: 'email',
                    passwordField: 'password',
                },
                async (email, password, done) => {
                    try {
                        const user = await User.create({ email, password });
                        return done(null, user);
                    } catch (error) {
                        done(error);
                    }
                }
            )
        );

        passport.use(
            'login',
            new LocalStrategy(
                {
                    usernameField: 'email',
                    passwordField: 'password',
                },
                async (email, password, done) => {
                    try {
                        const user = await User.findOne({ email });

                        if (!user) return done(new HttpException(StatusCodes.UNAUTHORIZED, 'Invalid email or password'));
                        if (!await user.comparePassword(password)) return done(new HttpException(StatusCodes.UNAUTHORIZED, 'Invalid email or password'));

                        done(null, user);
                    } catch (error) {
                        done(error);
                    }
                }
            )
        );

        passport.use(
            new JWTStrategy(
                {
                    secretOrKey: getVariable('JWT_SECRET'),
                    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
                },
                async (token, done) => {
                    try {
                        const user = await User.findById(token.id);
                        done(null, user);
                    } catch (error) {
                        done(error);
                    }
                },  
            )
        );
    }

    configureSerialization() {
        passport.serializeUser(function(user, done) {
            done(null, (user as IUser)._id);
        });

        passport.deserializeUser(function(id, done) {
            User.findById(id, function(err: Error, user: IUser) {
                done(err, user);
            });
        });
    }
}