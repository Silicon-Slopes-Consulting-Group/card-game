import ErrorStackParser from 'error-stack-parser';
import express from 'express';
import { getReasonPhrase, StatusCodes } from 'http-status-codes';
import HttpException from '../classes/http-exception';
import ProcessUtils from './process';

const errorHandler = (
    err: HttpException | Error,
    req: express.Request,
    res: express.Response,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    next: express.NextFunction
) => {
    let stack = '';
    if (err instanceof HttpException) {
        res.status(err.status);
    } else {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR);
    }

    if (ProcessUtils.isDevelopment()) {
        console.log(err);

        stack = `
            <div class="code">
                ${ErrorStackParser.parse(err).map((item, index) => `
                    <p>
                        <span class="line-number">${index}</span>
                        <span>at ${item.functionName ? `<span class="function">${item.functionName}</span> ` : ''}${item.functionName && item.fileName ? 'in ': ''} <span class="filename">${item.fileName}</span></span>
                    </p>
                `).join('')}
            </div>
        `;
    }

    const html = `
        <!DOCTYPE html>
        <html>
            <head>
                <style>
                    html, body {
                        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
                        background: #f2f2f2;
                        height: 100%;
                    }
                    body {
                        display: flex;
                        justify-content: center;
                        align-items: center;
                    }
                    .content {
                        max-width: 750px;
                        width: 100%;
                    }
                    h1 {
                        font-size: 4em;
                        margin: 0;
                    }
                    h2 {
                        font-size: 2.5em;
                        margin: 0;
                    }
                    h3 {
                        opacity: 0.55;
                    }
                    div.code {
                        width: 100%;
                        overflow-x: auto;
                        white-space: nowrap;
                    }
                    div.code p {
                        margin: 0;
                        font-family: 'Andalé Mono', 'Courier New', Courier, monospace;
                    }
                    div.code p span.line-number {
                        opacity: 0.2;
                    }
                    div.code p span.function {
                        font-weight: 600;
                        color: rgb(97, 175, 239);
                    }
                    div.code p span.filename {
                        color: rgb(103, 103, 103);
                    }
                    div.code p:not(:first-child) span.line-number {
                        margin-right: 24px;
                    }
                    table {
                        border-collapse: collapse;
                    }
                    td, th {
                        border: 1px solid #dddddd;
                        text-align: left;
                        padding: 8px;
                    }
                    td:first-child {
                        background: rgb(230, 230, 230);
                    }
                </style>
            </head>
            <body>
                <div class="content">
                    <h1>Error ${res.statusCode}</h1>
                    <h2>${getReasonPhrase(res.statusCode)}</h2>
                    <h3>${err.message}</h3>
                    <table>
                        <tr>
                            <td>Method</td>
                            <td>${req.method}</td>
                        </tr>
                        <tr>
                            <td>Path</td>
                            <td><code>${req.path}</code></td>
                        </tr>
                        <tr>
                            <td>Route</td>
                            <td><code>${req.route.path}</code></td>
                        </tr>
                    </table>
                    <br>
                    ${stack}
                </div>
            </body>
        </html>
    `;

    res.format({
        html: () => res.send(html),
        json: () => {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const json: any = {
                status: res.statusCode,
                message: err.message,
            };

            if (ProcessUtils.isDevelopment()) json.stack = err.stack;

            res.send(json);
        }
    });
};

export default errorHandler;