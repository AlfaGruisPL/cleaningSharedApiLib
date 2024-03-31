import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';
import { ContactFormDto } from '../../entities/default/website-data/dto/contactForm.dto';
import { DataSource } from 'typeorm';
import { WebsiteDataEntity } from '../../entities/default/website-data/entities/websiteData.entity';

@Injectable()
export class EmailsService {
  constructor(
    private mailerService: MailerService,
    private dataSource: DataSource,
  ) {}

  async sendMailTest() {
    return await this.mailerService.sendMail({
      to: 'korneliamushak@gmail.com',
      //  to: 'alfagruis@gmail.com',
      subject: 'testowy email',
      template: './test',
    });
  }

  async SendResetPassword(link: string, email: string) {
    return await this.mailerService.sendMail({
      to: email,
      //  to: 'alfagruis@gmail.com',
      subject: 'Password reset',
      template: './resetPassword',
      context: {
        link: link,
      },
    });
  }

  async sendPasswordToUser(password: string, email: string) {
    return await this.mailerService.sendMail({
      to: email,
      //  to: 'alfagruis@gmail.com',
      subject: 'Register new administrator',
      template: './newUser',
      context: {
        password: password,
      },
    });
  }

  async SendContactFormEmail(body: ContactFormDto) {
    const find = await this.dataSource.manager.findOne(WebsiteDataEntity, {
      where: {
        name: 'formContactEmail',
      },
    });
    if (!find) {
      throw new InternalServerErrorException(
        'No formContactEmail record find in DB',
      );
    }
    return await this.mailerService.sendMail({
      to: find.value,
      //  to: 'alfagruis@gmail.com',
      subject: 'Message from contactForm',
      template: './contactForm',
      context: {
        content: body.content,
        name: body.name,
        numberOfPhone: body.numberOfPhone,
        email: body.email,
      },
    });
  }
}
