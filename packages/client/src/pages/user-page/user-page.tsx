import { useContext } from "react"
import Icon from "@cfstcyr/react-icon";
import { SessionContext } from "../../contexts/session-context"
import { PageLayout } from "../page-layout/page-layout";

export function UserPage() {
    const { user, logout, deleteCardFromFavorite } = useContext(SessionContext)!;

    return (
        <PageLayout id="user-page">
            <h1>{ user?.email }</h1>
            <button className="game-btn" onClick={logout}>Logout</button>
            <hr style={{ width: '100%', opacity: 0.1 }} />
            <h2>Favorite cards</h2>
            <div className="favorites-cards-list">
                {
                    user?.favoriteList.map((card) => (
                        <div className="card-list" key={card._id}>
                            <p className="content">{card.content}</p>
                            <p className="content2">{card.content2}</p>
                            <p style={{ cursor: 'pointer' }} onClick={() => deleteCardFromFavorite(card._id)}><Icon icon="star" styling="solid" /></p>
                        </div>
                    ))
                }
            </div>
        </PageLayout>
    );
}