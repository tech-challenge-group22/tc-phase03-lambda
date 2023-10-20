import dotenv from "dotenv";
import mysql from "mysql2";

dotenv.config();

import { IClient } from "./interfaces";

import { isValidCpf, generateJWT, findCustomerByCPF } from "./utils";

export const handler = async (event: any) => {
	try {
		const secretKey = process.env.SECRET_KEY_JWT_TOKEN;
		if (!secretKey || secretKey.trim() === "") {
			throw new Error("Chave secreta JWT não configurada corretamente");
		}

		const dbConnection = mysql.createConnection({
			host: process.env.DB_HOST,
			user: process.env.DB_USER,
			password: process.env.DB_PASSWORD,
			database: process.env.DB_DATABASE,
		});

		if (event.body === undefined || event.body === null) {
			return {
				statusCode: 200,
				body: JSON.stringify({ token: generateJWT(secretKey) }),
			};
		}

		const { cpf } = JSON.parse(event.body);
		if (cpf === undefined || cpf === "") {
			return {
				statusCode: 200,
				body: JSON.stringify({ token: generateJWT(secretKey) }),
			};
		}

		if (!isValidCpf(cpf)) {
			return {
				statusCode: 400,
				body: JSON.stringify({ message: "CPF inválido" }),
			};
		}

		const customer = (await findCustomerByCPF(
			cpf,
			dbConnection
		)) as IClient[];
		if (customer[0]) {
			return {
				statusCode: 200,
				body: JSON.stringify({
					token: generateJWT(secretKey, customer[0]),
				}),
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
