import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { WebsiteDataEntity } from './entities/websiteData.entity';
import { WebsiteContent } from './models/websiteContent';
import { ContactFormDto } from './dto/contactForm.dto';
import { EmailsService } from '../../../modules/emails/emails.service';

@Injectable()
export class WebsiteDataService {
  constructor(
    @InjectRepository(WebsiteDataEntity)
    private websiteDataEntityRepository: Repository<WebsiteDataEntity>,
    private email_: EmailsService,
  ) {}

  async getDefaultMenu(req: Request) {
    if (
      !(await this.websiteDataEntityRepository.existsBy({
        name: 'defaultMenu',
      }))
    ) {
      console.log(1);
      const tmp = new WebsiteDataEntity();
      tmp.name = 'defaultMenu';
      await this.websiteDataEntityRepository.save(tmp);
      return tmp;
    }
    const data = await this.websiteDataEntityRepository.findOneOrFail({
      where: {
        name: 'defaultMenu',
      },
    });
    try {
      data.value = JSON.parse(data.value);
      return data;
    } catch (error) {
      console.log(error);
      return [];
    }
  }

  async setDefaultMenu(req: Request, body: any) {
    await this.websiteDataEntityRepository.update(
      {
        name: 'defaultMenu',
      },
      { value: JSON.stringify(body) },
    );
    return await this.getDefaultMenu(req);
  }

  async getWebsiteData() {
    /*await this.websiteDataEntityRepository.update(
      { name: 'defaultData' },
      { value: JSON.stringify(new WebsiteContent()) },
    );*/
    const data = (
      await this.websiteDataEntityRepository.findOne({
        where: { name: 'defaultData' },
      })
    ).value;
    return JSON.parse(data) as WebsiteContent;
  }

  async setWebsiteData(body: WebsiteContent) {
    await this.websiteDataEntityRepository.update(
      { name: 'defaultData' },
      { value: JSON.stringify(body) },
    );
    return this.getWebsiteData();
  }

  async contactForm(body: ContactFormDto) {
    await this.email_.SendContactFormEmail(body);
  }
}
