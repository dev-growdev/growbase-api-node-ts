import 'dotenv/config';
import { addAlias } from 'module-alias';
import { resolve } from 'path';

const rootDir = process.env.NODE_ENV === 'development' ? 'src' : 'dist';

addAlias('@main', resolve(rootDir, 'main'));
addAlias('@shared', resolve(rootDir, 'app/shared'));
addAlias('@authentication', resolve(rootDir, 'app/features/authentication'));
addAlias('@products', resolve(rootDir, 'app/features/products'));
addAlias('@example', resolve(rootDir, 'app/features/example'));
