export const categoriesPath = {
  get: {
    tags: ['Categorias'],
    sumary: 'API para listar todas categoriass',
    security: [
      {
        bearerAuth: [],
      },
    ],
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
                  type: 'array',
                  items: {
                    $ref: '#/schemas/category',
                  },
                  summary: 'Retorna uma lista de categorias.',
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
      401: {
        $ref: '#/components/unauthorized',
      },
      500: {
        $ref: '#components/serverError',
      },
    },
  },
  post: {
    tags: ['Categorias'],
    sumary: 'API para criar uma categoria',
    security: [
      {
        bearerAuth: [],
      },
    ],
    requestBody: {
      description: '',
      content: {
        'application/json': {
          schema: {
            type: 'object',
            properties: {
              name: {
                type: 'string',
                summary: 'Nome da catagoria',
              },
              description: {
                type: 'string',
                summary: 'Descrição da categoria',
              },
              image: {
                type: 'object',
                properties: {
                  url: {
                    type: 'string',
                    summary: 'URL da imagem',
                  },
                },
                required: ['url'],
              },
            },
            required: ['name', 'image'],
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
                  $ref: '#/schemas/category',
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

export const categoriesWithUidPath = {
  get: {
    tags: ['Categorias'],
    sumary: 'API para buscar uma categoria pelo indentificador',
    security: [
      {
        bearerAuth: [],
      },
    ],
    parameters: [
      {
        name: 'uid',
        in: 'path',
        description: 'Identificador da categoria',
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
              type: 'object',
              properties: {
                success: {
                  type: 'boolean',
                  summary: 'Indica se a requisição deu certo ou não',
                  example: true,
                },
                data: {
                  $ref: '#/schemas/category',
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
      401: {
        $ref: '#/components/unauthorized',
      },
      404: {
        $ref: '#/components/notFound',
      },
      500: {
        $ref: '#components/serverError',
      },
    },
  },
  put: {
    tags: ['Categorias'],
    sumary: 'API para atualizar uma categoria',
    security: [
      {
        bearerAuth: [],
      },
    ],
    parameters: [
      {
        name: 'uid',
        in: 'path',
        description: 'UID da categoria',
        required: true,
        schema: {
          type: 'string',
          format: 'uuid',
        },
      },
    ],
    requestBody: {
      description: '',
      content: {
        'application/json': {
          schema: {
            type: 'object',
            properties: {
              name: {
                type: 'string',
                summary: 'Nome da catagoria',
              },
              description: {
                type: 'string',
                summary: 'Descrição da categoria',
              },
              image: {
                type: 'object',
                properties: {
                  uid: {
                    type: 'string',
                    summary: 'Identificador da imagem',
                  },
                  url: {
                    type: 'string',
                    summary: 'URL da imagem',
                  },
                },
                required: ['url'],
              },
            },
            required: ['name', 'image'],
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
                  type: 'object',
                  $ref: '#/schemas/category',
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
      404: {
        $ref: '#/components/notFound',
      },
      500: {
        $ref: '#components/serverError',
      },
    },
  },
  delete: {
    tags: ['Categorias'],
    sumary: 'API para remover ou desabilitar uma categoria',
    security: [
      {
        bearerAuth: [],
      },
    ],
    parameters: [
      {
        name: 'uid',
        in: 'path',
        description: 'Identificador de uma categoria',
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
              type: 'object',
              properties: {
                success: {
                  type: 'boolean',
                  summary: 'Indica se a requisição deu certo ou não',
                  example: true,
                },
                data: {
                  $ref: '#/schemas/category',
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
      401: {
        $ref: '#/components/unauthorized',
      },
      404: {
        $ref: '#/components/notFound',
      },
      500: {
        $ref: '#components/serverError',
      },
    },
  },
};
