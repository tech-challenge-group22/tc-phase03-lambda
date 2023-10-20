import { Connection } from "mysql2";
import { normalizeCpf } from "../normalizeCpf";

export const findCustomerByCPF = (
	cpf: string,
	dbConnection: Connection
): Promise<any> => {
	const normalizedCpf = normalizeCpf(cpf);
	return new Promise((resolve, reject) => {
		const query = "SELECT * FROM customers WHERE customer_cpf = ?";
		dbConnection.query(query, [normalizedCpf], (error, results) => {
			if (error) {
				reject(error);
			} else {
				resolve(results);
			}
		});
	});
};
