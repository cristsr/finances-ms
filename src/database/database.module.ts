import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ENV } from 'environment';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      useFactory: (configService: ConfigService) => ({
        type: configService.get<any>(ENV.DB_TYPE),
        host: configService.get(ENV.DB_HOST),
        port: configService.get(ENV.DB_PORT),
        database: configService.get<string>(ENV.DB_NAME),
        username: configService.get(ENV.DB_USER),
        password: configService.get(ENV.DB_PASSWORD),
        ssl: {
          rejectUnauthorized: false,
        },
        synchronize: configService.get(ENV.DB_SYNCHRONIZE),
        autoLoadEntities: true,
      }),
      inject: [ConfigService],
    }),
  ],
})
export class DatabaseModule {}
