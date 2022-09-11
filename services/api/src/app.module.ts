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
import { EventEmitterModule } from '@nestjs/event-emitter';
import { ShopkeepersModule } from './shopkeepers/shopkeepers.module';
import { AuthModule } from './auth/auth.module';
import { AuthController } from './auth/auth.controller';
import { CommentsModule } from './comments/comments.module';
import setEnv from '../app.env';

//setEnv();

@Module({
  imports: [
    MongooseModule.forRoot(process.env.MONGODB_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      family: 4,
      dbName: process.env.DBNAME,
      authSource: 'admin',
      auth: {
        username: process.env.MONGODB_USER,
        password: process.env.MONGODB_PASSWORD,
      },
      connectionFactory: (connection) => {
        connection.plugin(autopup);
        connection.plugin(mp);
        return connection;
      },
    }),
    MulterModule.register({
      dest: process.env.UPLOADS_FOLDER,
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
  providers: [AppService],
})
export class AppModule {}
