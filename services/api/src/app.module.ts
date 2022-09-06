import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';
import * as autopup from 'mongoose-autopopulate';
import * as mp from 'mongoose-paginate-v2';
import { MulterModule } from '@nestjs/platform-express';
import { UsersModule } from './users/users.module';
import { AdminsModule } from './admins/admins.module';
import { OptionsModule } from './options/options.module';
import { ProductsModule } from './products/products.module';
import { StoresModule } from './stores/stores.module';
import { CartsModule } from './carts/carts.module';
import { VariationsModule } from './variations/variations.module';
import { FamiliesModule } from './families/families.module';
import { CategoriesModule } from './categories/categories.module';
import { SessionService } from './services/session/session.service';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { ShopkeepersModule } from './shopkeepers/shopkeepers.module';
import { AuthModule } from './auth/auth.module';
import { AuthController } from './auth/auth.controller';
import { CommentsModule } from './comments/comments.module';

@Module({
  imports: [
    MongooseModule.forRoot('mongodb://localhost:27017/nest-store-api', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      family: 4,
      connectionFactory: (connection) => {
        connection.plugin(autopup);
        connection.plugin(mp);
        return connection;
      },
    }),
    MulterModule.register({
      dest: 'uploads',
    }),
    EventEmitterModule.forRoot(),
    UsersModule,
    AdminsModule,
    OptionsModule,
    ProductsModule,
    StoresModule,
    CartsModule,
    VariationsModule,
    FamiliesModule,
    CategoriesModule,
    ShopkeepersModule,
    AuthModule,
    ConfigModule.forRoot({
      envFilePath: [],
    }),
    CommentsModule,
  ],
  controllers: [AppController, AuthController],
  providers: [AppService, SessionService],
})
export class AppModule {}
