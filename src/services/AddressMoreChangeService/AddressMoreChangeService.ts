import { IAddressMoreChange, ResponceAddressMoreChangeService } from "src/types/types";
import { BlockService } from "../BlockService/BlockService";
export class AddressMoreChangeService implements IAddressMoreChange {

    private _blockService: BlockService;

    constructor() {
        this._blockService = new BlockService();
    };

    async getAddressMoreChange(): Promise<ResponceAddressMoreChangeService> {
        const walletList: {[key: string]: string} = {};
        
        const lastBlock = (await this._blockService.getLastBlock()).result;
        
        const endItteration = +this._convertNumber(lastBlock);
        let startItteration = endItteration - 100;

        
        while (startItteration <= endItteration) {
            const hexStartItteration = this._convertNumber(startItteration) as string;
            const { result } = await this._blockService.getBlockById(hexStartItteration);
            
            if ( result ) {
                result.transactions.forEach(item => 
                    walletList[item.to] = item.value);
            }

            startItteration++;
        }

        const sortResultValue = Object.values(walletList).sort((a: string, b: string) => 
            (+this._convertNumber(b)) - (+this._convertNumber(a))
        );

        for (let wallet in walletList) {
            if ( walletList[wallet] === sortResultValue[0] ) {
                return {
                        wallet: wallet, 
                        value: walletList[wallet]
                    } as ResponceAddressMoreChangeService;
            };
        }
    }

    private _convertNumber(hexNumber: string | number, deegree: number = 16): number | string {
        if (typeof hexNumber === 'number') {
            return `0x${hexNumber.toString(deegree)}`;
        }
        return parseInt(hexNumber, deegree);
    }
}