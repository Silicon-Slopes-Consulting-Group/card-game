import { Spin } from "antd";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { GameItem } from "../../classes/game";
import api from "../../services/api-service";

export function HomePage() {
    const [loading, setLoading] = useState<boolean>(true);
    const [games, setGames] = useState<GameItem[]>([]);
    const [error, setError] = useState<string | undefined>();

    useEffect(() => {
        api.get<GameItem[]>('/game')
            .then((res) => setGames(res.data))
            .catch((error) => {
                setError(process.env.NODE_ENV === 'production' ? 'Error loading games' : error.message);
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