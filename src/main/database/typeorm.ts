import { DataSource } from 'typeorm';
import config from './ormconfig';
import '../config/module-alias';

export const dataSource = new DataSource(config);
