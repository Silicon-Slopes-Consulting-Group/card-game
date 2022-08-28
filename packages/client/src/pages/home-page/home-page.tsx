import { Modal, notification } from "antd";
import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { GameItem } from "common";
import Icon from "@cfstcyr/react-icon";
import { gameService } from "../../services/game-service";
import { PageLayout, PageLayoutAction } from "../page-layout/page-layout";
import { GameSessionLoaded } from "../../classes/game-session";
import TimeAgo from "javascript-time-ago";
import en from 'javascript-time-ago/locale/en';

const MAX_SESSIONS = 3;

TimeAgo.addDefaultLocale(en);
const timeAgo = new TimeAgo('en-US');

export function HomePage() {
    const [loading, setLoading] = useState<boolean>(true);
    const [games, setGames] = useState<GameItem[]>([]);
    const [gameSessions, setGameSessions] = useState<GameSessionLoaded[]>([]);
    const [error, setError] = useState<string | undefined>();
    const [showSettings, setShowSettings] = useState<boolean>(false);

    useEffect(() => {
        gameService.getGameList()
            .then((games) => {
                setGames(games);
                setGameSessions(
                    gameService
                        .getGameSessions()
                        .map<Omit<GameSessionLoaded, 'game'> & { game: GameItem | undefined }>((session) => ({
                            ...session,
                            game: games.find((game) => game._id === session.game),
                        }))
                        .filter((session): session is GameSessionLoaded => session.game !== undefined)
                );
                console.log(gameService.getGameSessions());
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

    const clearAllData = useCallback(() => {
        gameService.clearData();
        gameService.clearGameSessions();
        setGameSessions([]);
        notification.success({ message: 'All game data cleared', duration: 1 });
    }, []);

    const clearSessionsData = useCallback(() => {
        gameService.clearGameSessions();
        setGameSessions([]);
        notification.success({ message: 'Sessions cleared', duration: 1 });
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
                {
                    gameSessions.length > 0 ? (
                        <div className="game-sessions">
                            <div className="game-sessions-list">
                                { gameSessions.map((session) => (
                                    <Link to={`/game/${session.game._id}?useSession=true`} key={session.game._id} className="game-btn game-session-btn">
                                        <div className="left">
                                            <p className="name">{session.game.name}</p>
                                        </div>
                                        <div className="rigth">
                                            <p className="description">
                                                <span><Icon icon="rectangle-portrait" />{session.index + 1}/{session.cards.length}</span>
                                                <span><Icon icon="calendar" />{timeAgo.format(session.date)}</span>
                                            </p>
                                        </div>
                                    </Link>
                                )) }
                            </div>
                            <hr />
                        </div>
                    ) : <></>
                }
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
                            <p>Clear all game data</p>
                        </span>
                        <button className="game-btn small" onClick={clearAllData}>Clear All</button>
                    </div>
                    <div className="row">
                        <span>
                            <p>Clear game sessions</p>
                        </span>
                        <button className="game-btn small" onClick={clearSessionsData}>Clear Sessions</button>
                    </div>
                </div>
            </Modal>
        </>
    );
}