import React, { useCallback, useEffect, useState } from "react"
import { Link, useParams } from "react-router-dom"
import { Game } from "../../classes/game";
import api from "../../services/api-service";
import { RandomUtils } from "../../utils/random-util";
import { PlayingCard } from "../../classes/card";
import { Card } from "../../components/card/card";
import classNames from 'classnames';

import './game-page.css';
import Icon from "../../components/Icon";
import { Spin } from "antd";

const PLAY_CARD_BREAKPOINT = 0.35;
const BACKGROUND_COUNT = 15;

export function GamePage() {
    const [game, setGame] = useState<Game | undefined>();
    const [cards, setCards] = useState<PlayingCard[]>([]);
    const [cardDragTarget, setCardDragTarget] = useState<HTMLDivElement | undefined>();
    const [offset, setOffset] = useState<{ x: number, y: number}>({ x: 0, y: 0 });
    const [hasNext, setHasNext] = useState<boolean>(false);
    const [hasPrevious, setHasPrevious] = useState<boolean>(false);
    const [background] = useState<number>(Math.floor(Math.random() * BACKGROUND_COUNT) + 1);
    const { id } = useParams();

    useEffect(() => {
        api.get<Game>(`/game/${id}`)
            .then((res) => {
                setGame(res.data)
                setCards(RandomUtils.randomizeArray(res.data.cards));
                if (res.data.cards.length > 0) setHasNext(true);
            })
            .catch(console.error);
    }, [id]);

    const willBePlayed = (e: MouseEvent, offset: { x: number, y: number }) => {
        return (window.innerWidth / 2 - Math.abs(e.clientX - offset.x)) / window.innerWidth * 2 < PLAY_CARD_BREAKPOINT;
    }

    const play = (card: HTMLElement, direction: 'left' | 'right' = 'right') => {
        card.classList.add('played');
        card.classList.add(`played-${direction}`);
        setHasPrevious(true);

        const gameCards: HTMLElement[] = Array.from(document.getElementsByClassName('game-card')) as HTMLElement[];
        const nonPlayedCards = gameCards.filter((card) => !card.classList.contains('played'))
        if (nonPlayedCards.length === 0) setHasNext(false);
    }

    const unplayPrevious = () => {
        const gameCards: HTMLElement[] = Array.from(document.getElementsByClassName('game-card')) as HTMLElement[];
        const playedCards = gameCards.filter((card) => card.classList.contains('played'));
        const card = playedCards.shift();

        if (playedCards.length === 0) setHasPrevious(false);

        if (card) {
            card.classList.remove('will-be-played');
            card.classList.remove('played');
            card.classList.remove('played-right');
            card.classList.remove('played-left');
        }
    }
    const playNext = () => {
        const gameCards: HTMLElement[] = Array.from(document.getElementsByClassName('game-card')) as HTMLElement[];
        const card = gameCards.filter((card) => !card.classList.contains('played')).pop();

        if (card) play(card);
    }


    useEffect(() => {
        const onKeyup = (e: KeyboardEvent) => {
            if (e.key === 'ArrowRight') playNext();
            if (e.key === 'ArrowLeft') unplayPrevious();
            if (e.key === ' ') playNext();
        }
        window.addEventListener('keyup', onKeyup);

        return () => window.removeEventListener('keyup', onKeyup);
    }, []);

    const onDrag = useCallback((e: MouseEvent) => {
        if (cardDragTarget) {
            const diffX = e.clientX - offset.x;
            const diffY = e.clientY - offset.y;

            cardDragTarget.style.marginLeft = `${diffX}px`;
            cardDragTarget.style.marginTop = `${diffY}px`;
            cardDragTarget.style.transform = `translate(-50%, -50%) rotate(${diffX * 0.02 + diffY * 0.015}deg)`;
            
            if (willBePlayed(e, offset)) cardDragTarget.classList.add('will-be-played');
            else cardDragTarget.classList.remove('will-be-played');
        }
    }, [cardDragTarget, offset]);

    const endDrag = useCallback((e: MouseEvent) => {
        setOffset({ x: 0, y:0 });
        if (cardDragTarget) {
            cardDragTarget.style.marginLeft = '0px';
            cardDragTarget.style.marginTop = '0px';
            cardDragTarget.style.transform = `translate(-50%, -50%)`;
            cardDragTarget.classList.remove('dragging');

            if (willBePlayed(e, offset)) {
                play(cardDragTarget, e.clientX - offset.x > 0 ? 'right' : 'left');
            }
        }
        setCardDragTarget(undefined);
    }, [cardDragTarget, offset]);

    useEffect(() => {
        window.addEventListener('mousemove', onDrag);
        window.addEventListener('mouseup', endDrag);

        return () => {
            window.removeEventListener('mousemove', onDrag);
            window.removeEventListener('mouseup', endDrag);
        }
    }, [endDrag, onDrag]);

    const onCardDragStart = (event: React.MouseEvent) => {
        setOffset({ x: event.clientX, y: event.clientY });
        setCardDragTarget(event.currentTarget as HTMLDivElement);
        event.currentTarget.classList.add('dragging');
    }

    return (
        <div id="game-view" className={`bg-${background}`}>
            <Link to='/' className="back-btn"><Icon icon="arrow-left" /> Back</Link>

            <p className="bottom-btns">
                <span className={classNames({ 'previous-btn btn': true, disabled: !hasPrevious })} onClick={unplayPrevious}><Icon icon="arrow-left" /></span>
                <span className={classNames({ 'next-btn btn': true, disabled: !hasNext })} onClick={playNext}>Next <Icon icon="arrow-right" /></span>
            </p>
            
            { game ? (
                <div id="card-container">
                    <p className="no-card">No more cards<br /><Link to='/'>Go home</Link></p>
                    {cards.map((card) => <Card card={card}  key={card._id} onMouseDown={onCardDragStart} />)}
                </div>
            ) : (
                <>
                    <Spin />
                </>
            )
            }
        </div>
    )
}