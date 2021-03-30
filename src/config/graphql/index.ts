import {
	BOOKING_END_POINT, NODE_ENV
} from '@environments';
import { Injectable, Logger } from '@nestjs/common';
import { GqlModuleOptions, GqlOptionsFactory } from '@nestjs/graphql';
import { MemcachedCache } from 'apollo-server-cache-memcached';
import { PubSub } from 'graphql-subscriptions';
import { MockList } from 'graphql-tools';
import GraphQLJSON from 'graphql-type-json';
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
						query:
`{
  bookings {
	  _id
	  customerName
	}
}`
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
