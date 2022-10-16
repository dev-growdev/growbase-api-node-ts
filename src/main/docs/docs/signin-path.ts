export const signinPath = {
  post: {
    tags: ['Sign in'],
    sumary: 'API para realizar login',
    requestBody: {
      content: {
        'application/json': {
          schema: {
            type: 'object',
            properties: {
              login: {
                type: 'string',
              },
              password: {
                type: 'string',
              },
            },
            required: ['login', 'password'],
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
              type: 'object',
              properties: {
                success: {
                  type: 'boolean',
                  summary: 'Indica se a requisição deu certo ou não',
                  example: true,
                },
                data: {
                  $ref: '#/schemas/auth',
                },
                code: {
                  type: 'integer',
                  summary: 'Conforme o padrão Rest API',
                  example: 200,
                },
              },
            },
          },
        },
      },
      400: {
        $ref: '#/components/badRequest',
      },
      401: {
        $ref: '#/components/unauthorized',
      },
      500: {
        $ref: '#components/serverError',
      },
    },
  },
};
