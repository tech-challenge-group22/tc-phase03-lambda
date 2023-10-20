import { normalizeCpf } from "../normalizeCpf";

export const isValidCpf = (cpf: string): boolean => {
	// Verifica se o CPF tem exatamente 11 dígitos
	return normalizeCpf(cpf).length === 11;
};
