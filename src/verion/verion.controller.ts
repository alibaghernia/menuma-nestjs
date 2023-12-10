import { Controller, Get } from '@nestjs/common';
import * as fs from 'fs/promises';

@Controller('verion')
export class VerionController {
  @Get()
  async vertion() {
    const getGitId = async () => {
      const gitId = await fs.readFile('.git/HEAD', 'utf8');
      if (gitId.indexOf(':') === -1) {
        return gitId;
      }
      const refPath = '.git/' + gitId.substring(5).trim();
      return await fs.readFile(refPath, 'utf8');
    };

    return { vertion: (await getGitId()).substring(0, 7) };
  }
}
