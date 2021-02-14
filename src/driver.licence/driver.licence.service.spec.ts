import { ConfigService } from '@nestjs/config';
import { Test } from '@nestjs/testing';
import { DriverLicenceService } from '@driver.licence/driver.licence.service';
import { UserInputDto } from '@driver.licence/dto/user.input.dto';
import { ValidateUserDto } from '@driver.licence/dto/validate.user.dto';
import { validate } from 'class-validator';
import { State } from './enum/state.enum';
import { BadRequestException } from '@nestjs/common';
const {
  birthDate,
  firstName,
  lastName,
  licenceNumber,
  state,
  middleName,
  expiryDate,
} = new UserInputDto();

describe('DriverLicenceService', () => {
  let driverLicenceService: DriverLicenceService;
  let validateUserDtoMock: ValidateUserDto = new ValidateUserDto();
  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [
        DriverLicenceService,
        { provide: ConfigService, useValue: {} },
      ],
    }).compile();

    driverLicenceService = moduleRef.get<DriverLicenceService>(
      DriverLicenceService,
    );
  });

  it('should be defined', () => {
    expect(driverLicenceService).toBeDefined();
  });

  describe('isInputValid', () => {
    const oldDate = new Date();
    const date = new Date(
      oldDate.getFullYear(),
      oldDate.getMonth(),
      oldDate.getDate(),
    );
    it('should return true valid = true', async () => {
      validateUserDtoMock.birthDate = date.toLocaleDateString('sv-SE');
      validateUserDtoMock.firstName = 'Jonh';
      validateUserDtoMock.lastName = 'smith';
      validateUserDtoMock.licenceNumber = '2as56d4a4';
      validateUserDtoMock.state = State.ACT;
      validateUserDtoMock.expiryDate = date.toLocaleDateString('sv-SE');
      validateUserDtoMock.middleName = 'Sharon';
      expect(await driverLicenceService.isInputValid(validateUserDtoMock)).toBe(
        true,
      );
    });
    it('should return valid = false', async () => {
      validateUserDtoMock.birthDate = '15-08-2020';
      validateUserDtoMock.firstName = 'Jonh';
      validateUserDtoMock.lastName = 'smith';
      validateUserDtoMock.licenceNumber = '2as56d4a4';
      validateUserDtoMock.state = State.ACT;
      expect(
        await driverLicenceService
          .isInputValid(validateUserDtoMock)
          .catch((e) => {
            if (e instanceof BadRequestException) {
              return false;
            }
          }),
      ).toBeFalsy();
    });
  });
});
