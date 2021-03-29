import { DOMAIN, GRAPHQL_END_POINT, NODE_ENV, PORT } from '@environments';
import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import * as bodyParser from 'body-parser';
import * as chalk from 'chalk';
import * as compression from 'compression';
import { getConnection } from 'typeorm';
import { AppModule } from './app.module';

async function bootstrap() {
  try {
    const app = await NestFactory.create(AppModule);

    // NOTE: database connect
    const connection = getConnection('default');
    const { isConnected } = connection
    isConnected
      ? Logger.log(`🌱  Database connected`, 'TypeORM', false)
      : Logger.error(`❌  Database connect error`, '', 'TypeORM', false)

    // NOTE: adapter for e2e testing
    app.getHttpAdapter()

    // NOTE: compression
    app.use(compression())

    // NOTE: body parser
    app.use(bodyParser.json({ limit: '50mb' }));
    app.use(
      bodyParser.urlencoded({
        limit: '50mb',
        extended: true,
        parameterLimit: 50000
      })
    );

    app.enableShutdownHooks()

    await app.listen(PORT);

    const env_color = '#87e8de';
    NODE_ENV !== 'production'
      ? (Logger.log(
        `🆗  Application is running on: ${await app.getUrl()}`,
        'NestJS',
        false
      ),
        Logger.log(
          `🆗 Server ready at http://${DOMAIN}:${chalk
            .hex(env_color)
            .bold(PORT.toString())}/${GRAPHQL_END_POINT}`,
          'Bootstrap',
          false
        ),
        Logger.log(
          `🆗  Subscriptions ready at ws://${DOMAIN}:${chalk
            .hex(env_color)
            .bold(PORT.toString())}/${GRAPHQL_END_POINT}`,
          'Bootstrap',
          false
        ))
      : Logger.log(
        `🆗  Server is listening on port ${chalk
          .hex(env_color)
          .bold(PORT.toString())}`,
        'Bootstrap',
        false
      )
  } catch (error) {
    Logger.error(error);
    Logger.error(`❌  Error starting server, ${error}`, '', 'Bootstrap', false)
    process.exit()
  }
}
bootstrap();
