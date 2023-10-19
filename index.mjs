import dotenv from "dotenv";
import jwt from "jsonwebtoken";
import mysql from "mysql2";

// Carrega as variáveis de ambiente do arquivo .env
dotenv.config();

const dbConnection = mysql.createConnection({
	host: process.env.DB_HOST,
	user: process.env.DB_USER,
	password: process.env.DB_PASSWORD,
	database: process.env.DB_DATABASE,
});

// Remove espaços em branco e caracteres de pontuação
const normalizeCpf = (cpf) => {
	return cpf.replace(/\D/g, "");
};

const isValidCpf = (cpf) => {
	// Verifica se o CPF tem exatamente 11 dígitos
	return normalizeCpf(cpf).length === 11;
};

const findCustomerByCPF = (cpf) => {
	const normalizedCpf = normalizeCpf(cpf);
	return new Promise((resolve, reject) => {
		const query = "SELECT * FROM customers WHERE customer_cpf = ?";
		dbConnection.query(query, [normalizedCpf], (error, results) => {
			if (error) {
				reject(error);
			} else {
				resolve(results[0]);
			}
		});
	});
};

const generateJWT = (customer) => {
	const payload = {
		id: customer.id,
		customer_cpf: customer.customer_cpf,
		customer_name: customer.customer_name,
		customer_email: customer.customer_email,
	};

	const secretKey = process.env.SECRET_KEY_JWT_TOKEN;

	return jwt.sign(payload, `${secretKey}`, { expiresIn: 60 * 60 });
};

export const handler = async (event) => {
	try {
		// Verifica se o body foi informado na requisição
		if (event.body === undefined || event.body === null)
			return {
				statusCode: 400,
				body: JSON.stringify({ message: "Body não informado" }),
			};

		// Pega cpf
		const { cpf } = JSON.parse(event.body);

		// Verifica se o CPF foi informado
		if (cpf === undefined)
			return {
				statusCode: 400,
				body: JSON.stringify({ message: "CPF não informado" }),
			};

		// Verifica se o CPF é válido
		if (!isValidCpf(cpf))
			return {
				statusCode: 400,
				body: JSON.stringify({ message: "CPF inválido" }),
			};

		const customer = await findCustomerByCPF(cpf);

		// Se retornou algum customer
		if (customer) {
			const jwtToken = generateJWT(customer);
			return {
				statusCode: 200,
				body: JSON.stringify({ token: jwtToken }),
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
