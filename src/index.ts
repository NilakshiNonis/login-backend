import * as dotenv from 'dotenv'
import {userApisRoutes} from '../src/routes/user.routes'
import express from 'express';
import bodyParser from 'body-parser'
import cors from 'cors'
import sequelize from './clients/sequelize';


dotenv.config()

const app = express();
const PORT = process.env.PORT || 3000;

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

app.use(cors())
app.use('/user', userApisRoutes);

(async () => {
  await sequelize.sync({force: true});
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});