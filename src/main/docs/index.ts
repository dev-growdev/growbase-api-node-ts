import { cardsPath, customersPath, getCardPath, paymentsPath } from './docs';
import {
  badRequestComponent,
  forbiddenComponent,
  notFoundComponent,
  securityComponent,
  serverErrorComponent,
} from './components';
import {
  uidSchema,
  cardParamsSchema,
  errorSchema,
  cardSchema,
  customerParamsSchema,
  customerSchema,
  paymentParamsSchema,
  paymentSchema,
  chargeSchema,
} from './schemas';

export default {
  openapi: '3.0.0',
  info: {
    title: 'GrowPay',
    description: 'API da Growdev para gerenciar cartões de créditos e pagamentos',
    version: '1.0.0',
  },
  servers: [
    {
      url: '/api',
    },
  ],
  paths: {
    '/cards': cardsPath,
    '/cards/{uid}': getCardPath,
    '/customers': customersPath,
    '/payments': paymentsPath,
  },
  schemas: {
    uid: uidSchema,
    cardParams: cardParamsSchema,
    error: errorSchema,
    card: cardSchema,
    customerParams: customerParamsSchema,
    customer: customerSchema,
    charge: chargeSchema,
    paymentParams: paymentParamsSchema,
    payment: paymentSchema,
  },
  components: {
    badRequest: badRequestComponent,
    serverError: serverErrorComponent,
    notFound: notFoundComponent,
    forbidden: forbiddenComponent,
    securitySchemes: securityComponent,
  },
};
