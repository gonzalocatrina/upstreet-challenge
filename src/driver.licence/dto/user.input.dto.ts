import { State } from "../enum/state.enum";

export class UserInputDto{

    birthDate:Date;
    firstName:string;
    middleName:string;
    lastName:string;
    licenceNumber:string;
    state:State;
    expiryDate:Date;
    
}