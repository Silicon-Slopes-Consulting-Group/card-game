import { useContext } from "react"
import { SessionContext } from "../../contexts/session-context"
import { PageLayout } from "../page-layout/page-layout";

export function UserPage() {
    const { user, logout } = useContext(SessionContext)!;

    return (
        <PageLayout id="user-page">
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <h1>{ user?.email }</h1>
                <button className="game-btn" onClick={logout}>Logout</button>
            </div>
        </PageLayout>
    );
}