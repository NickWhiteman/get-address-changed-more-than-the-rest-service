import { 
    BlockType, IAddressMoreChange, PartiesTransactionsType, 
    ResponceAddressMoreChangeService, Transactions 
} from "src/types/types";
import { BlockService } from "../BlockService/BlockService";
export class AddressMoreChangeService implements IAddressMoreChange {
    private _blockService: BlockService;

    constructor() {
        this._blockService = new BlockService();
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
        resultWallet = this._walletSearchLogic(resultMultipleQueries);

        return resultWallet;
    }

    /**
     * @description method of finding the true wallet with the largest amount
     * @param {BlockType[]} results array blocks for maping list wallets and finding amount
     */
    private _walletSearchLogic(results: BlockType[]) {
        let resultWallet: ResponceAddressMoreChangeService;
        const walletList: {[key: string]: number} = {};
        const transactions: Transactions[] = [];
        const partiesTransactions: PartiesTransactionsType[] = [];

        results.forEach((block: BlockType) => {
            transactions.push(...block.result.transactions)
        });

        // so fast working endpoint
        transactions.forEach((transaction: Transactions, index) => {
            partiesTransactions.push({
                from: transactions[index].from,
                to: transactions[index].to,
                value: transactions[index].value
            });
        });

        // i don't know how to do better 60-62
        partiesTransactions.forEach((parties, index) => {
            Object.keys({
                from: parties.from, 
                to: parties.to}).some((key) => {
                    walletList[partiesTransactions[index][key]] = key === 'from'
                        ? -this._convertNumber(partiesTransactions[index].value)
                        : +this._convertNumber(partiesTransactions[index].value)
                });
        });

        if ( walletList ) {
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
     * @param {number} hexNumber type Number @return {string} returning type String = '0x012abc' and behavior @
     * @param {string} hexNumber type String @return {number} returning type Number = 10
     * @param {number} deegree parameter of the calculus system. Default deegree = 16
     */
    private _convertNumber(hexNumber: string | number, deegree: number = 16): number | string {
        if (typeof hexNumber === 'number') {
            return `0x${hexNumber.toString(deegree)}`;
        }
        return parseInt(hexNumber, deegree);
    }
}