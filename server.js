import express from 'express';
import { APP_PORT } from './config';
import routes from './routers'

const app = express();
app.use('/api',routes);

app.listen(APP_PORT, ()=>console.log(`Listening On Port ${APP_PORT}.`));
