import React from "react";
import classNames from 'classnames';
import { PlayingCard } from "../../classes/card";

import './card.css';

interface CardProps {
    card: PlayingCard;
    playCard?: (card: PlayingCard) => void;
    onMouseDown?: (event: React.MouseEvent, card: PlayingCard) => void;
}

export function Card({ card, playCard, onMouseDown }: CardProps) {
    const style = {
        '--game-card-color-1': card.color,
        '--game-card-color-2': card.color2,
    } as React.CSSProperties;

    return (
        <div
            className={classNames({ 'game-card': true, played: card.played, [`type-${card.type}`]: true })} 
            key={card._id} 
            onClick={playCard ? () => playCard(card) : undefined}
            style={style}
            onMouseDown={onMouseDown ? (e) => onMouseDown(e, card) : undefined}
        >
            <p className="content">{card.content}</p>
            <p className="content2">{card.content2}</p>
        </div>
    )
};