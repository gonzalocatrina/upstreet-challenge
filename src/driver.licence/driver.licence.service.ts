import { BadRequestException, Injectable } from "@nestjs/common";
import { validate } from "class-validator";
import { UserInputDto } from "./dto/user.input.dto";
import { ValidateUserDto } from "./dto/validate.user.dto";
import { State } from "./enum/state.enum";

@Injectable()
export class DriverLicenceService{


    async verificationOfLicense (
        birthDate:Date,
        firstName:string,
        lastName:string,
        licenceNumber:string,
        state:State,
        middleName?:string,
        expiryDate?:Date,
        ){
            let validateUserDto: ValidateUserDto = new ValidateUserDto();
            validateUserDto.birthDate = birthDate;
            validateUserDto.firstName = firstName;
            validateUserDto.lastName = lastName;
            validateUserDto.licenceNumber = licenceNumber;
            validateUserDto.state = state;
            validateUserDto.middleName = middleName;
            validateUserDto.expiryDate = expiryDate;
            validate(validateUserDto).then(errors => {
                // errors is an array of validation errors
                if (errors.length > 0) {
                  console.log('validation failed. errors: ', errors);
                  throw new BadRequestException('Validation Failed');
                } else {
                  console.log('validation succeed');
                }
              });
            return validateUserDto;
    }
}