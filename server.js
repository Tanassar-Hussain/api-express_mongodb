import express from 'express';
import { APP_PORT, DB_URL } from './config';
import routes from './routers'
import errorHandler from './middlewares/errorHandler';
import mongoose from 'mongoose';

const app = express();

// Database Connection
mongoose.connect(DB_URL);
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error'));
db.once('open', ()=>{
    console.log('DB Connected...');
})
app.use(express.json());
app.use('/api',routes);






app.use(errorHandler);
app.listen(APP_PORT, ()=>console.log(`Listening On Port ${APP_PORT}.`));
