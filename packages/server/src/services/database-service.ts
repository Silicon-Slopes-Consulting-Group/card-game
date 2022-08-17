import mongoose from 'mongoose';
import { singleton } from 'tsyringe';
import { getVariable } from '../utils/environement';

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
        return `mongodb+srv://${getVariable('MONGO_USER')}:${getVariable('MONGO_PASSWORD')}@${getVariable('MONGO_CLUSTER')}/${getVariable('MONGO_DB')}?retryWrites=true&w=majority`;
    }
}