import { Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
//import { ApiUsers } from "../users/ApiUsers";
import { UserEntity } from './user.entity';
import { GroupEntity } from './group.entity';

@Entity('users_in_groups_entity', { schema: 'efennec_magazyn' })
export class UsersInGroupsEntity {
  @PrimaryGeneratedColumn({ type: 'int', name: 'id' })
  id: number;

  @ManyToOne(() => GroupEntity, (group) => group.usersInGroups, {
    onDelete: 'SET NULL',
    onUpdate: 'SET NULL',
  })
  @JoinColumn([{ name: 'groups_id', referencedColumnName: 'id' }])
  group: GroupEntity;

  @ManyToOne(() => UserEntity, (apiUsers) => apiUsers.id, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn([{ name: 'user_id', referencedColumnName: 'id' }])
  user: UserEntity;
}
