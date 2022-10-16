export const categorySchema = {
  type: 'object',
  properties: {
    uid: {
      type: 'string',
      format: 'uuid',
      summary: 'Identificador da categoria',
    },
    name: {
      type: 'string',
    },
    description: {
      type: 'string',
    },
    enable: {
      type: 'boolean',
      summary: 'Indica se a categoria está ativa ou desativada',
    },
    image: {
      $ref: '#/schemas/file',
    },
  },
  required: ['uid', 'name', 'enable', 'image'],
};
