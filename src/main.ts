import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  try {
    const app = await NestFactory.create(AppModule);

    // NOTE: database connect
    const connection = getConnection('default')
    const { isConnected } = connection
    // connection.runMigrations();
    isConnected
      ? Logger.log(`🌨️  Database connected`, 'TypeORM', false)
      : Logger.error(`❌  Database connect error`, '', 'TypeORM', false)

    // NOTE: adapter for e2e testing
    app.getHttpAdapter()

    // NOTE: compression
    app.use(compression())

    // NOTE: added security
    app.use(helmet())

    // NOTE: body parser
    app.use(bodyParser.json({ limit: '50mb' }))
    app.use(
      bodyParser.urlencoded({
        limit: '50mb',
        extended: true,
        parameterLimit: 50000
      })
    )

    // NOTE: rateLimit
    app.use(
      rateLimit({
        windowMs: 1000 * 60 * 60, // an hour
        max: RATE_LIMIT_MAX, // limit each IP to 100 requests per windowMs
        message:
          '⚠️  Too many request created from this IP, please try again after an hour'
      })
    )

    // NOTE:loggerMiddleware
    NODE_ENV !== 'testing' && app.use(LoggerMiddleware)

    // NOTE: interceptors
    app.useGlobalInterceptors(new LoggingInterceptor())
    app.useGlobalInterceptors(new TimeoutInterceptor())

    // NOTE: global nest setup
    app.useGlobalPipes(new ValidationPipe())

    app.enableShutdownHooks()

    await app.listen(PORT)

    if (module.hot) {
      module.hot.accept()
      module.hot.dispose(() => app.close())
    }

    NODE_ENV !== 'production'
      ? (Logger.log(
        `🤬  Application is running on: ${await app.getUrl()}`,
        'NestJS',
        false
      ),
        Logger.log(
          `🚀  Server ready at http://${DOMAIN}:${chalk
            .hex(PRIMARY_COLOR)
            .bold(PORT.toString())}/${END_POINT}`,
          'Bootstrap',
          false
        ),
        Logger.log(
          `🚀  Subscriptions ready at ws://${DOMAIN}:${chalk
            .hex(PRIMARY_COLOR)
            .bold(PORT.toString())}/${END_POINT}`,
          'Bootstrap',
          false
        ))
      : Logger.log(
        `🚀  Server is listening on port ${chalk
          .hex(PRIMARY_COLOR)
          .bold(PORT.toString())}`,
        'Bootstrap',
        false
      )
  } catch (error) {
    Logger.error(`❌  Error starting server, ${error}`, '', 'Bootstrap', false)
    process.exit()
  }
}
bootstrap();
