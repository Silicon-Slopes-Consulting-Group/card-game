import { Link } from "react-router-dom";
import { PageLayout } from "../page-layout/page-layout";

export function Error404() {
    return (
        <PageLayout id="page-404">
            <h1>Page not found</h1>
            <p><Link to='/'>Go back home</Link></p>
            
        </PageLayout>
    )
}