import { BlockService } from "../BlockService/BlockService";
import { LastBlockService } from "../LastBlockService/LastBlockService";

interface IAddressMoreChange {
    getAddressMoreChange: () => Promise<ResponceAddressMoreChangeService>
}

type ResponceAddressMoreChangeService = {
    wallet: string
    value: string
}

export class AddressMoreChangeService implements IAddressMoreChange {

    private _lastBlockService: LastBlockService;
    private _blockService: BlockService;

    constructor() {
        this._lastBlockService = new LastBlockService();
        this._blockService = new BlockService();
    };

    async getAddressMoreChange(): Promise<ResponceAddressMoreChangeService> {
        const walletList: {[key: string]: string} = {};
        
        const lastBlock = (await this._lastBlockService.getLastBlock()).result;
        
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
                return new Promise((resolve, reject) => {
                    resolve({
                        wallet: wallet, 
                        value: walletList[wallet]
                    } as ResponceAddressMoreChangeService)
                });
            }
        }
    }
    

    private _convertNumber(hexNumber: string | number, deegree: number = 16): number | string {
        if (typeof hexNumber === 'number') {
            return `0x${hexNumber.toString(deegree)}`;
        }
        return parseInt(hexNumber, deegree);
    }
}