import { Card, Layout } from "antd";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { GameItem } from "../../classes/game";
import { Header } from "../../components/header/header";
import api from "../../services/api-service";

import './home-page.css';

export function HomePage() {
    const [games, setGames] = useState<GameItem[]>([]);
    const navigate = useNavigate();

    useEffect(() => {
        api.get<GameItem[]>('/game')
            .then((res) => setGames(res.data))
            .catch(console.error);
    }, []);

    return (
        <Layout>
            <Header large />

            <Layout.Content className="responsive" id="home-page-games">
                { games.map((game) => (
                    <Card key={game._id} className="games-item" onClick={() => navigate(`/game/${game._id}`)}>
                        <h2>{game.name}</h2>
                        <p className="description">{game.description}</p>
                        <p className="info">{game.cards.length} cards</p>
                    </Card>
                )) }
            </Layout.Content>
        </Layout>
    )
}