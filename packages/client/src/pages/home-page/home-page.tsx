import { Modal, notification, Spin } from "antd";
import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { GameItem } from "../../classes/game";
import Icon from "../../components/Icon";
import { gameService } from "../../services/game-service";

export function HomePage() {
    const [loading, setLoading] = useState<boolean>(true);
    const [games, setGames] = useState<GameItem[]>([]);
    const [error, setError] = useState<string | undefined>();
    const [showSettings, setShowSettings] = useState<boolean>(false);

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

    return (
        <>
            <div id="home-page" className="game-page">
                {
                    loading ? (
                        <div className="loader-container">
                            <Spin className="loader" />
                        </div>
                    ) : (
                        <div className="page-container">
                            <div className="top-bar">
                                <div className="left"></div>
                                <div className="center"></div>
                                <div className="right">
                                    <div className="icon" onClick={openSettings}><Icon icon='cog' styling='solid' /></div>
                                </div>
                            </div>
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
                        </div>
                        
                    )
                }
            </div>

            <Modal title='Settings' closeIcon={<Icon icon="times" styling='solid' />} visible={showSettings} afterClose={closeSettings} okButtonProps={{ hidden: true }} cancelButtonProps={{hidden: true}} onCancel={closeSettings}>
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
        
    )
}