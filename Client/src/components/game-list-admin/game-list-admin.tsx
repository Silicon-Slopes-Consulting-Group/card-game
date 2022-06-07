import { Button, Card, Modal, notification, PageHeader, Table } from "antd";
import React from "react";
import { GameItem } from "../../classes/game";
import { ExclamationCircleOutlined } from '@ant-design/icons';
import api from "../../services/api-service";
import { Link } from "react-router-dom";

interface GameListAdminProp {
    games: GameItem[];
    updateGames: () => Promise<void>;
}

export function GameListAdmin({ games, updateGames }: GameListAdminProp) {
    const openDeleteModal = (game: GameItem) => {
        Modal.confirm({
            title: 'Delete game?',
            icon: <ExclamationCircleOutlined />,
            content: `Do you want to delete "${game.name}" (${game._id})`,
            async onOk() {
                try {
                    await api.delete(`/game/${game._id}`);
                    await updateGames();
                    notification.success({ message: `Game "${game.name}" deleted.` });
                } catch (e) {
                    console.log(e);
                    notification.error({ message: `Could not delete game "${game.name}."` });
                }
            },
        });
    }

    const columns = [
        {
            title: 'Name',
            dataIndex: 'name',
            key: 'name',
        },
        {
            title: 'ID',
            dataIndex: '_id',
            key: 'id',
        },
        {
            title: 'Cards',
            dataIndex: 'cards',
            key: 'cards',
            render: (cards: string[]) => cards.length,
        },
        {
            render: (_: undefined, game: GameItem) => (
               <div className="buttons-container flex-end">
                    <Button onClick={() => openDeleteModal(game)} danger>Delete</Button>
                    <Link to={`/admin/game/${game._id}`}><Button>Edit</Button></Link>
               </div> 
            )
        }
    ];

    return (
        <Card>
            <PageHeader title="Games" />

            <Table dataSource={games} columns={columns} />
        </Card>
    )
}