export const errorSchema = {
  type: 'object',
  properties: {
    success: {
      type: 'boolean',
      summary: 'Indica se a requisição deu certo ou não',
      example: false,
    },
    code: {
      type: 'integer',
      summary: 'Conforme o padrão Rest API',
    },
    error: {
      type: 'object',
      properties: {
        process: {
          type: 'string',
        },
        message: {
          type: 'string',
          summary: 'Mensagem amigável para mostrar ao usuário',
        },
        details: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              name: {
                type: 'string',
              },
              description: {
                type: 'string',
              },
            },
          },
        },
      },
    },
  },
};
