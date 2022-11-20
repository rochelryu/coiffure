import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class AdminDTOLogin {
  @IsNotEmpty()
  @IsString()
  @ApiProperty({ description: 'Uniquement que les 10 chiffres du contact' })
  contact: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  password: string;
}
