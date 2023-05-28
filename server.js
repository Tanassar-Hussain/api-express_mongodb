import express from 'express';
import { APP_PORT } from './config';
import routes from './routers'
import errorHandler from './middlewares/errorHandler';

const app = express();
app.use(express.json());
app.use('/api',routes);






app.use(errorHandler);
app.listen(APP_PORT, ()=>console.log(`Listening On Port ${APP_PORT}.`));
