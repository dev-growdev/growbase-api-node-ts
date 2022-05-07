export const paymentsPath = {
  post: {
    tags: ['Pagamentos'],
    sumary: 'API para criar pagamentos',
    security: [
      {
        ApiKeyAuth: [],
      },
    ],
    requestBody: {
      description: 'Dados para pagamento',
      content: {
        'application/json': {
          schema: {
            $ref: '#/schemas/paymentParams',
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
              $ref: '#/schemas/charge',
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
