import { ConflictException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserEntity } from './entities/user.entity';
import { AddUserDto } from './dto/AddUser.dto';
import { UsersInGroupsEntity } from './entities/userInGroup.entity';
import { GroupEntity } from './entities/group.entity';
import { sha256 } from 'js-sha256';
import { EmailsService } from '../../../modules/emails/emails.service';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UserEntity)
    private usersRepository: Repository<UserEntity>,
    @InjectRepository(UsersInGroupsEntity)
    private UsersInGroupsRepository: Repository<UsersInGroupsEntity>,
    private email_: EmailsService,
  ) {}

  async getUserList(reg: Request) {
    const usersList = await this.usersRepository.find({
      select: {
        email: true,
        createTime: true,
        name: true,
        surname: true,
        id: true,
      },
      relations: {
        userInGroups: {
          group: true,
        },
      },
    });
    usersList.forEach((user) => {
      user.userInGroups.forEach((userInGroup) => {
        userInGroup['name'] = userInGroup.group.name;
        delete userInGroup.id;
        userInGroup['id'] = userInGroup.group.id;
        delete userInGroup.group;
      });
    });
    return usersList;
  }

  async addUser(reg: Request, body: AddUserDto) {
    const find = await this.usersRepository.findOne({
      where: { email: body.email },
    });
    if (find) {
      throw new ConflictException();
    }
    const user = new UserEntity();
    user.name = body.name;
    user.surname = body.surname;
    user.email = body.email;
    user.salt = Math.round(
      Math.random() * 9999999 +
        Math.random() * 9999999 +
        Math.random() * 9999999,
    ).toString();
    const password = Math.round(Math.random() * 9999999).toString();
    await this.email_.sendPasswordToUser(password, user.email);
    //todo tu dorobić
    const passwordHash = sha256(process.env.SALT + password + user.salt);
    user.password = password;
    console.log('Haslo to: ', password);
    await this.usersRepository.save(user);
    const userInGroup = new UsersInGroupsEntity();
    userInGroup.user = user;
    userInGroup.group = new GroupEntity();
    userInGroup.group.id = 1;
    await this.UsersInGroupsRepository.save(userInGroup);

    return true;
  }

  async deleteUser(reg: Request, id: number) {
    return await this.usersRepository.delete({ id: id });
  }

  async patchUser(reg: Request, id: number, body: AddUserDto) {
    return await this.usersRepository.update({ id: id }, body);
  }
}
