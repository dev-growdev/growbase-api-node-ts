export const cardsPath = {
  post: {
    tags: ['Cartões'],
    sumary: 'API para salvar cartão',
    security: [
      {
        ApiKeyAuth: [],
      },
    ],
    requestBody: {
      description: '',
      content: {
        'application/json': {
          schema: {
            $ref: '#/schemas/cardParams',
          },
        },
      },
    },
    responses: {
      200: {
        description: 'Sucesso',
        content: {
          'application/json': {
            schema: {
              $ref: '#/schemas/uid',
            },
          },
        },
      },
      400: {
        $ref: '#/components/badRequest',
      },
      403: {
        $ref: '#/components/forbidden',
      },
      500: {
        $ref: '#components/serverError',
      },
    },
  },
};

export const getCardPath = {
  get: {
    tags: ['Cartões'],
    sumary: 'API para salvar cartão',
    security: [
      {
        ApiKeyAuth: [],
      },
    ],
    parameters: [
      {
        name: 'uid',
        in: 'path',
        description: 'UID do cartão',
        required: true,
        schema: {
          type: 'string',
          format: 'uuid',
        },
      },
    ],
    responses: {
      200: {
        description: 'Sucesso',
        content: {
          'application/json': {
            schema: {
              $ref: '#/schemas/card',
            },
          },
        },
      },
      403: {
        $ref: '#/components/forbidden',
      },
      404: {
        $ref: '#/components/notFound',
      },
    },
  },
};
