import { useCallback, useContext, useEffect, useState } from 'react';
import { Link, UNSAFE_NavigationContext, useParams, useSearchParams } from 'react-router-dom';
import { History } from 'history';
import { useSwipeable } from 'react-swipeable';
import { Card, Game } from 'common';
import Icon from "@cfstcyr/react-icon";
import { SessionContext } from '../../contexts/session-context';
import { gameService } from '../../services/game-service';
import { RandomUtils } from '../../utils/random-util';
import { PageLayout, PageLayoutAction } from '../page-layout/page-layout';
import { useBeforeunload } from 'react-beforeunload';

export function GamePage() {
    const navigator = useContext(UNSAFE_NavigationContext).navigator as unknown as History;
    const { id } = useParams();
    const [searchParams] = useSearchParams();
    const { user, addCardToFavorite, deleteCardFromFavorite } = useContext(SessionContext)!;
    const [loading, setLoading] = useState<boolean>(true);
    const [focusMode, setFocusMode] = useState<boolean>(false);
    const [game, setGame] = useState<Game | undefined>();
    const [cards, setCards] = useState<Card[]>([]);
    const [cardIndex, setCardIndex] = useState<number>(0);
    const [favoriteStatus, setFavoriteStatus] = useState<boolean>(false);
    const [primaryActions, setPrimaryActions] = useState<PageLayoutAction[]>([]);
    const [secondaryActions, setSecondaryActions] = useState<PageLayoutAction[]>([]);

    const saveGameSession = useCallback(() => {
        if (game) {
            gameService.addGameSession({
                game: game._id,
                cards: cards.map((card) => card._id),
                index: cardIndex,
                date: new Date(),
            });
        }
    }, [cardIndex, cards, game]);

    useEffect(() => {
        console.log(searchParams.get('useSession'));
    }, [searchParams]);

    useEffect(() => {
        navigator.listen(saveGameSession);
    }, [navigator, saveGameSession]);

    useBeforeunload(saveGameSession);

    useEffect(() => {
        const card = cards[cardIndex];

        const actions: PageLayoutAction[] = [];

        if (user && card && !focusMode) {
            setFavoriteStatus(user.favoriteList.find((c) => c._id === card._id) !== undefined);

            actions.push({
                icon: { icon: 'star', styling: favoriteStatus ? 'solid' : 'regular', style: { color: favoriteStatus ? 'rgb(255, 204, 24)' : 'white' } },
                onClick: favoriteStatus ? () => deleteCardFromFavorite(card._id) : () => addCardToFavorite(card._id),
            });
        }

        actions.push({
            icon: 'expand',
            onClick: () => setFocusMode(mode => !mode),
        });

        setSecondaryActions(actions);

    }, [favoriteStatus, user, cards, cardIndex, deleteCardFromFavorite, addCardToFavorite, focusMode]);

    useEffect(() => {
        setPrimaryActions([
            {
                content: (cardIndex + 1) + '/' + cards.length,
                style: { background: 'none', boxShadow: 'none' },
                className: 'disabled'
            },
        ]);
    }, [cardIndex, cards]);

    useEffect(() => {
        gameService.getGame(id!)
            .then((game) => {
                setGame(game);
                const gameSession = gameService.getGameSessions().find((session) => session.game === game._id);
                if (searchParams.get('useSession') && gameSession) {
                    const cardsMap = new Map(game.cards.map((card) => [card._id, card]));
                    setCards(
                        gameSession.cards
                            .map((cardId) => cardsMap.get(cardId))
                            .filter((card): card is Card => card !== undefined)
                    );
                    setCardIndex(gameSession.index);
                } else {
                    setCards(RandomUtils.randomizeArray(game.cards));
                }
            })
            .catch((error) => {
                console.error(error);
            })
            .finally(() => setLoading(false));
    }, [id, searchParams]);

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
            if (e.key === 'Escape') setFocusMode(mode => !mode);
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
        <PageLayout id='game-page' loading={loading} actions={primaryActions} secondaryActions={secondaryActions} hideDefaultHeaderActions={focusMode}>
            <div className="content" {...handlers}>
                {
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

            {focusMode ? <></> :
                <div className="bottom-bar">
                    <button className="game-btn large no-select" disabled={cardIndex <= 0} onClick={previous}><Icon icon='arrow-left' styling='solid' /></button>
                    <button className="game-btn large no-select" disabled={cardIndex >= cards.length - 1} onClick={next}>Next <Icon icon='arrow-right' styling='solid' /></button>
                </div>
            }
        </PageLayout>
    );
}