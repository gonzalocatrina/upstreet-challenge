import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { DriverLicenceModule } from '@driver.licence/driver.licence.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.production.env'],
    }),
    DriverLicenceModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
