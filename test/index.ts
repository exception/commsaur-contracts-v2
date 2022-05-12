import { expect } from "chai";
import { ethers } from "hardhat";
// eslint-disable-next-line node/no-missing-import
import { Commsaur, CommsaurPFP } from "../typechain";

describe("Commsaur Contracts", function () {
  let commsaur: Commsaur;
  let pfp: CommsaurPFP;

  before(async function () {
    const Commsaur = await ethers.getContractFactory("Commsaur");
    commsaur = await Commsaur.deploy();

    const CommsaurPFP = await ethers.getContractFactory("CommsaurPFP");
    pfp = await CommsaurPFP.deploy(commsaur.address);

    console.log(
      "Deployed Commsaur at ",
      commsaur.address,
      "and CommsaurPFP at",
      pfp.address
    );
  });

  describe("Commsaur", function () {
    it("should enable minting", async function () {
      await expect(commsaur.setMintStatus(3)).to.not.be.reverted;
    });

    it("should mint 5", async function () {
      const [, addr1] = await ethers.getSigners();

      await expect(
        commsaur
          .connect(addr1)
          .mintCommsaurs(5, { value: "165000000000000000" })
      ).to.emit(commsaur, "Transfer");
    });

    it("should approve spending", async function () {
      const [, addr1] = await ethers.getSigners();

      const tx = await commsaur
        .connect(addr1)
        .setApprovalForAll(pfp.address, true);
      await tx.wait();

      const approved = await commsaur.isApprovedForAll(
        addr1.address,
        pfp.address
      );
      expect(approved).to.be.eq(true);
    });
  });

  describe("Commsaur PFP", function () {
    it("should try to wrap an nft and fail", async function () {
      const [, addr1] = await ethers.getSigners();
      await expect(
        commsaur
          .connect(addr1)
          ["safeTransferFrom(address,address,uint256)"](
            addr1.address,
            pfp.address,
            "1"
          )
      ).to.be.reverted;
    });

    it("should enable wrapping", async function () {
      await expect(pfp.setWrappingEnabled(true)).to.not.be.reverted;
    });

    it("should try to wrap an nft and succeed", async function () {
      const [, addr1] = await ethers.getSigners();
      await expect(
        commsaur.connect(addr1).transferFrom(addr1.address, pfp.address, 1)
      ).to.not.be.reverted;
    });

    it("should try to wrap multiple nfts and succeed", async function () {
      const [, addr1] = await ethers.getSigners();
      await expect(pfp.connect(addr1).wrapHerd(["0", "2", "3"])).to.not.be
        .reverted;
    });
  });
});
