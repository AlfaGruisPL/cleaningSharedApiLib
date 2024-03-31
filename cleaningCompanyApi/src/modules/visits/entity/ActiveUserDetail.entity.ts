import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { ActiveUserEntity } from './activeUser.entity';

@Entity({ name: 'activeUserDetail' })
export class ActiveUserDetailEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'datetime' })
  date: Date;

  @ManyToOne(() => ActiveUserEntity, (user) => user.id, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn([{ referencedColumnName: 'id' }])
  ActiveUser: ActiveUserEntity;
}
