import {
  categoriesPath,
  categoriesWithUidPath,
  productsPath,
  productsWithUidPath,
  signinPath,
  signupPath,
} from './docs';
import {
  badRequestComponent,
  unauthorizedComponent,
  notFoundComponent,
  securityComponent,
  serverErrorComponent,
} from './components';
import {
  authSchema,
  categorySchema,
  errorSchema,
  fileSchema,
  productSchema,
  simpleUserSchema,
  userSchema,
} from './schemas';

export default {
  openapi: '3.0.0',
  info: {
    title: 'Growbase API',
    description: 'Projeto base da Growdev',
    version: '1.0.0',
  },
  servers: [
    {
      url: '/api',
    },
  ],
  paths: {
    '/signin': signinPath,
    '/signup': signupPath,
    '/categories': categoriesPath,
    '/categories/{uid}': categoriesWithUidPath,
    '/products': productsPath,
    '/products/{uid}': productsWithUidPath,
  },
  schemas: {
    error: errorSchema,
    category: categorySchema,
    file: fileSchema,
    user: userSchema,
    simpleUser: simpleUserSchema,
    auth: authSchema,
    product: productSchema,
  },
  components: {
    badRequest: badRequestComponent,
    serverError: serverErrorComponent,
    notFound: notFoundComponent,
    unauthorized: unauthorizedComponent,
    securitySchemes: securityComponent,
  },
};
