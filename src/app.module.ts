import { Module } from '@nestjs/common';
import { DriverLicenceModule } from './driver.licence/driver.licence.module';

@Module({
  imports: [DriverLicenceModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
