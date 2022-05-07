export const customersPath = {
  post: {
    tags: ['Clientes'],
    sumary: 'API para criar um clinte',
    requestBody: {
      description: '',
      content: {
        'application/json': {
          schema: {
            $ref: '#/schemas/customerParams',
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
              $ref: '#/schemas/customer',
            },
          },
        },
      },
      400: {
        $ref: '#/components/badRequest',
      },
      500: {
        $ref: '#components/serverError',
      },
    },
  },
};
