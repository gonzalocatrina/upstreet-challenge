import { BadRequestException, Injectable } from '@nestjs/common';
import { validate } from 'class-validator';
import { ValidateUserDto } from './dto/validate.user.dto';
import { State } from './enum/state.enum';
import {
  isValidDate,
} from 'iso-datestring-validator';
import { ConstUtils } from 'src/commom/exception.filters/const.utils';

@Injectable()
export class DriverLicenceService {
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
      } else {
        throw new BadRequestException();
      }
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw new BadRequestException(error.message);
      }
    }
  }

  async isInputValid(validateUserDto: ValidateUserDto) {
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
}
