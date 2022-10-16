export const productsPath = {
  get: {
    tags: ['Produtos'],
    sumary: 'API para listar todos produtos',
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
                    $ref: '#/schemas/product',
                  },
                  summary: 'Retorna uma lista de produtos.',
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
    tags: ['Produtos'],
    sumary: 'API para criar um produto',
    security: [
      {
        bearerAuth: [],
      },
    ],
    requestBody: {
      content: {
        'application/json': {
          schema: {
            type: 'object',
            properties: {
              name: {
                type: 'string',
                summary: 'Nome do produto',
              },
              description: {
                type: 'string',
                summary: 'Descrição da produto',
              },
              categories: {
                type: 'array',
                items: {
                  type: 'object',
                  properties: {
                    uid: {
                      type: 'string',
                      format: 'uuid',
                      summary: 'Identificador da categoria',
                    },
                  },
                  required: ['uid'],
                },
              },
              images: {
                type: 'array',
                items: {
                  type: 'object',
                  properties: {
                    url: {
                      type: 'string',
                      summary: 'URL da imagem',
                    },
                    isMain: {
                      type: 'boolean',
                      summary: 'Inidica se imagem é a principal ou não.',
                    },
                  },
                },
                required: ['url', 'isMain'],
              },
            },
            required: ['name', 'description', 'categories', 'images'],
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
                  $ref: '#/schemas/product',
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

export const productsWithUidPath = {
  get: {
    tags: ['Produtos'],
    sumary: 'API para buscar um produto pelo indentificador',
    security: [
      {
        bearerAuth: [],
      },
    ],
    parameters: [
      {
        name: 'uid',
        in: 'path',
        description: 'Identificador do produto',
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
                  $ref: '#/schemas/product',
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
    tags: ['Produtos'],
    sumary: 'API para atualizar um produto',
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
      content: {
        'application/json': {
          schema: {
            type: 'object',
            properties: {
              name: {
                type: 'string',
                summary: 'Nome do produto',
              },
              description: {
                type: 'string',
                summary: 'Descrição da produto',
              },
              categories: {
                type: 'array',
                items: {
                  type: 'object',
                  properties: {
                    uid: {
                      type: 'string',
                      format: 'uuid',
                      summary: 'Identificador da categoria',
                    },
                  },
                  required: ['uid'],
                },
              },
              images: {
                type: 'array',
                items: {
                  type: 'object',
                  properties: {
                    uid: {
                      type: 'string',
                      format: 'uuid',
                      summary: 'Identificador da imagem',
                    },
                    url: {
                      type: 'string',
                      summary: 'URL da imagem',
                    },
                    isMain: {
                      type: 'boolean',
                      summary: 'Inidica se imagem é a principal ou não.',
                    },
                  },
                },
                required: ['url', 'isMain'],
              },
            },
            required: ['name', 'description', 'categories', 'images'],
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
                  $ref: '#/schemas/product',
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
    tags: ['Produtos'],
    sumary: 'API para desabilitar um produto',
    security: [
      {
        bearerAuth: [],
      },
    ],
    parameters: [
      {
        name: 'uid',
        in: 'path',
        description: 'Identificador do produto',
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
                  $ref: '#/schemas/product',
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
