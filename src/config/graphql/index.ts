import {
	BOOKING_END_POINT, NODE_ENV
} from '@environments';
import { Injectable, Logger } from '@nestjs/common';
import { GqlModuleOptions, GqlOptionsFactory } from '@nestjs/graphql';
import { MemcachedCache } from 'apollo-server-cache-memcached';
import { PubSub } from 'graphql-subscriptions';
import { MockList } from 'graphql-tools';
import GraphQLJSON from 'graphql-type-json';
import {
	bookings_by_date_sample,
	bookings_by_vin_sample,
	create_booking_sample,
	create_customer_sample,
	create_vehicle_sample,
	queries_sample,
	update_booking_capacity_sample
} from './sample_data';
const pubsub = new PubSub();

@Injectable()
export class GraphqlService implements GqlOptionsFactory {
	async createGqlOptions(): Promise<GqlModuleOptions> {
		return {
			typePaths: ['./**/*.graphql'],
			mocks: NODE_ENV === 'testing' && {
				Query: () => ({
					bookings: () => new MockList([2, 6])
				})
			},
			resolvers: { JSON: GraphQLJSON },
			resolverValidationOptions: {
				requireResolversForResolveType: 'ignore'
			},
			path: `/${BOOKING_END_POINT!}`,
			cors: true,
			bodyParserConfig: { limit: '50mb' },
			introspection: true,
			playground: NODE_ENV !== 'production' && {
				settings: {
					'editor.cursorShape': 'underline', // possible values: 'line', 'block', 'underline'
					'editor.fontFamily': `'Source Code Pro', 'Consolas', 'Inconsolata', 'Droid Sans Mono', 'Monaco', monospace`,
					'editor.fontSize': 14,
					'editor.reuseHeaders': true, // new tab reuses headers from last tab
					'editor.theme': 'dark', // possible values: 'dark', 'light'
					'general.betaUpdates': true,
					'queryPlan.hideQueryPlanResponse': false,
					'request.credentials': 'include', // possible values: 'omit', 'include', 'same-origin'
					'tracing.hideTracingResponse': false
				},
				tabs: [
					{
						name: 'Bookings',
						endpoint: BOOKING_END_POINT,
						query: queries_sample
					},
					{
						name: 'Create Customer',
						endpoint: BOOKING_END_POINT,
						query: create_customer_sample.mutation,
						variables: create_customer_sample.variables
					},
					{
						name: 'Create Vehicle',
						endpoint: BOOKING_END_POINT,
						query: create_vehicle_sample.mutation,
						variables: create_vehicle_sample.variables
					},
					{
						name: 'Create Booking',
						endpoint: BOOKING_END_POINT,
						query: create_booking_sample.mutation,
						variables: create_booking_sample.variables
					},
					{
						name: 'Update Booking Capacity',
						endpoint: BOOKING_END_POINT,
						query: update_booking_capacity_sample.mutation,
						variables: update_booking_capacity_sample.variables
					},
					{
						name: 'Bookings Query By Date',
						endpoint: BOOKING_END_POINT,
						query: bookings_by_date_sample.query,
						variables: bookings_by_date_sample.variables
					},
					{
						name: 'Bookings Query By VIN',
						endpoint: BOOKING_END_POINT,
						query: bookings_by_vin_sample.query,
						variables: bookings_by_vin_sample.variables
					}
				]
			},
			tracing: NODE_ENV !== 'production',
			cacheControl: NODE_ENV === 'production' && {
				defaultMaxAge: 5,
				stripFormattedExtensions: false,
				calculateHttpHeaders: false
			},
			// plugins: [responseCachePlugin()],
			context: async ({ req, res, connection }) => {
				if (connection) {
					const { currentUser } = connection.context

					return {
						pubsub,
						currentUser
					}
				}

				return {
					req,
					res,
					pubsub,
					trackErrors(errors) {
						// Track the errors
						// console.log(errors)
					}
				}
			},
			formatError: error => {
				return {
					message: error.message,
					code: error.extensions && error.extensions.code,
					locations: error.locations,
					path: error.path
				}
			},
			formatResponse: response => {
				// console.log(response)
				return response
			},
			subscriptions: {
				path: `/${BOOKING_END_POINT!}`,
				keepAlive: 1000,
				onConnect: async () => {
					NODE_ENV !== 'production' &&
						Logger.debug(`🔗  Connected to websocket`, 'GraphQL')
				},
				onDisconnect: async () => {
					NODE_ENV !== 'production' &&
						Logger.error(`❌  Disconnected to websocket`, '', 'GraphQL', false)
				}
			},
			persistedQueries: {
				cache: new MemcachedCache(
					['memcached-server-1', 'memcached-server-2', 'memcached-server-3'],
					{ retries: 10, retry: 10000 } // Options
				)
			},
			installSubscriptionHandlers: true,
			uploads: {
				maxFieldSize: 2, // 1mb
				maxFileSize: 20, // 20mb
				maxFiles: 5
			}
		}
	}
}
