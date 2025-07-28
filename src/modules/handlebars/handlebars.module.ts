import { Module } from '@nestjs/common';

import { HandlebarsService } from './services/handlebars.service';

@Module({
  providers: [HandlebarsService],
  exports: [HandlebarsService],
})
export class HandlebarsModule {}
