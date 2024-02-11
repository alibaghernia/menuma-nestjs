import { IsNotEmpty, IsString } from 'class-validator';

export class CreateDTO {
  @IsNotEmpty()
  @IsString()
  readonly name?: string = '';

  @IsNotEmpty()
  @IsString()
  readonly phone: string;
}
