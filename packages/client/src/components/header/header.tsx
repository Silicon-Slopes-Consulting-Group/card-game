import { Layout } from "antd";
import classNames from "classnames";
import React from "react";
import { Link } from "react-router-dom";
import './header.css';

interface HeaderProps {
    large?: boolean;
}

export function Header({ large }: HeaderProps) {
    return (
        <Layout.Header className={classNames({ large })} style={{ paddingRight: 0, paddingLeft: 0 }}>
            <div className="content responsive">
                <Link to='/'>
                    <div className="logo">
                        Card Game
                    </div>
                </Link>
            </div>
        </Layout.Header>
    )
}