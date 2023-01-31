export const signupPath = {
  post: {
    tags: ['Sign up'],
    sumary: 'API para criar uma conta de usuário',
    requestBody: {
      content: {
        'application/json': {
          schema: {
            type: 'object',
            properties: {
              name: {
                type: 'string',
                summary: 'Nome do usuário',
              },
              email: {
                type: 'string',
              },
              password: {
                type: 'string',
              },
              document: {
                type: 'string',
                summary: 'CPF do usuário',
              },
            },
            required: ['name', 'email', 'password', 'document'],
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
                  $ref: '#/schemas/user',
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
