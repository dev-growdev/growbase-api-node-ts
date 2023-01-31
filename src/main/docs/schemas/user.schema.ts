export const userSchema = {
  type: 'object',
  properties: {
    userUid: {
      type: 'string',
      format: 'uuid',
      summary: 'Identificador do usuário',
    },
    profileUid: {
      type: 'string',
      format: 'uuid',
      summary: 'Identificador do perfil do usuário',
    },
    name: {
      type: 'string',
    },
    email: {
      type: 'string',
    },
    document: {
      type: 'string',
    },
  },
  required: ['userUid', 'profileUid', 'name', 'email'],
};

export const simpleUserSchema = {
  type: 'object',
  properties: {
    userUid: {
      type: 'string',
      format: 'uuid',
      summary: 'Identificador do usuário',
    },
    name: {
      type: 'string',
    },
  },
  required: ['userUid', 'name'],
};
