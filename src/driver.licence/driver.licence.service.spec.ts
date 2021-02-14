import { ConfigService } from '@nestjs/config';
import { Test } from '@nestjs/testing';
import { DriverLicenceService } from '@driver.licence/driver.licence.service';
import { UserInputDto } from '@driver.licence/dto/user.input.dto';
import { ValidateUserDto } from '@driver.licence/dto/validate.user.dto';
import { State } from './enum/state.enum';
import { BadRequestException } from '@nestjs/common';
import { ResponseService } from './dto/response.service';
import { ConstUtils } from '@src/common/const.utils';



describe('DriverLicenceService', () => {
  let driverLicenceService: DriverLicenceService;
  let validateUserDtoMock: ValidateUserDto = new ValidateUserDto();
  let userInputDto = new UserInputDto();
  let responseService= new ResponseService();
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
      validateUserDtoMock.expiryDate=undefined;
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

  describe('verificationOfLicense',()=>{
    it('should return data', async ()=>{
      const oldDate = new Date();
      const date = new Date(
        oldDate.getFullYear(),
        oldDate.getMonth(),
        oldDate.getDate(),
      );
      
      async function mockeResponseService (){
        responseService = {
          verificationRequestNumber:465456,
          verificationResultCode:ConstUtils.Y,
          verifyDocumentResult: {type:"DriverLicenceResponse"}
        };
        return responseService;
      }
      const spy = jest.spyOn(driverLicenceService,'makeRequest');
      spy.mockReturnValue(mockeResponseService());
      validateUserDtoMock.birthDate = date.toLocaleDateString('sv-SE');
      validateUserDtoMock.firstName = 'Jonh';
      validateUserDtoMock.lastName = 'smith';
      validateUserDtoMock.licenceNumber = '2as56d4a4';
      validateUserDtoMock.state = State.ACT;
      validateUserDtoMock.expiryDate = date.toLocaleDateString('sv-SE');
      validateUserDtoMock.middleName = 'Sharon';
      
      expect(driverLicenceService.makeRequest(validateUserDtoMock)).toEqual(mockeResponseService());
      console.log(spy);
        userInputDto.birthDate = "2020-10-10";
        userInputDto.expiryDate = "2020-10-10";
        userInputDto.firstName = "John";
        userInputDto.lastName ="Carol";
        userInputDto.middleName ="Juan";
        userInputDto.state =State.NT;
        userInputDto.licenceNumber ="asdasd456";
      expect(driverLicenceService.verificationOfLicense(
        userInputDto.birthDate,
        userInputDto.firstName,
        userInputDto.lastName,
        userInputDto.licenceNumber,
        userInputDto.state,
        userInputDto.middleName,
        userInputDto.expiryDate,
      )).toEqual(mockeResponseService());
      expect(spy).toHaveBeenCalled();
    })
  });
});
