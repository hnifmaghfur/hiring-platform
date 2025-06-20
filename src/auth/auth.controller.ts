import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Res,
  Req,
} from '@nestjs/common';
import { Response } from 'express';
import { AuthService } from './auth.service';
import { Request } from 'express';
import { LoginDto } from './dto/login.dto';
import { UpdateAuthDto } from './dto/update-token.dto';
import { GlobalValidationPipe } from '../common/validate.pipe';
import {
  ApiOperation,
  ApiConsumes,
  ApiBody,
  ApiResponse,
} from '@nestjs/swagger';
import { createdResponse } from '../common/global.schema';
import { BadRequestResponse } from '../common/global.schema';
import { InternalServerErrorResponse } from '../common/global.schema';
import { LoginApiResponse } from './schema/login-swagger';
import { cookie } from '../common/cookie';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('candidate/login')
  @ApiOperation({ summary: 'Login as candidate' })
  @ApiConsumes('application/json')
  @ApiBody({ type: LoginDto })
  @ApiResponse(
    createdResponse(LoginApiResponse.description, LoginApiResponse.schema),
  )
  @ApiResponse(BadRequestResponse('Bad request'))
  @ApiResponse(InternalServerErrorResponse('Internal server error'))
  async login(
    @Body(GlobalValidationPipe) loginDto: LoginDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    return this.authService
      .login(loginDto)
      .then(({ user, token, refreshToken }) =>
        cookie(res, refreshToken, user.id, token),
      );
  }

  @Post('company/login')
  @ApiOperation({ summary: 'Login as company' })
  @ApiConsumes('application/json')
  @ApiBody({ type: LoginDto })
  @ApiResponse(
    createdResponse(LoginApiResponse.description, LoginApiResponse.schema),
  )
  @ApiResponse(BadRequestResponse('Bad request'))
  @ApiResponse(InternalServerErrorResponse('Internal server error'))
  async companyLogin(
    @Body(GlobalValidationPipe) loginDto: LoginDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    return this.authService
      .companyLogin(loginDto)
      .then(({ user, token, refreshToken }) =>
        cookie(res, refreshToken, user.id, token),
      );
  }

  @Post('candidate/update-token')
  @ApiOperation({ summary: 'Update token candidate' })
  @ApiConsumes('application/json')
  @ApiResponse(
    createdResponse(
      'Update token candidate successfully',
      LoginApiResponse.schema,
    ),
  )
  @ApiResponse(BadRequestResponse('Bad request'))
  @ApiResponse(InternalServerErrorResponse('Internal server error'))
  async updateToken(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ) {
    const refreshToken = req.cookies['refreshToken'];
    return this.authService
      .updateTokenCandidate(refreshToken)
      .then(({ user, token }) => cookie(res, refreshToken, user.id, token));
  }

  @Post('company/update-token')
  @ApiOperation({ summary: 'Update token company' })
  @ApiConsumes('application/json')
  @ApiResponse(
    createdResponse(
      'Update token company successfully',
      LoginApiResponse.schema,
    ),
  )
  @ApiResponse(BadRequestResponse('Bad request'))
  @ApiResponse(InternalServerErrorResponse('Internal server error'))
  async updateTokenCompany(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ) {
    const refreshToken = req.cookies['refreshToken'];
    return this.authService
      .updateTokenCompany(refreshToken)
      .then(({ user, token }) => cookie(res, refreshToken, user.id, token));
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.authService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateAuthDto: UpdateAuthDto) {
    return this.authService.update(+id, updateAuthDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.authService.remove(+id);
  }
}
