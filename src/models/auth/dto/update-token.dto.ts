import { ApiProperty } from '@nestjs/swagger';

export class UpdateAuthDto {
  @ApiProperty({ example: 'uuid', description: 'User token' })
  token: string;
}
