import { Module } from '@nestjs/common';
import { DriverLicenceController } from './driver.licence.controller';
import { DriverLicenceService } from './driver.licence.service';

@Module({
  imports: [],
  providers: [DriverLicenceService],
  controllers: [DriverLicenceController],
})
export class DriverLicenceModule {}
