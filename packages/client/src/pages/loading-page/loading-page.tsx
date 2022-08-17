import { Spin } from "antd";

export interface LoadingPageProp {
    message?: string;
}

export function LoadingPage({ message }: LoadingPageProp) {
    return (
        <div className="loading-page">
            <Spin />
            <p className="loading-message">{ message }</p>
        </div>
    );
}