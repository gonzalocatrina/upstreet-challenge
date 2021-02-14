import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { validate } from 'class-validator';
import { ValidateUserDto } from './dto/validate.user.dto';
import { State } from './enum/state.enum';
import { isValidDate } from 'iso-datestring-validator';
import { ConstUtils } from 'src/commom/exception.filters/const.utils';
import { ConfigService } from '@nestjs/config';
import { ResponseService } from './dto/response.service';
import axios from 'axios';

@Injectable()
export class DriverLicenceService {
  constructor(private readonly configService: ConfigService) {}

  async verificationOfLicense(
    birthDate: Date,
    firstName: string,
    lastName: string,
    licenceNumber: string,
    state: State,
    middleName?: string,
    expiryDate?: Date,
  ) {
    //Mapping input to object for validation
    let validateUserDto: ValidateUserDto = new ValidateUserDto();
    validateUserDto.birthDate = birthDate;
    validateUserDto.firstName = firstName;
    validateUserDto.lastName = lastName;
    validateUserDto.licenceNumber = licenceNumber;
    validateUserDto.state = state;
    validateUserDto.middleName = middleName;
    validateUserDto.expiryDate = expiryDate;
    try {
      const valid = await this.isInputValid(validateUserDto);
      if (valid) {
        let responseService: ResponseService = await this.makeRequest(
          validateUserDto,
        );
        let response;
        switch (responseService.verificationResultCode) {
          case ConstUtils.Y:
            response = { kycResult: true };
            break;
          case ConstUtils.N:
            response = { kycResult: false };
            break;
          case ConstUtils.D:
            response = {
              code: ConstUtils.D,
              message: ConstUtils.DOCUMENT_ERROR,
            };
            break;
          case ConstUtils.S:
            response = { code: ConstUtils.S, message: ConstUtils.SERVER_ERROR };
            break;
          default:
            throw new BadRequestException();
        }
        return response;
      } else {
        throw new BadRequestException(ConstUtils.INVALID_INPUT_ERROR);
      }
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw new BadRequestException(error.message);
      }
    }
  }

  //On real application, the validation pipes of Nestjs should do the job on the http requests
  private async isInputValid(validateUserDto: ValidateUserDto) {
    let valid = false;
    try {
      //First we check if the dates are valids
      if (
        isValidDate(validateUserDto.birthDate.toString(), '-') &&
        this.verifyExpiredDate(validateUserDto.expiryDate)
      ) {
        //Validate all the other onformation
        await validate(validateUserDto).then((errors) => {
          // errors is an array of validation errors
          if (errors.length > 0) {
            console.log('validation failed. errors: ', errors);
            throw new BadRequestException(errors, 'Validation Failed');
          } else {
            valid = true;
          }
        });
      } else {
        throw new BadRequestException(ConstUtils.INVALID_DATES_ERROR);
      }
    } catch (errors) {
      throw new BadRequestException(errors);
    }
    return valid;
  }

  private verifyExpiredDate(expiryDate: Date): boolean {
    let isValid = false;
    if (!expiryDate) {
      isValid = true;
    } else {
      if (expiryDate && isValidDate(expiryDate.toString(), '-')) {
        isValid = true;
      }
    }
    return isValid;
  }

  private async makeRequest(validateUserDto: ValidateUserDto) {
    let responseService: ResponseService = new ResponseService();
    try {
      const headersRequest = {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${this.configService.get<string>('API_KEY')}`,
      };

      await axios
        .post(
          this.configService.get<string>('API_URL'),
          {
            birthDate: validateUserDto.birthDate,
            givenName: validateUserDto.firstName,
            middleName: validateUserDto.middleName,
            familyName: validateUserDto.lastName,
            licenceNumber: validateUserDto.licenceNumber,
            stateOfIssue: validateUserDto.state,
            expiryDate: validateUserDto.expiryDate,
          },
          { headers: headersRequest },
        )
        .then((response) => {
          responseService = { ...response.data };
          console.log(responseService);
        })
        .catch((error) => {
          console.log(error);
          throw new InternalServerErrorException();
        });

      return responseService;
    } catch (error) {
      console.log(error);
    }
  }
}
