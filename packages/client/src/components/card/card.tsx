import React from "react";
import classNames from 'classnames';
import { Card as ICard } from "common";

import './card.css';

interface CardProps {
    card: ICard;
    playCard?: (card: ICard) => void;
    onMouseDown?: (event: React.MouseEvent, card: ICard) => void;
}

export function Card({ card, playCard, onMouseDown }: CardProps) {
    return (
        <div
            className={classNames({ 'game-card': true })} 
            key={card._id} 
            onClick={playCard ? () => playCard(card) : undefined}
            onMouseDown={onMouseDown ? (e) => onMouseDown(e, card) : undefined}
        >
            <p className="content">{card.content}</p>
            <p className="content2">{card.content2}</p>
        </div>
    )
};