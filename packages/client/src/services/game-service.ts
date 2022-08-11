import { lastValueFrom, Observable } from 'rxjs';
import { Game, GameItem } from "../classes/game";
import { apiService } from './api-service';

type GameList = GameItem[] | undefined;
type GameObject = Game | undefined;

class GameService {
    private static _instance: GameService | undefined;
    private gamesList: GameList;
    private games: Map<string, GameObject>;

    constructor() {
        this.games = new Map();
    }

    static get instance() {
        if (!this._instance) this._instance = new this();
        return this._instance;
    }

    async getGameList(): Promise<GameItem[]> {
        return this.gamesList
            ? this.gamesList
            : lastValueFrom(this.fetchGameList());
    }

    async getGame(id: string): Promise<Game> {
        const game = this.games.get(id);
        return game
            ? game
            : lastValueFrom(this.fetchGame(id));
    }

    fetchGameList() {
        const subject = apiService.get<GameItem[]>('/game');
        subject.subscribe((game) => this.gamesList = game);
        return subject;
    }

    fetchGame(id: string): Observable<Game> {
        const subject = apiService.get<Game>(`/game/${id}`);
        subject.subscribe((game) => this.games.set(id, game));
        return subject;
    }
}

const gameService = GameService.instance

export { gameService, GameService };