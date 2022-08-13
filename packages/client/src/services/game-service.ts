import { lastValueFrom, Observable } from 'rxjs';
import { Game, GameItem } from "../classes/game";
import { apiService } from './api-service';

const GAME_LIST_KEY = '_game-list';
const GAME_LIST_CARDS_KEY = '_game-list-cards';

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
        const gameList = window.sessionStorage.getItem(GAME_LIST_KEY);

        return gameList
            ? JSON.parse(gameList)
            : this.gamesList
                ? this.gamesList
                : lastValueFrom(this.fetchGameList());
    }

    async getGame(id: string): Promise<Game> {
        const game = this.getGameFromList(id) ?? this.games.get(id);
        
        return game
            ? game
            : lastValueFrom(this.fetchGame(id));
    }

    fetchGameList() {
        const subject = apiService.get<GameItem[]>('/game');
        subject.subscribe((game) => {
            window.sessionStorage.setItem(GAME_LIST_KEY, JSON.stringify(game));
            this.gamesList = game;
        });
        return subject;
    }

    fetchGame(id: string): Observable<Game> {
        const subject = apiService.get<Game>(`/game/${id}`);
        subject.subscribe((game) => {
            this.addGameToList(game);
            this.games.set(id, game);
        });
        return subject;
    }

    clearData(): void {
        window.sessionStorage.removeItem(GAME_LIST_KEY);
        window.sessionStorage.removeItem(GAME_LIST_CARDS_KEY);
        this.gamesList = undefined;
        this.games = new Map();
    }

    private addGameToList(game: Game): void {
        const games = this.getGameListCards();
        games.push(game);
        window.sessionStorage.setItem(GAME_LIST_CARDS_KEY, JSON.stringify(games));
    }
    
    private getGameFromList(id: string): Game | undefined {
        const games = this.getGameListCards();
        return games.find(({ _id }) => _id === id);
    }

    private getGameListCards(): Game[] {
        const games = window.sessionStorage.getItem(GAME_LIST_CARDS_KEY);
        return games ? JSON.parse(games) : [];
    }
}

const gameService = GameService.instance

export { gameService, GameService };