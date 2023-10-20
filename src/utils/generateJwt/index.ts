import jwt from "jsonwebtoken";

import { IClient } from "../../interfaces";

export const generateJWT = (secretKey: string, customer?: IClient) => {
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

	return jwt.sign(payload, secretKey, { expiresIn: 60 * 60 });
};
