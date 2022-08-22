import dotenv from "dotenv";
import express from "express";
import { env } from "process";

import { AddressMoreChangeService } from "./services/AddressMoreChangeService/AddressMoreChangeService";

dotenv.config();
const port = env.PORT;
const app = express();

app.get("/", async (req, res) => {
	const address = new AddressMoreChangeService;
	const wallet = await address.getAddressMoreChange();
	  
	res.send(wallet);
});

app.listen(port, () => console.log(`Running on port ${port}`));