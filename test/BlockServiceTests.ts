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

		const resultTesting = await block.getLastBlock();

		expect(result).to.equals(resultTesting);
	});

	it("should method BlockService.getLastBlock", async () => {
		const { result }: Pick<LastBlockType, "result"> =
		await block.getLastBlock();

		const resultTesting = await block.getLastBlock();

		expect(result).to.equals(resultTesting);
	});
});
