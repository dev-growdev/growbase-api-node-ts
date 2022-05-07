export const cardSchema = {
  type: 'object',
  properties: {
    uid: {
      type: 'string',
      format: 'uuid',
      summary: 'UID do cartão',
    },
    uidOwner: {
      type: 'string',
      format: 'uuid',
      summary: 'UID do usuário dono do cartão',
    },
    yearExp: {
      type: 'string',
      example: '2021',
    },
    monthExp: {
      type: 'string',
      example: '08',
    },
    lastNumbers: {
      type: 'string',
      example: '1234',
    },
    cardPartnerUid: {
      type: 'string',
      summary: 'UID do cartão na parceira',
    },
  },
};
