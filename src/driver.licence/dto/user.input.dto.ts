import { State } from '@driver.licence/enum/state.enum';

export class UserInputDto {
  birthDate: string;
  firstName: string;
  middleName: string;
  lastName: string;
  licenceNumber: string;
  state: State;
  expiryDate: string;
}
