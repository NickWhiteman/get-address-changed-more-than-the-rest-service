import dotenv from "dotenv";
import express from "express";
import { env } from "process";
import * as moralis from "moralis";
import { EvmChain } from "@moralisweb3/common-evm-utils";

import { AddressMoreChangeService } from "./services/AddressMoreChangeService/AddressMoreChangeService";
import { DataBase } from "./services/DataBase/DataBase";

dotenv.config();
const port = env.PORT;
export const app = express();
export const Moralis = moralis.default;

const MORALIS_API_KEY = env.MORALIS_API_KEY!;

const startServer = async () => {
    await Moralis.start({
        apiKey: MORALIS_API_KEY,
        formatEvmChainId: +EvmChain.ETHEREUM,
    });

    app.listen(port, () => console.log(`Running on port ${port}`));
};

startServer();
