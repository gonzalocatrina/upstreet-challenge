import { IsDate, IsEnum, IsOptional, IsString, MaxLength } from "class-validator";
import { isDate } from "util";
import { State } from "../enum/state.enum";

export class ValidateUserDto{

    @IsDate()
    birthDate:Date;

    @IsString()
    @MaxLength(100)
    firstName:string;

    @IsString()
    @IsOptional()
    @MaxLength(100)
    middleName?:string;

    @IsString()
    @MaxLength(100)
    lastName:string;

    @IsString()
    licenceNumber:string;

    @IsEnum(State)
    state:State;

    @IsDate()
    @IsOptional()
    expiryDate?:Date;
    
}