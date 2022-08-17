import { DetailedHTMLProps, HTMLAttributes, ReactNode } from "react";
import { Link, LinkProps } from "react-router-dom";
import { IconRender, IconType } from "../../components/Icon";
import { LoadingPage } from "../loading-page/loading-page";

interface BasePageLayoutAction extends DetailedHTMLProps<HTMLAttributes<HTMLElement>, HTMLElement> {
    to?: string;
}
interface TextPageLayoutAction {
    content: ReactNode;
}
interface IconPageLayoutAction {
    icon: IconType;
}
export type PageLayoutAction = BasePageLayoutAction & (TextPageLayoutAction | IconPageLayoutAction);
type ContentPageActionPartial = Partial<BasePageLayoutAction & TextPageLayoutAction & IconPageLayoutAction>;

const PageLayoutActionConvert = (action: PageLayoutAction): ContentPageActionPartial => ({ ...action });

export interface PageLayoutProp extends DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement> {
    children: ReactNode;
    actions?: PageLayoutAction[];
    secondaryActions?: PageLayoutAction[];
    hideDefaultHeaderActions?: boolean;
    showHeaderWhileLoading?: boolean;
    loading?: boolean;
    loadingMessage?: string;
}

export function PageLayout({
    children,
    title,
    actions,
    secondaryActions,
    hideDefaultHeaderActions,
    showHeaderWhileLoading,
    loading,
    loadingMessage,
    ...rest }: PageLayoutProp
) {
    const defaultActions: PageLayoutAction[] = [
        {
            to: '/',
            icon: 'arrow-left',
            content: 'Back',
        },
    ];

    const header = (
        <div className="header">
            <div className="left">
                {
                    [...(hideDefaultHeaderActions ? [] : defaultActions), ...(actions ?? [])].map(PageLayoutActionConvert).map(({ to, content, icon, ...rest }) => (
                        to
                            ? <Link { ...rest as LinkProps } to={to} className="game-btn action">{ icon ? <IconRender icon={icon} default={{ styling: 'solid' }} /> : <></> }{ content ?? <></> }</Link>
                            : <div { ...rest as DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement> } className="game-btn action">{ icon ? <IconRender icon={icon} default={{ styling: 'solid' }} /> : <></> }{ content ?? <></> }</div>
                    ))
                }
            </div>
            <div className="right">
                {
                    (secondaryActions ?? []).map(PageLayoutActionConvert).map(({ to, content, icon, ...rest }) => (
                        to
                            ? <Link { ...rest as LinkProps } to={to} className="secondary-action">{ icon ? <IconRender icon={icon} default={{ styling: 'solid' }} /> : <></> }{ content ?? <></> }</Link>
                            : <div { ...rest as DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement> } className="secondary-action">{ icon ? <IconRender icon={icon} default={{ styling: 'solid' }} /> : <></> }{ content ?? <></> }</div>
                    ))
                }
            </div>
        </div>
    );

    return (
        <div { ...rest } className={`page-layout ${rest.className ?? ''}`}>
            { showHeaderWhileLoading ? header : <></> }
            {
                loading
                    ? <LoadingPage message={loadingMessage} />
                    : <>
                        { !showHeaderWhileLoading ? header : <></> }
                        <div className="page-content">{ children }</div>
                    </>
            }
        </div>
    );
}