import express from 'express'
import { env } from 'process';
import dotenv from 'dotenv'
import bodyParser from 'body-parser'

import { AddressMoreChangeService } from './services/AddressMoreChangeService/AddressMoreChangeService';

dotenv.config();
const port = env.PORT;
const app = express();

app.use(bodyParser.json());


app.get('/', async (req, res) => {
  const address = new AddressMoreChangeService();
  const {wallet, value} = await address.getAddressMoreChange();
  res.send(`solution : { wallet: ${wallet} value: ${value} }`);
})

app.listen(port, () => console.log(`Running on port ${port}`));