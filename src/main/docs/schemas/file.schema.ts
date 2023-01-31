export const fileSchema = {
  type: 'object',
  properties: {
    uid: {
      type: 'string',
      format: 'uuid',
      summary: 'Identificador da imagem',
    },
    url: {
      type: 'string',
      summary: 'URl da imagem',
    },
  },
  required: ['uid', 'url'],
};
