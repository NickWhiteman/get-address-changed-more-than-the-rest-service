import { 
    BlockType, IAddressMoreChange, PartiesTransactionsType, 
    ResponceAddressMoreChangeService, Transactions, WalletListType 
} from "src/types/types";
import { BlockService } from "../BlockService/BlockService";

export class AddressMoreChangeService implements IAddressMoreChange {
    private _blockService: BlockService;

    constructor() {
        this._blockService = new BlockService;
    };

    async getAddressMoreChange(): Promise<ResponceAddressMoreChangeService> {
        const ids: string[] = [];
        let resultWallet: ResponceAddressMoreChangeService;
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
        let partiesTransactions: PartiesTransactionsType[] = [];

        for (let block of results) {
            const { transactions } = block.result;
            partiesTransactions.push(...this._transactionMapper(transactions));
        }
        
        const walletList: WalletListType = this._walletListMapper(partiesTransactions);

        if ( walletList ) {
            resultWallet = this._findingWallet(walletList);
        }

        return resultWallet;
    }

    private _walletListMapper(partiesTransactions: PartiesTransactionsType[]): WalletListType {
        const walletList: WalletListType = {};

        const walletListFiller = (parties: PartiesTransactionsType) => {
            for (let side in ['from', 'to']) {
                const indexWalletList = parties[side]; 

                walletList[indexWalletList] += this._behaviorValueForWalletList(parties['value'])[side]
            }
        };

        for (let parties of partiesTransactions) {
            walletListFiller(parties);
        }

        return walletList;
    }

    private _findingWallet(walletList: WalletListType): ResponceAddressMoreChangeService {
        const sortResultValue = Object.values(walletList).sort((a: number, b: number) => b - a);

        for(let wallet in walletList) {
            if ( walletList[wallet] === sortResultValue[0] ) {
                return { wallet };
            }
        }
    }

    private _transactionMapper(transactions: Transactions[]): PartiesTransactionsType[] {
        const partiesTransactions: PartiesTransactionsType[] = [];

        for (let transaction of transactions) {
            console.log('transaction', transaction);
            
            partiesTransactions.push({
                from: transaction.from,
                to: transaction.to,
                value: transaction.value
            })
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