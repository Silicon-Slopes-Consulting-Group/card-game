import { Modal, notification } from "antd";
import { useCallback, useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { GameItem } from "common";
import Icon from "@cfstcyr/react-icon";
import { SessionContext } from "../../contexts/session-context";
import { gameService } from "../../services/game-service";
import { PageLayout, PageLayoutAction } from "../page-layout/page-layout";

export function HomePage() {
    const { user } = useContext(SessionContext)!;
    const [loading, setLoading] = useState<boolean>(true);
    const [games, setGames] = useState<GameItem[]>([]);
    const [error, setError] = useState<string | undefined>();
    const [showSettings, setShowSettings] = useState<boolean>(false);

    useEffect(() => {
        console.log(user);
    }, [user]);

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

    const openSettings = useCallback(() => {
        setShowSettings(true);
    }, []);

    const closeSettings = useCallback(() => {
        setShowSettings(false);
    }, []);

    const clearData = useCallback(() => {
        gameService.clearData();
        notification.success({ message: 'Data cleared', duration: 1 });
    }, []);

    const secondaryActions: PageLayoutAction[] = [
        {
            icon: 'user',
            to: '/user',
        },
        {
            icon: 'cog',
            onClick: openSettings,
        }
    ]

    return (
        <>
            <PageLayout id="home-page" loading={loading} hideDefaultHeaderActions={true} secondaryActions={secondaryActions}>
                <div className="games-container">
                    {
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
                    }
                </div>
            </PageLayout>

            <Modal title='Settings' className="game-modal" closeIcon={<Icon icon="times" styling='solid' />} visible={showSettings} afterClose={closeSettings} okButtonProps={{ hidden: true }} cancelButtonProps={{hidden: true}} onCancel={closeSettings}>
                <div className="settings">
                    <div className="row">
                        <span>
                            <p>Clear data</p>
                            <p><small>Clear saved session storage</small></p>
                        </span>
                        <button className="game-btn small" onClick={clearData}>Clear</button>
                    </div>
                </div>
            </Modal>
        </>
    );
}