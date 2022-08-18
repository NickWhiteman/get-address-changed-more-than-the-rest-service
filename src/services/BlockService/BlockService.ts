import request from "request";
import { env } from 'process';
import { 
    BlockType, 
    IBlockService, 
    LastBlockType 
} from "src/types/types";

export class BlockService implements IBlockService {

    async getBlockById(id: string): Promise<BlockType> {
        let result: BlockType;
        request(
            `https://api.etherscan.io/api?module=proxy&action=eth_getBlockByNumber&tag=${id}&boolean=true&apikey=${env.API_KEY}`,
            (err, response) => {
                if (err) console.log({ message: err });

                result = {...JSON.parse(response.body)};
            }
        );
        
        return result;
    }

    async getLastBlock(): Promise<LastBlockType> {
		let result: LastBlockType;
      	request(
			`https://api.etherscan.io/api?module=proxy&action=eth_blockNumber&apikey=${env.API_KEY}`,
			(err, response) => {
				if (err) console.log({ message: err });

				result = {...JSON.parse(response.body)};
			}
		);

		return result;
    }
}
