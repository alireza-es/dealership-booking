import * as dotenv from 'dotenv';
dotenv.config();

// environment
const NODE_ENV: string = process.env.NODE_ENV || 'development';

// application
const PORT: number = +process.env.PORT || 3000;
const END_POINT: string = process.env.END_POINT || 'graphql';

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
const TYPEORM = environment[NODE_ENV];

export {
	NODE_ENV,
	PORT,
	END_POINT,
	TYPEORM,
	ATLAS_DB_URL
};

