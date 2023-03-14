import dotenv from "dotenv";
import express from "express";
import { env } from "process";
import * as moralis from "moralis";
import { EvmChain } from "@moralisweb3/common-evm-utils";

import { AddressMoreChangeService } from "./services/AddressMoreChangeService/AddressMoreChangeService";

dotenv.config();
const port = env.PORT;
const app = express();
const Moralis = moralis.default;

const MORALIS_API_KEY = env.MORALIS_API_KEY!;

app.get("/", async (req, res) => {
    try {
        const address = new AddressMoreChangeService();
        const wallet = await address.getAddressMoreChange();

        res.send(wallet);
    } catch (error: unknown) {
        const { message } = error as { message: string };
        console.error(message);
    }
});

app.get("/isToken", async (req, res) => {
    try {
        const address = new AddressMoreChangeService();
        const wallets = await address.getAddressMoreChange();
        const response = await Moralis.EvmApi.token.getTokenMetadata({
            addresses: Object.keys(wallets),
            chain: EvmChain.ETHEREUM,
        });
        res.send(response);
    } catch (error: unknown) {
        const { message } = error as { message: string };
        console.error(message);
    }
});

const startServer = async () => {
    await Moralis.start({
        apiKey: MORALIS_API_KEY,
        formatEvmChainId: +EvmChain.ETHEREUM,
    });

    app.listen(port, () => console.log(`Running on port ${port}`));
};

startServer();
