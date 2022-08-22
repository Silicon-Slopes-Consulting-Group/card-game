import { Button, Card, Form, Input, notification, PageHeader, Spin } from "antd";
import React, { useState } from "react";
import { lastValueFrom } from "rxjs";
import { Game } from "common";
import { apiService } from "../../services/api-service";

interface CreateGameProps {
    updateGames: () => Promise<void>;
}

export function CreateGame({ updateGames }: CreateGameProps) {
    const [loading, setLoading] = useState<boolean>(false);
    const [form] = Form.useForm();

    const createGame = (game: Game) => {
        setLoading(true);
        lastValueFrom(apiService.post<Game>('/game', game))
            .then(async (res) => {
                await updateGames();
                form.resetFields();
                notification.success({
                    message: `Game "${game!.name}" created`,
                });
            })
            .catch(error => {
                notification.error({
                    message: 'Error creating game',
                });
                console.log(error);
            })
            .finally(() => {
                setLoading(false);
            });
    }

    return (
        <Card>
            <PageHeader
                title="Create game"
                subTitle="Add a new game to the platform"
            />

            <Form
                form={form}
                labelCol={{ span: 4 }}
                wrapperCol={{ span: 20 }}
                onFinish={createGame}
            >
                <Form.Item
                    label="Name"
                    name="name"
                    rules={[{ required: true, message: 'Name is required' }]}
                >
                    <Input />
                </Form.Item>


                <Form.Item
                    label="Description"
                    name="description"
                    rules={[{ required: false }]}
                >
                    <Input />
                </Form.Item>

                <Form.Item wrapperCol={{ offset: 4, span: 20 }}>
                    <Button type="primary" htmlType="submit" disabled={loading}>Submit</Button> { loading ? <Spin /> : <></> }
                </Form.Item>
            </Form>
        </Card>
    )
}