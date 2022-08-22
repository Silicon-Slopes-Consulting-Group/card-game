import { AxiosError } from "axios";
import { FormEvent, useCallback, useContext, useEffect, useState } from "react"
import { Link } from "react-router-dom";
import Icon from "@cfstcyr/react-icon";
import { SessionContext } from "../../contexts/session-context"
import { PageLayout } from "../page-layout/page-layout";

interface LoginPageProp {
    action: 'login' | 'signup';
}

export function LoginPage({ action }: LoginPageProp) {
    const { login, signup } = useContext(SessionContext)!;
    const [loading, setLoading] = useState<boolean>(false);
    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [errorMessage, setErrorMessage] = useState<string | undefined>();

    useEffect(() => {
        setErrorMessage(undefined);
    }, [email, password]);

    const onSubmit = useCallback((e: FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setErrorMessage(undefined);

        (action === 'login' ? login : signup)(email, password)
            .catch((error: AxiosError<{ message: string }>) => {
                setErrorMessage(error.response?.data.message ?? 'Error');
            })
            .finally(() => {
                setLoading(false);
            });
    }, [action, email, login, password, signup]);
    
    return (
        <PageLayout id="login-page">
            <h1>{ action === 'login' ? 'Login' : 'Sign up' }</h1>
            <form onSubmit={onSubmit}>
                <div className="input-field">
                    <label htmlFor="email">Email</label>
                    <input type="email" placeholder="Email" id="email" required value={email} onChange={(e) => setEmail(e.target.value)} />
                </div>
                <div className="input-field">
                    <label htmlFor="password">Password</label>
                    <input type="password" placeholder="Password" id="password" required value={password} onChange={(e) => setPassword(e.target.value)} />
                </div>

                <p className="error-message">{errorMessage}</p>

                <div className="actions">
                    {
                        action === 'login'
                            ? <Link to='/signup'>Sign up</Link>
                            : <Link to='/login'>Login</Link>
                    }
                    <button type="submit" className="game-btn">{
                        loading
                            ? <Icon icon='spinner-third' animation='spin' />
                            : action === 'login'
                                ? 'Login'
                                : 'Sign up'
                    }</button>
                </div>
            </form>
        </PageLayout>
    )
}