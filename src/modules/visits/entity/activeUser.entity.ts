import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { ActiveUserDetailEntity } from './ActiveUserDetail.entity';

@Entity({ name: 'activeUser' })
export class ActiveUserEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 100 })
  visitId: string;

  @Column({ type: 'datetime' })
  date: Date;

  @Column()
  active: Boolean = true;

  @Column()
  visitTime: number = 10;

  @Column({ type: 'tinytext', nullable: true })
  location_city = '';

  @Column({ type: 'tinytext', nullable: true })
  location_latitude = '';

  @Column({ type: 'tinytext', nullable: true })
  location_longitude = '';

  @Column({ type: 'tinytext', nullable: true })
  location_ip_md5 = '';

  @Column({ type: 'tinytext', nullable: true })
  location_country_code = '';

  @OneToMany(() => ActiveUserDetailEntity, (user) => user.id)
  ActiveUserDetails: ActiveUserDetailEntity[];

  @CreateDateColumn()
  createTime: Date;

  @UpdateDateColumn()
  updateTime: Date;
}
