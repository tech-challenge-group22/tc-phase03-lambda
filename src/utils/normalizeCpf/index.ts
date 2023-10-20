// Remove espaços em branco e caracteres de pontuação
export const normalizeCpf = (cpf: string): string => {
	return cpf.replace(/\D/g, "");
};
