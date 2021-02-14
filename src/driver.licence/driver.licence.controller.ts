import { Body, Controller, Param, Post } from '@nestjs/common';
import { DriverLicenceService } from '@driver.licence/driver.licence.service';
import { UserInputDto } from '@driver.licence/dto/user.input.dto';

@Controller('drivers')
export class DriverLicenceController {
  constructor(private readonly driverLicenseService: DriverLicenceService) {}

  @Post('valid')
  async validateLicense(@Body() userInputDto: UserInputDto) {
    return this.driverLicenseService.verificationOfLicense(
      userInputDto.birthDate,
      userInputDto.firstName,
      userInputDto.lastName,
      userInputDto.licenceNumber,
      userInputDto.state,
      userInputDto.middleName,
      userInputDto.expiryDate,
    );
  }
}
