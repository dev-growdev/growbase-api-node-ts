export const cardParamsSchema = {
  type: 'object',
  properties: {
    hash: {
      type: 'string',
      summary: 'Hash dos dados do cartão',
    },
    uidOwner: {
      type: 'string',
      format: 'uuid',
    },
  },
  required: ['hash', 'uidOwner'],
};
