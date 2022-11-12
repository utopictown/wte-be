import { IsNotEmpty, Matches, MinLength } from 'class-validator';

export class LoginDto {
  @IsNotEmpty()
  username: string;

  @IsNotEmpty()
  @MinLength(8)
  password: string;
}
