import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { UsersInGroupsEntity } from './userInGroup.entity';
import { TokenEntity } from '../../tokens/entities/token.entity';

@Entity({ name: 'users' })
export class UserEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 100 })
  email: string;

  @Column({ length: 100 })
  name: string;

  @Column({ length: 100 })
  surname: string;

  @Column({ length: 100 })
  password: string;

  @Column({ length: 30 })
  salt: string;

  @CreateDateColumn()
  createTime: Date;

  @UpdateDateColumn()
  updateTime: Date;

  @Column({ length: 100, nullable: true })
  resetPasswordCode: string | null;

  @OneToMany(() => UsersInGroupsEntity, (usersInGroups) => usersInGroups.user)
  @JoinColumn([{ referencedColumnName: 'id' }])
  userInGroups: UsersInGroupsEntity[];

  @OneToMany(() => TokenEntity, (token) => token.id)
  @JoinColumn([{ referencedColumnName: 'id' }])
  tokens: TokenEntity[];
}
