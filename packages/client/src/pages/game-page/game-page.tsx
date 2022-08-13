import { Spin } from 'antd';
import { useCallback, useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useSwipeable } from 'react-swipeable';
import { PlayingCard } from '../../classes/card';
import Icon from '../../components/Icon';
import { gameService } from '../../services/game-service';
import { RandomUtils } from '../../utils/random-util';

export function GamePage() {
    const { id } = useParams();
    const [loading, setLoading] = useState<boolean>(true);
    const [cards, setCards] = useState<PlayingCard[]>([]);
    const [cardIndex, setCardIndex] = useState<number>(0);

    useEffect(() => {
        gameService.getGame(id!)
            .then((game) => {
                setCards(RandomUtils.randomizeArray(game.cards));
            })
            .catch((error) => {
                console.error(error);
            })
            .finally(() => setLoading(false));
    }, [cardIndex, id]);

    const next = useCallback(() => {
        setCardIndex((index) => index < cards.length - 1 ? index + 1 : index);
    }, [cards.length]);

    const previous = useCallback(() => {
        setCardIndex((index) => index > 0 ? index - 1 : index);
    }, []);

    useEffect(() => {
        const onKeyup = (e: KeyboardEvent) => {
            if (e.key === 'ArrowRight') next();
            if (e.key === 'ArrowLeft') previous();
            if (e.key === ' ') next();
        }
        window.addEventListener('keyup', onKeyup);

        return () => window.removeEventListener('keyup', onKeyup);
    }, [next, previous]);

    useEffect(() => {
        document.body.classList.add('no-scroll');
        return () => {
            document.body.classList.remove('no-scroll');
        }
    }, []);

    const handlers = useSwipeable({
        onSwipedLeft: next,
        onSwipedRight: previous,
        swipeDuration: 250,
    });

    return (
        <div id="game-page" className="game-page safe">
            <div className="top-bar">
                <Link to={'/'} className="game-btn no-select"><Icon icon='arrow-left' styling='solid' /> Back</Link>
            </div>
            <div className="content" {...handlers}>
                {
                    loading ? (
                        <Spin />
                    ) : 
                    (cards.length <= 0) ? (
                        <div className='game-end'>
                            <p>No cards</p>
                            <p><Link to={'/'}>Go to game list</Link></p>
                        </div>
                    ) : (
                        <div className='game-cards'>
                            {
                                cards
                                    .map((card, index) => ({ card, index }))
                                    .slice(Math.max(0, cardIndex - 1), Math.min(cards.length, cardIndex + 2))
                                    .map(({card, index}) => (
                                        <div className={`game-card ${index > cardIndex ? 'next' : (index < cardIndex ? 'previous' : 'current')}`} key={card._id}>
                                            <p className='game-card-content'>{card.content}</p>
                                            <p className='game-card-content2'>{card.content2}</p>
                                        </div>
                                    ))
                            }
                        </div>
                    )
                }
            </div>
            <div className="bottom-bar">
                <button className="game-btn large no-select" disabled={cardIndex <= 0} onClick={previous}><Icon icon='arrow-left' styling='solid' /></button>
                <button className="game-btn large no-select" disabled={cardIndex >= cards.length - 1} onClick={next}>Next <Icon icon='arrow-right' styling='solid' /></button>
            </div>
        </div>
    )
}