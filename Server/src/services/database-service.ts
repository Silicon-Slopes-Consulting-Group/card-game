import mongoose from 'mongoose';
import { singleton } from 'tsyringe';

@singleton()
export default class DatabaseService {
    private _client: typeof mongoose | undefined;

    async connect() {
        this._client = await mongoose.connect(this.url);
    }

    isConnected() {
        return this._client !== undefined;
    }

    private get url() {
        return `mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@${process.env.MONGO_CLUSTER}/${process.env.MONGO_DB}?retryWrites=true&w=majority`;
    }
}