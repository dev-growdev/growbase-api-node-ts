export const securityComponent = {
  ApiKeyAuth: {
    type: 'apiKey',
    in: 'header',
    name: 'X-API-KEY',
    description: 'Informar a Private Key para acessar as rotas protegidas',
  },
};
