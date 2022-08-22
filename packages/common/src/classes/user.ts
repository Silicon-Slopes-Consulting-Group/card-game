import { Document, ObjectId } from 'mongoose';
import { ICard } from './card';

export interface PublicUser {
    email: string;
    isAdmin: boolean;
    favoriteList: ICard[];
}

export interface IUser extends Omit<PublicUser, 'favoriteList'>, Document {
    password: string;
    favoriteList: ObjectId[];
    comparePassword: (password: string) => Promise<boolean>,
    generateToken: () => Promise<string>,
    publicJSON: () => Promise<PublicUser>,
}