import { Controller, Get, Query, Req, UseGuards } from '@nestjs/common';
import { NotificationService } from './notification.service';
import { JwtAuthGuard } from 'src/common/jwt/jwt-auth.guard';
import { ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { FindAllNotificationDto } from './dto/find-all-notification.dto';
import { Request } from 'express';
import { getRoleId, TYPE_ACCOUNT } from 'src/constants';

@Controller('notification')
export class NotificationController {
  constructor(private readonly notificationService: NotificationService) {}

  @Get()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Get all notifications' })
  @ApiBearerAuth()
  findAll(@Query() query: FindAllNotificationDto, @Req() req: Request) {
    if (!req.token) {
      throw new Error('Unauthorized: No user found in request');
    }
    if (req.token.role !== getRoleId(TYPE_ACCOUNT.CANDIDATE)) {
      throw new Error('Unauthorized: User is not candidate');
    }
    return this.notificationService.findAll(query, req.token.id);
  }

  @Get('unread')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Get all unread notifications' })
  @ApiBearerAuth()
  countRead(@Req() req: Request) {
    if (!req.token) {
      throw new Error('Unauthorized: No user found in request');
    }
    if (req.token.role !== getRoleId(TYPE_ACCOUNT.CANDIDATE)) {
      throw new Error('Unauthorized: User is not candidate');
    }
    return this.notificationService.countRead(req.token.id);
  }
}
