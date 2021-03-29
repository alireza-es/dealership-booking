import * as dotenv from 'dotenv';
dotenv.config();

// environment
const NODE_ENV: string = process.env.NODE_ENV || 'development';

// application
const PORT: number = +process.env.PORT || 3000;
const BOOKING_END_POINT: string = process.env.BOOKING_END_POINT || 'graphql';
const DOMAIN: string = process.env.DOMAIN || 'localhost';
// MongoDB
const ATLAS_DB_USER = process.env.ATLAS_USER || 'admin'
const ATLAS_DB_PASS = process.env.ATLAS_PASS || 'bYBQuQybB3qHsy3L'
const ATLAS_DB_HOST = process.env.ATLAS_HOST || 'cluster0.1ot9b.azure.mongodb.net'
const ATLAS_DB_DATABASE = process.env.ATLAS_DATABASE || 'booking'
const ATLAS_DB_URL = process.env.ATLAS_DB_URL || `mongodb+srv://${ATLAS_DB_USER}:${ATLAS_DB_PASS}@${ATLAS_DB_HOST}/${ATLAS_DB_DATABASE}?retryWrites=true&w=majority`;

// typeorm
const environment = {
	development: {
		url: ATLAS_DB_URL
	},
	testing: {
		url: ATLAS_DB_URL
	},
	staging: {
		url: ATLAS_DB_URL
	},
	production: {
		url: ATLAS_DB_URL
	}
};
const TYPE_ORM = environment[NODE_ENV];

export {
	NODE_ENV,
	DOMAIN,
	PORT,
	BOOKING_END_POINT,
	TYPE_ORM,
	ATLAS_DB_URL
};

