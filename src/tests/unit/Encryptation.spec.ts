import { expect } from "chai";
import Encipher from "../../encryptation/Encipher"

describe("Encipher test", () => {
  /** Dependencies */
  const encipher: Encipher = new Encipher();

  it("Encryptation", async () => {
    const data: string = "data";

    const encrypted: string = await encipher.encrypt(data);

    expect(encrypted).to.not.be.equal(data);
  })

  it("Decryptation", async() => {
    const data: string = "data";
    const encrypted: string = await encipher.encrypt(data);

    const decrypted: string = await encipher.decrypt(encrypted);

    expect(decrypted).to.be.equal(data);
  })

  it("Validation", async () => {
    const data: string = "data";
    const encrypted: string = await encipher.encrypt(data);

    const validation: boolean = await encipher.validateData(data, encrypted);

    expect(validation).to.be.true;
  })
})
