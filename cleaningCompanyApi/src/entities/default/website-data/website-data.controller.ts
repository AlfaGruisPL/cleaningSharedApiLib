import {
  Body,
  Controller,
  Get,
  Post,
  Req,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { WebsiteDataService } from './website-data.service';
import { Roles } from '../../../auth/guards/roles.decorator';
import { Role } from '../../../auth/guards/role.enum';
import { ApiDefaultResponse, ApiOperation } from '@nestjs/swagger';
import { WebsiteContent } from './models/websiteContent';
import { ContactFormDto } from './dto/contactForm.dto';

export class WebsiteContent2 {
  aboutUs = {
    titleOfHeading: '',
    shortDescription: '',
    fullDescription: '',
    imgId: '',
  };
  test: string = '123';
}

@Controller('website-data')
export class WebsiteDataController {
  constructor(private readonly websiteDataService: WebsiteDataService) {}

  @Get('defaultMenu')
  async getDefaultMenu(@Req() req: Request) {
    return await this.websiteDataService.getDefaultMenu(req);
  }

  @ApiOperation({
    summary: 'Wszystkie podstawowe dane strony (AboutUs, footer,header itp.)',
  })
  @ApiDefaultResponse({ type: WebsiteContent2 })
  @Get('')
  async getWebsiteData(): Promise<WebsiteContent> {
    return await this.websiteDataService.getWebsiteData();
  }

  @Post('')
  async settWebsiteData(@Body() body: WebsiteContent): Promise<WebsiteContent> {
    return await this.websiteDataService.setWebsiteData(body);
  }

  @Post('contactForm')
  async contactForm(@Body() body: ContactFormDto) {
    return await this.websiteDataService.contactForm(body);
  }

  @Roles(Role.admin)
  @Post('defaultMenu')
  @UsePipes(new ValidationPipe({ whitelist: true }))
  async setDefaultMenu(@Req() req: Request, @Body() body: ContactFormDto) {
    return await this.websiteDataService.setDefaultMenu(req, body);
  }
}
