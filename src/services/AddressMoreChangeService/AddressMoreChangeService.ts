import { 
    BlockType, IAddressMoreChange, PartiesTransactionsType, 
    ResponceAddressMoreChangeService, Transactions 
} from "src/types/types";
import { BlockService } from "../BlockService/BlockService";

export class AddressMoreChangeService implements IAddressMoreChange {
    private _blockService: BlockService;

    constructor() {
        this._blockService = new BlockService;
    };

    async getAddressMoreChange(): Promise<ResponceAddressMoreChangeService> {
        let resultWallet: ResponceAddressMoreChangeService;
        const ids: string[] = [];
        const lastBlock = (await this._blockService.getLastBlock()).result;        
        const startItteration = +this._convertNumber(lastBlock);

        for (let i = startItteration; i >= startItteration - 100; i--) {
            const hexStartItteration: string = this._convertNumber(i) as string;

            ids.push(hexStartItteration);
        }

        const resultMultipleQueries = await this._blockService.getMoreBlockByIds(ids);
        resultWallet = this._walletFindingLogic(resultMultipleQueries);

        return resultWallet;
    }

    /**
     * @description method of finding the true wallet with the largest amount
     * @param {BlockType[]} results array blocks for maping list wallets and finding amount
     */
    private _walletFindingLogic(results: BlockType[]) {
        let resultWallet: ResponceAddressMoreChangeService;
        const walletList: {[key: string]: number} = {};
        const transactions: Transactions[] = [];
        const partiesTransactions: PartiesTransactionsType[] = [];

        results.map((block: BlockType, index) => {
            transactions.push(...block.result.transactions
                .map((transaction: Transactions) => transaction))
        });

        transactions.map((transaction: Transactions) => {
            partiesTransactions.push({
                from: transaction.from,
                to: transaction.to,
                value: transaction.value
            } as PartiesTransactionsType);
        });

        partiesTransactions.map((parties, index) => {
            Object.keys({
                from: parties.from, 
                to: parties.to}).some((key) => {
                    const indexWalletList = partiesTransactions[index][key] //key wallet 

                    walletList[indexWalletList] += this._behaviorValueForWalletList(parties['value'])[key]
                });
        });

        if ( Object.keys(walletList).length ) {
            const sortResultValue = Object.values(walletList).sort((a: number, b: number) => b - a);

            for (let wallet in walletList) {
                if ( walletList[wallet] === sortResultValue[0] ) {
                    resultWallet = { wallet };
                };
            }
        }

        return resultWallet;
    }
    
    /**
     * @description method converting of the calculus system
     * @param {number} hexNumber type Number @return {string} returning type String and behavior @
     * @param {string} hexNumber type String @return {number} returning type Number
     * @param {number} deegree parameter of the calculus system. Default deegree = 16
     */
    private _convertNumber(hexNumber: string | number, deegree: number = 16): number | string {
        if ( typeof hexNumber === 'number' ) {
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
        return {
            from: -(+this._convertNumber(transactionsValue)),
            to: +this._convertNumber(transactionsValue)
        } as {from: number, to: number}
    }
}