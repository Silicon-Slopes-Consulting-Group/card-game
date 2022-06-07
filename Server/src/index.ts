import 'reflect-metadata';
import 'dotenv/config';
import { container } from 'tsyringe';
import Application from './app';

(async () => {
    const PORT = process.env.PORT || 5000;
    
    const app = container.resolve(Application);

    await app.connect();

    app.app.listen(PORT, () => console.log(`Server up on port ${PORT} (http://127.0.0.1:${PORT})`));
})();