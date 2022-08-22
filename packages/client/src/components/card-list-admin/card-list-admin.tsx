import { Table } from 'antd';
import React from 'react';
import { Card as GameCard } from 'common';
import { components, makeColumns } from '../../utils/editable-row';

import './card-list-admin.css';

type CardItem = GameCard & { key: string };

interface CardListAdminProps {
    cards: CardItem[];
    updateCard: (changes: Partial<CardItem>, card: CardItem) => void
}

export function CardListAdmin({ cards, updateCard }: CardListAdminProps) {
    const defaultColumns = [
        {
            title: 'Content',
            dataIndex: 'content',
            key: 'content',
            editable: true,
            width: '50%',
            required: true,
        },
        {
            title: 'Content 2',
            dataIndex: 'content2',
            key: 'content2',
            editable: true,
            width: '50%',
            required: false,
        },
    ];

    const columns = makeColumns(defaultColumns, updateCard);

    return (
        <>
            <Table 
                pagination={{ hideOnSinglePage: true, pageSize: 200 }}
                components={components} 
                dataSource={cards} 
                columns={columns} 
                rowClassName={() => 'editable-row'} />
        </>
    );
}