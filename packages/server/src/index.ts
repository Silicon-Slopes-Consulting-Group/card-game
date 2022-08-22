import 'reflect-metadata';
import 'dotenv/config';
import { container } from 'tsyringe';
import Application from './app';
import { getVariable, verifyVariables } from './utils/environement';
import { CommonVar } from 'common';

console.log(CommonVar);

(async () => {
    verifyVariables();

    const PORT = getVariable('PORT');
    
    const app = container.resolve(Application);

    await app.connect();

    app.app.listen(PORT, () => console.log(`Server up on port ${PORT} (http://127.0.0.1:${PORT})`));
})();