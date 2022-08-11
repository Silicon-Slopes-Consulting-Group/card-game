import { Button, Divider, Layout, Modal, notification } from "antd";
import React, { useCallback, useEffect, useState } from "react";
import { lastValueFrom } from "rxjs";
import { GameItem } from "../../classes/game";
import { CreateGame } from "../../components/create-game/create-game";
import { GameListAdmin } from "../../components/game-list-admin/game-list-admin";
import { Header } from "../../components/header/header";
import { apiService } from "../../services/api-service";
import { gameService } from "../../services/game-service";

export function AdminPage() {
    const [games, setGames] = useState<GameItem[]>([]);

    const updateGames = useCallback(async () => {
        try {
            setGames(await lastValueFrom(gameService.fetchGameList()));
        } catch (error) {
            console.log(error);
            notification.error({ message: 'Error fetching games' });
        }
    }, []);

    const populateDB = useCallback(async () => {
        try {
            await lastValueFrom(apiService.post('/admin/populate'));
            await updateGames();
            notification.success({ message: 'DB Populated' });
        } catch (error) {
            notification.error({ message: 'Error trying to populate DB' });
            console.log(error);
        }
    }, [updateGames]);

    const clearDB = useCallback(async () => {
        try {
            await lastValueFrom(apiService.delete('/admin/clear'));
            await updateGames();
            notification.success({ message: 'DB Cleared' });
        } catch (error) {
            notification.error({ message: 'Error trying to clear DB' });
            console.log(error);
        }
    }, [updateGames]);

    const askPopulateDB = () => {
        Modal.confirm({
            title: 'Populate DB?',
            content: 'This will delete all its content',
            onOk: async () => await populateDB(),
        });
    }

    const askClearDB = () => {
        Modal.confirm({
            title: 'Clear DB?',
            content: 'This will delete all its content',
            onOk: async () => await clearDB(),
        });
    }

    useEffect(() => {
        updateGames();
    }, [updateGames]);

    return (
        <Layout>
            <Header />

            <Layout.Content className="responsive">
                <div className="buttons-container">
                    <Button onClick={askPopulateDB}>Populate DB</Button>
                    <Button onClick={askClearDB}>Clear DB</Button>
                </div>

                <Divider />

                <CreateGame updateGames={updateGames} />

                <br />

                <GameListAdmin games={games} updateGames={updateGames} />
            </Layout.Content>
        </Layout>
    );
}