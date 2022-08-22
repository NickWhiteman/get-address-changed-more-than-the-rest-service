import { expect } from "chai";

import { BlockService } from "src/services/BlockService/BlockService";
import { LastBlockType } from "src/types/types";

describe("BlockServiceTests", () => {
	let block: BlockService;

	beforeEach(() => {
		block = new BlockService();
	});

	it("should method BlockService.getBlockById", async () => {
		const { result }: Pick<LastBlockType, "result"> =
			await block.getLastBlock();

		const resultTesting = await block.getBlockById(result);

		expect(result).to.equals(resultTesting);
	});

	it("should method BlockService.getLastBlock", async () => {
		const { result }: Pick<LastBlockType, "result"> =
			await block.getLastBlock();

		expect('string').to.equals(typeof result);
	});

	it("should method BlockService.getMoreBlockByIds", async () => {
		const ids: string[] = []
		const {result} = await block.getLastBlock();
		const startItteration = +parseInt(result, 16);


        for (let i = startItteration; i >= startItteration - 10; i--) {
            const hexStartItteration = `0x${i.toString(16)}`;

            ids.push(hexStartItteration);
		}
		

		const testingMethod = await block.getMoreBlockByIds(ids);

		expect(ids.length).to.equals(testingMethod.length);
	});
});
