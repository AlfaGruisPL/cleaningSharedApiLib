import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from './entities/user.entity';
import { GroupEntity } from './entities/group.entity';
import { UsersInGroupsEntity } from './entities/userInGroup.entity';
import { EmailsModule } from '../../../modules/emails/emails.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([UserEntity]),
    TypeOrmModule.forFeature([GroupEntity]),
    TypeOrmModule.forFeature([UsersInGroupsEntity]),
    EmailsModule,
  ],
  controllers: [UsersController],
  providers: [UsersService],
  exports: [
    TypeOrmModule.forFeature([UserEntity]),
    TypeOrmModule.forFeature([GroupEntity]),
    TypeOrmModule.forFeature([UsersInGroupsEntity]),
  ],
})
export class UsersModule {}
