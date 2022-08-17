import { useContext } from "react";
import { Navigate } from "react-router-dom";
import { SessionContext } from "../contexts/session-context";

type RouteResolve = string | JSX.Element;

export interface PublicRouteProps {
    resolve: RouteResolve;
    redirect: RouteResolve;
};

export default function PrivateRoute({ resolve, redirect }: PublicRouteProps) {
    const { user } = useContext(SessionContext)!;

    const resolveRoute = (el: RouteResolve) => {
        if (typeof el === 'string') return <Navigate to={el} />
        else return el;
    }

    if (user) {
        return resolveRoute(resolve);
    } else {
        return resolveRoute(redirect);
    }
};