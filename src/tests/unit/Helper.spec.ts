import { expect } from "chai";
import Helper from "../../utils/Helper";

describe("Helper tests", () => {
  /** Dependencies */
  const helper: Helper = new Helper();

  it("Concat with no spaces", () => {
    const a: string = "a"
    const b: string = "b"

    const result: string = helper.concatWithNoSpace(a, b)
    expect(result).to.be.equal("ab");
  })

  it("Concat with spaces", () => {
    const a: string = "a"
    const b: string = "b"

    const result: string = helper.concatWithSpaces(a, b)
    expect(result).to.be.equal("a b");
  })

  it("Trim extra whitespaces", () => {
    const token: string = "Bearer: x1y2z3"

    const result: string = helper.formatToken(token)
    expect(result).to.be.equal("x1y2z3");
  })

  it("Check expired token time", () => {
    const date: number = Date.now();

    const result: boolean = helper.checkExpiredTime(date);

    expect(result).to.be.true;
  })
});
