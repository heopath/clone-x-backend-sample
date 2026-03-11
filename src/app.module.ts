import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { FeedsModule } from './feeds/feeds.module';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: '34.158.197.215',
      port: 3306,
      username: 'admin',
      password: 'mM693584**',
      database: 'twitter',
      autoLoadEntities: true,
      synchronize:false,
  }),
  UsersModule,
  FeedsModule,
],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
