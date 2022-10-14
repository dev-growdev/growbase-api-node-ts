import 'dotenv/config';
import { addAlias } from 'module-alias';
import { resolve } from 'path';

const rootDir = process.env.NODE_ENV === 'development' ? 'src' : 'dist';

addAlias('@main', resolve(rootDir, 'main'));
addAlias('@envs', resolve(rootDir, 'app/envs'));
addAlias('@models', resolve(rootDir, 'app/models'));
addAlias('@shared', resolve(rootDir, 'app/shared'));
addAlias('@authentication', resolve(rootDir, 'app/features/authentication'));
addAlias('@categories', resolve(rootDir, 'app/features/categories'));
