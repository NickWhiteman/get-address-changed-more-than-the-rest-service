import { EvmChain } from "@moralisweb3/common-evm-utils";
import { app, Moralis } from "src";
import { AddressMoreChangeService } from "src/services/AddressMoreChangeService/AddressMoreChangeService";
import { DataBase } from "src/services/DataBase/DataBase";

app.get("/", async (req, res) => {
    try {
        const address = new AddressMoreChangeService();
        const wallet = await address.getAddressMoreChange();

        res.send(wallet);
    } catch (error: unknown) {
        const { message } = error as { message: string };
        console.error(message);
        res.send(message);
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

        for (const meta of response.raw) {
            if (meta.name && meta.symbol) {
                DataBase.connect();
                await DataBase.query(
                    `INSERT INTO public.tokens_erc20(create_data, token_name, token_address) VALUES ($1, $2, $3);`,
                    [+new Date(), meta.name, meta.address]
                );
                DataBase.end();
            }
        }
        res.send(response);
    } catch (error: unknown) {
        const { message } = error as { message: string };
        console.error(message);
        res.send(message);
    }
});
