import { Button, Card, Form, Input, Layout, notification, PageHeader, Spin } from "antd";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { catchError, lastValueFrom, of } from "rxjs";
import { Card as GameCard } from "common";
import { Game } from "common";
import { CardBulkEdit } from "../../components/card-bulk-edit/card-bulk-edit";
import { CardListAdmin } from "../../components/card-list-admin/card-list-admin";
import { Header } from "../../components/header/header";
import { apiService } from "../../services/api-service";
import { gameService } from "../../services/game-service";

type CardItem = GameCard & { key: string };

export function AdminEditGamePage() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [game, setGame] = useState<Game | undefined>();
    const [cards, setCards] = useState<CardItem[]>([]);
    const [editedCards, setEditedCards] = useState<Partial<GameCard>[]>([]);
    const [saveGameLoading, setSaveGameLoading] = useState<boolean>(false);
    const [saveCardsLoading, setSaveCardsLoading] = useState<boolean>(false);
    const [bulkVisible, setBulkVisible] = useState<boolean>(false);
    const [bulkValue, setBulkValue] = useState<string>('');

    useEffect(() => {
        const subscription = gameService.fetchGame(`${id}`)
            .pipe(
                catchError((error) => {
                    console.log(error);
                    notification.error({ message: `Cannot get game ${id}` });
                    return of();
                }),
            )
            .subscribe((game) => {
                if (game) {
                    setGame(game)
                    setCards(game.cards.map((c) => ({ ...c, key: c._id })));
                }
            });

        return () => subscription.unsubscribe();
    }, [id]);

    const saveGame = async (update: Partial<Game>) => {
        setSaveGameLoading(true);
        setGame({ ...game!, ...update });
        try {
            await lastValueFrom(await apiService.patch(`/game/${game?._id}`, update));
            notification.success({ message: 'Game updated' });
        } catch (error) {
            console.log(error);
            notification.error({ message: 'Cannot update game' });
        }
        setSaveGameLoading(false);
    }

    const updateCard = (changes: Partial<CardItem>, card: CardItem) => {
        if (!game) return;

        const index = cards.findIndex((c) => c._id === card._id);
        const editedIndex = editedCards.findIndex((c) => c._id === card._id);

        cards.splice(index, 1, card);

        if (editedIndex > -1) {
            editedCards.splice(editedIndex, 1, { ...editedCards[editedIndex], ...changes });
        } else {
            editedCards.push({ ...changes, _id: card._id });
        }

        setCards([ ...cards ]);
        setEditedCards([ ...editedCards ]);
    }

    const saveCards = async () => {
        setSaveCardsLoading(true);
        const cards = await lastValueFrom(apiService.patch<GameCard[]>(`/card/${game?._id}`, { cards: editedCards }));
        setCards(cards!.map((c) => ({ ...c, key: c._id })));
        setEditedCards([]);
        setSaveCardsLoading(false);
        notification.success({ message: 'Cards updated' });
    }

    const addCard = (content = 'New card', content2 = '') => {
        const _id = `temp-${Math.random()}`;
        cards.push({ content, content2, _id, key: _id });
        editedCards.push({ _id, content, content2 });
        
        setCards([ ...cards ]);
        setEditedCards([ ...editedCards ]);
    }

    const handleAddCard = () => addCard();

    const bulkEdit = () => {
        setBulkValue(cards.map((card) => [card._id, card.content, card.content2].join(' | ')).join('\n'));
        setBulkVisible(true);
    }

    const handleBulkEdit = async (value: string) => {
        const toDelete: string[] = [];

        const values: [id: string, content: string, content2: string][] = value.split('\n').map((l) => l.split('|').map((w) => w.trim())) as any;

        setEditedCards([]);

        for (const card of cards) {
            const editedIndex = values.findIndex(([id]) => id === card._id);
            if (editedIndex === -1) {
                toDelete.push(card._id);
                continue;
            }
            const [id, content, content2] = values[editedIndex];

            if (card.content !== content || card.content2 !== content2) editedCards.push({ _id: id, content, content2 });

            values.splice(editedIndex, 1);
        }

        for (const [content, content2] of values) {
            editedCards.push({ _id: `temp-${Math.random()}`, content, content2 });
        }

        console.log(toDelete, editedCards);

        await lastValueFrom(apiService.post(`/card/delete/${game!._id}`, { cards: toDelete }));
        await saveCards();
    }

    return (
        <Layout>
            <Header />

            { game ? (
                <Layout.Content className="responsive">
                    <PageHeader title={`Edit game "${game.name}"`} onBack={() => navigate('/admin')} />

                    <Card>
                        <PageHeader title="Edit name and description" />

                        <Form
                            onFinish={saveGame}
                            labelCol={{ span: 4 }}
                            wrapperCol={{ span: 20 }}
                        >
                            <Form.Item
                                label="Name"
                                name="name"
                                initialValue={game.name}
                                rules={[{ required: true, message: 'Name is required' }]}
                            >
                                <Input />
                            </Form.Item>

                            <Form.Item
                                label="Description"
                                name="description"
                                initialValue={game.description}
                                rules={[{ required: false }]}
                            >
                                <Input />
                            </Form.Item>



                            <Form.Item wrapperCol={{ offset: 4, span: 20 }}>
                                <Button type="primary" htmlType="submit" disabled={saveGameLoading}>Save</Button> { saveGameLoading ? <Spin /> : <></> }
                            </Form.Item>
                        </Form>
                    </Card>

                    <br />

                    <Card>
                        <PageHeader title="Cards" extra={<Button onClick={bulkEdit}>Bulk edit</Button>} />

                        <CardBulkEdit 
                            onUpdate={handleBulkEdit}
                            visible={bulkVisible}
                            setVisible={setBulkVisible}
                            init={(setValue) => { setValue(bulkValue) }} />

                        <CardListAdmin cards={cards} updateCard={updateCard} />

                        <br />

                        <div className="buttons-container flex-end">
                            <Button type="dashed" onClick={handleAddCard} disabled={saveCardsLoading}>Add card</Button>
                            <Button type="primary" onClick={saveCards} disabled={editedCards.length === 0 || saveCardsLoading}>Save cards</Button>
                        </div>
                    </Card>
                </Layout.Content>
            ) : <Spin />}
            
        </Layout>
    )
}