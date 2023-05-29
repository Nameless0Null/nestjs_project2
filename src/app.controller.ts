import { Controller, Get, Render} from '@nestjs/common';
import { AppService } from './app.service';

import { Response, Request } from 'express';


@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {
    this.appService = appService;
  }

    @Get('/login')
    @Render('login')
    root1(){}
  
    @Get('/signup')
    @Render('signup')
    root2(){}

    @Get('/home')
    @Render('home')
    root3(){}
}
