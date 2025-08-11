import { Injectable } from '@nestjs/common';
import { readFile } from 'fs/promises';
import * as handlebars from 'handlebars';
import { join } from 'path';

@Injectable()
export class HandlebarsService {
  private readonly templatesPath = join(
    process.cwd(),
    './src/5_shared/misc/handlebars/email',
  );

  async render(templateName: string, data: any): Promise<string> {
    const filePath = join(this.templatesPath, `${templateName}.hbs`);
    const file = await readFile(filePath, 'utf-8');
    const template = handlebars.compile(file);
    return template(data);
  }
}
