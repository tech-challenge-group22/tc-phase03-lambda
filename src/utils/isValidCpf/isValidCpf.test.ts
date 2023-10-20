import { isValidCpf } from "./";

describe("isValidCpf", () => {
	it("should return true for a valid cpf", () => {
		expect(isValidCpf("462.720.398-59")).toBe(true);
	});

	it("should return false for a invalid cpf", () => {
		expect(isValidCpf("46a.720.398-59")).toBe(false);
	});

	it("should return false for a invalid cpf", () => {
		expect(isValidCpf("46270.720.398-59")).toBe(false);
	});
});
