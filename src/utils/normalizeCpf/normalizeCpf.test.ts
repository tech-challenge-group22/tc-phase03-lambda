import { normalizeCpf } from "./";

describe("normalizeCpf", () => {
	it("should remove blank spaces", () => {
		const cpf = "12345678900";
		const normalized = normalizeCpf(" 1 2 3 . 4 5 6 . 7 8 9 - 0 0 ");
		expect(normalized).toEqual(cpf);
	});

	it("should remove . and -", () => {
		const cpf = "12345678900";
		const normalized = normalizeCpf("123.456.789-00");
		expect(normalized).toEqual(cpf);
	});

	it("should keep a normalized cpf", () => {
		const cpf = "12345678900";
		const normalized = normalizeCpf(cpf);
		expect(normalized).toEqual(cpf);
	});

	it("should return a blank space", () => {
		const cpf = "";
		const normalized = normalizeCpf(cpf);
		expect(normalized).toEqual(cpf);
	});
});
