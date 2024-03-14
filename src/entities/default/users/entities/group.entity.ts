import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { UsersInGroupsEntity } from './userInGroup.entity';

@Entity('groups')
export class GroupEntity {
  @PrimaryGeneratedColumn({ type: 'int', name: 'id' })
  id: number;

  @Column('varchar', { name: 'name', length: 50 })
  name: string;

  @OneToMany(() => UsersInGroupsEntity, (usersInGroups) => usersInGroups.group)
  usersInGroups: UsersInGroupsEntity[];
}
