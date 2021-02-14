import { VerifyDocumentResult } from '@driver.licence/dto/verifyDocument.result';

export class ResponseService {
  verifyDocumentResult: VerifyDocumentResult;
  verificationRequestNumber: number;
  verificationResultCode: string;
}
