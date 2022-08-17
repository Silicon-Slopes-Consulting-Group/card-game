import { Card } from "./card";

export interface User {
    email: string;
    isAdmin: boolean;
    favoriteList: Card[];
}