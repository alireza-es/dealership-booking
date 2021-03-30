import { CacheModule, Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CacheService, GraphqlService, TypeOrmService } from './config';
import { DateScalar } from './config/graphql/scalars';
import * as Resolvers from './resolvers';

@Module({
  imports: [
    GraphQLModule.forRootAsync({
      useClass: GraphqlService
    }),
    TypeOrmModule.forRootAsync({
      useClass: TypeOrmService
    }),
    CacheModule.registerAsync({
      useClass: CacheService
    }),
  ],
  controllers: [AppController],
  providers: [AppService, ...Object.values(Resolvers), DateScalar],
})
export class AppModule {}
