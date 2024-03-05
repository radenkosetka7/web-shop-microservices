import { IsNotEmpty, IsString } from 'class-validator';

export class AccountActivationRequest {
  @IsString()
  @IsNotEmpty()
  username: string;
  @IsString()
  @IsNotEmpty()
  code: string;
}
