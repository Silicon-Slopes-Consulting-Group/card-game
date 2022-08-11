import { Spin } from "antd";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { GameItem } from "../../classes/game";
import { gameService } from "../../services/game-service";

export function HomePage() {
    const [loading, setLoading] = useState<boolean>(true);
    const [games, setGames] = useState<GameItem[]>([]);
    const [error, setError] = useState<string | undefined>();

    useEffect(() => {
        gameService.getGameList()
            .then((games) => {
                setGames(games);
            })
            .catch((error) => {
                setError(error.message);
                console.error(error);
            })
            .finally(() => setLoading(false));
    }, []);

    return (
        <div id="home-page" className="game-page">
            {
                loading ? (
                    <div className="loader-container">
                        <Spin className="loader" />
                    </div>
                ) : (
                    <div className="games-container">{
                        error ? (
                            <p className="error-message">{String(error)}</p>
                        ) : (
                            games.map((game) => (
                                <Link to={`/game/${game._id}`} key={game._id} className="game-btn">
                                    <p className="name">{game.name}</p>
                                    <p className="description">{game.description}</p>
                                </Link>
                            ))
                        )
                    }</div>
                )
            }
        </div>
    )
}