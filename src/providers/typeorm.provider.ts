import { DataSource } from 'typeorm';
import { Provider } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

export const DatabaseProvider: Provider = {
  provide: 'DATA_SOURCE',
  inject: [ConfigService],
  useFactory: async (config: ConfigService) => {
    const dataSource = new DataSource({
      type: 'mariadb',
      host: config.get('DB_HOST'),
      port: config.get<number>('DB_PORT'),
      username: config.get('DB_USERNAME'),
      password: config.get('DB_PASSWORD'),
      database: config.get('DB_DATABASE'),
      entities: [],
      synchronize: true,
    });

    return dataSource.initialize();
  },
};
