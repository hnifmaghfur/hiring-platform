import { Injectable } from '@nestjs/common';
import { FindAllNotificationDto } from './dto/find-all-notification.dto';

import { InjectRepository } from '@nestjs/typeorm';
import { Notification } from './entities/notification.entity';
import { Repository } from 'typeorm';
import {
  errorResponse,
  paginatedResponse,
  successResponse,
  paginatedErrorResponse,
} from 'src/common/interfaces/response.interface';
import { Logger } from '@nestjs/common';

@Injectable()
export class NotificationService {
  private readonly logger = new Logger(NotificationService.name);

  constructor(
    @InjectRepository(Notification)
    private notificationRepository: Repository<Notification>,
  ) {}

  async findAll(query: FindAllNotificationDto, candidateId: string) {
    try {
      const { page = '1', limit = '10' } = query;
      const pageNum = parseInt(page, 10) || 1;
      const limitNum = parseInt(limit, 10) || 10;
      const skip = (pageNum - 1) * limitNum;

      // Mark all unread notifications as read for this candidate
      await this.notificationRepository.update(
        { candidate_id: candidateId, read: false },
        { read: true },
      );

      // Return all notifications for this candidate, newest first
      const [notifications, count] =
        await this.notificationRepository.findAndCount({
          where: { candidate_id: candidateId },
          order: { createdDate: 'DESC' },
          take: limitNum,
          skip: skip,
        });
      const totalPages = Math.ceil(count / limitNum);
      return paginatedResponse(
        notifications,
        {
          totalItems: count,
          itemCount: notifications.length,
          itemsPerPage: limitNum,
          totalPages,
          currentPage: pageNum,
        },
        'Notifications retrieved successfully',
      );
    } catch (error) {
      this.logger.error(`Error fetching notifications: ${error.message}`);
      return paginatedErrorResponse(error.message);
    }
  }

  async countRead(candidateId: string) {
    try {
      const count = await this.notificationRepository.count({
        where: { candidate_id: candidateId, read: false },
      });
      return successResponse(
        count,
        'Notifications count retrieved successfully',
      );
    } catch (error) {
      this.logger.error(`Error counting notifications: ${error.message}`);
      return errorResponse(error.message);
    }
  }
}
