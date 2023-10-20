import dotenv from "dotenv";
import jwt from "jsonwebtoken";
import mysql from "mysql2";

// Interfaces
import { IClient } from "./interfaces";

// Utils
import { normalizeCpf, isValidCpf } from "./utils";

// Carrega as variáveis de ambiente do arquivo .env
dotenv.config();

const dbConnection = mysql.createConnection({
	host: process.env.DB_HOST,
	user: process.env.DB_USER,
	password: process.env.DB_PASSWORD,
	database: process.env.DB_DATABASE,
});

const findCustomerByCPF = (cpf: string): Promise<any> => {
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

const generateJWT = (customer?: IClient) => {
	let payload = {};

	if (customer) {
		payload = {
			id: customer.id,
			customer_cpf: customer.customer_cpf,
			customer_name: customer.customer_name,
			customer_email: customer.customer_email,
			is_active: customer.is_active,
		};
	}

	const secretKey = process.env.SECRET_KEY_JWT_TOKEN;

	return jwt.sign(payload, `${secretKey}`, { expiresIn: 60 * 60 });
};

export const handler = async (event: any) => {
	try {
		// Se não tiver body, retorna JWT sem payload
		if (event.body === undefined || event.body === null) {
			return {
				statusCode: 200,
				body: JSON.stringify({ token: generateJWT() }),
			};
		}

		const { cpf } = JSON.parse(event.body);
		// Se o campo CPF estiver vázio retorna JWT sem Payload
		if (cpf === undefined || cpf === "") {
			return {
				statusCode: 200,
				body: JSON.stringify({ token: generateJWT() }),
			};
		}

		// Se o CPF for inválido retorna erro
		if (!isValidCpf(cpf)) {
			return {
				statusCode: 400,
				body: JSON.stringify({ message: "CPF inválido" }),
			};
		}

		const customer = (await findCustomerByCPF(cpf)) as IClient[];
		if (customer[0]) {
			return {
				statusCode: 200,
				body: JSON.stringify({ token: generateJWT(customer[0]) }),
			};
		} else {
			return {
				statusCode: 404,
				body: JSON.stringify({ message: "Cliente não encontrado" }),
			};
		}
	} catch (error) {
		return {
			statusCode: 500,
			body: JSON.stringify({ message: "Erro interno" }),
		};
	}
};
