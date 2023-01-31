export const productSchema = {
  type: 'object',
  properties: {
    uid: {
      type: 'string',
      format: 'uuid',
      summary: 'Identificador do produto',
    },
    name: {
      type: 'string',
    },
    description: {
      type: 'string',
    },
    enable: {
      type: 'boolean',
      summary: 'Indica se o produto está ativo ou desativado',
    },
    coverImage: {
      $ref: '#/schemas/file',
      summary: 'Imagem principal deste produto para usar de capa',
    },
    images: {
      type: 'array',
      items: {
        $ref: '#/schemas/file',
      },
      summary: 'Imagens deste produto',
    },
    categories: {
      type: 'array',
      items: {
        $ref: '#/schemas/category',
      },
    },
    createdUser: {
      $ref: '#/schemas/simpleUser',
      summary: 'Usuário que criou este produto',
    },
  },
  required: ['uid', 'name', 'description', 'enable', 'coverImage', 'images'],
};
