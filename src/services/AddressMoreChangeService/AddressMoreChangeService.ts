import { parseEther } from "ethers";
import {
    BlockType,
    IAddressMoreChange,
    PartiesTransactionsType,
    ResponseAddressMoreChangeService,
    Transactions,
    WalletListType,
} from "src/types/types";
import { BlockService } from "../BlockService/BlockService";

export class AddressMoreChangeService implements IAddressMoreChange {
    private _blockService: BlockService;

    constructor() {
        this._blockService = new BlockService();
    }

    async getAddressMoreChange(): Promise<ResponseAddressMoreChangeService> {
        try {
            const ids: string[] = [];
            let resultWallet: ResponseAddressMoreChangeService;
            const lastBlock = (await this._blockService.getLastBlock()).result;
            const startItteration = +lastBlock;

            for (let i = startItteration; i >= startItteration - 100; i--) {
                const hexStartItteration: string = this._convertNumber(i) as string;

                ids.push(hexStartItteration);
            }

            if (ids.length === 0) {
                throw new Error("Ids is empty array");
            }

            const resultMultipleQueries = await this._blockService.getMoreBlockByIds(ids);
            resultWallet = this._walletFindingLogic(resultMultipleQueries);

            return resultWallet;
        } catch (error: unknown) {
            const { message } = error as { message: string };
            console.error(message);
        }
    }

    /**
     * @description method of finding the true wallet with the largest amount
     * @param {BlockType[]} results array blocks for maping list wallets and finding amount
     */
    private _walletFindingLogic(results: BlockType[]) {
        let resultWallet: ResponseAddressMoreChangeService;
        let partiesTransactions: PartiesTransactionsType[] = [];

        for (let block of results) {
            const { transactions } =
                typeof block.result === "string" ? { transactions: [] as Transactions[] } : block.result;
            partiesTransactions.push(...this._transactionMapper(transactions));
        }

        const walletList: WalletListType = this._walletListMapper(partiesTransactions);

        if (walletList) {
            resultWallet = this._findingWallet(walletList);
        }

        return resultWallet;
    }

    private _walletListMapper(partiesTransactions: PartiesTransactionsType[]): WalletListType {
        const walletList: WalletListType = {};

        const walletListFiller = (parties: PartiesTransactionsType) => {
            for (const side of ["from", "to"]) {
                const indexWalletList: string = parties[side];

                if (!walletList[indexWalletList]) {
                    walletList[indexWalletList] = 0;
                }

                const amountTransactions: number = this._behaviorValueForWalletList(parties.value)[side];
                walletList[indexWalletList] += amountTransactions;
            }
        };

        for (const parties of partiesTransactions) {
            walletListFiller(parties);
        }

        return walletList;
    }

    private _findingWallet(walletList: WalletListType): ResponseAddressMoreChangeService {
        const sortResultValue = Object.values(walletList).sort((a: number, b: number) => b - a);
        console.log("_findingWallet sortResultValue => ", sortResultValue[0]);

        for (const wallet in walletList) {
            if (walletList[wallet] === sortResultValue[0]) {
                return { wallet };
            }
        }
    }

    private _transactionMapper(transactions: Transactions[]): PartiesTransactionsType[] {
        const partiesTransactions: PartiesTransactionsType[] = [];
        // console.log("_transactionMapper => ", transactions);

        if (!transactions.length) {
            return partiesTransactions;
        }

        for (const transaction of transactions) {
            partiesTransactions.push({
                from: transaction.from,
                to: transaction.to,
                value: transaction.value,
            });
        }

        return partiesTransactions;
    }

    /**
     * @description method converting of the calculus system
     * @param {number} hexNumber type Number @return {string} returning type String and behavior @
     * @param {string} hexNumber type String @return {number} returning type Number
     * @param {number} deegree parameter of the calculus system. Default deegree = 16
     */
    private _convertNumber(hexNumber: string | number, deegree: number = 16): number | string {
        if (typeof hexNumber === "number") {
            return `0x${hexNumber.toString(deegree)}`;
        }
        return parseInt(hexNumber, deegree);
    }

    /**
     * @description Bike for operation with amounts
     * @param {string} transactionsValue converting value for walletList
     * @returns
     */
    private _behaviorValueForWalletList(transactionsValue: string) {
        const result: { from: number; to: number } = {
            from: -this._convertNumber(transactionsValue),
            to: +this._convertNumber(transactionsValue),
        };
        // console.log(result);
        return result;
    }
}
