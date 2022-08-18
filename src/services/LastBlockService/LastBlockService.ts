import request from "request";
import { env } from 'process';

type LastBlockType = {
	jsonrpc: string;
	id: number;
	result: string;
};

interface ILastBlockService {
  	getLastBlock: () => Promise<LastBlockType>;
}

export class LastBlockService implements ILastBlockService {
  	async getLastBlock(): Promise<LastBlockType> {
    	return new Promise((resolve, reject) => {
      		request(
				`https://api.etherscan.io/api?module=proxy&action=eth_blockNumber&apikey=${env.API_KEY}`,
				(err, response) => {
					if (err) reject({ message: err });

					resolve({...JSON.parse(response.body)});
				}
      		);
    	});
  	}
}
