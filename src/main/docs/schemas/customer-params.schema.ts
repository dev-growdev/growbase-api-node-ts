export const customerParamsSchema = {
  type: 'object',
  properties: {
    name: {
      type: 'string',
    },
    document: {
      type: 'string',
      summary: 'CPF/CNPJ do cliente (somente números)',
    },
    email: {
      type: 'string',
      format: 'email',
    },
    phone: {
      type: 'string',
      summary: 'Contato do cliente (somente números)',
    },
    linesOfBusiness: {
      type: 'string',
      summary: 'Define a linha de negócio do cliente (descrição breve)',
    },
    companyType: {
      type: 'string',
      enum: ['MEI', 'EI', 'EIRELI', 'LTDA', 'SA', 'INSTITUITION_NGO_ASSOCIATION'],
      summary: 'Valores permitidos: MEI, EI, EIRELI, LTDA, SA e INSTITUITION_NGO_ASSOCIATION',
    },
    businessArea: {
      type: 'number',
      summary: 'Defini a área do negócio da empresa',
    },
    legalRepresentative: {
      type: 'object',
      properties: {
        name: {
          type: 'string',
        },
        document: {
          type: 'string',
          summary: 'CPF do representante (somente números)',
        },
        birthDate: {
          type: 'string',
          format: 'date',
        },
        motherName: {
          type: 'string',
        },
        type: {
          type: 'string',
          enum: ['INDIVIDUAL', 'ATTORNEY', 'DESIGNEE', 'MEMBER', 'DIRECTOR', 'PRESIDENT'],
          summary:
            'Valores permitidos: INDIVIDUAL, ATTORNEY, DESIGNEE, MEMBER, DIRECTOR e PRESIDENT',
        },
      },
      required: ['name', 'document', 'birthDate', 'motherName', 'type'],
    },
    address: {
      type: 'object',
      properties: {
        street: {
          type: 'string',
        },
        number: {
          type: 'string',
        },
        complement: {
          type: 'string',
        },
        neighborhood: {
          type: 'string',
        },
        city: {
          type: 'string',
        },
        state: {
          type: 'string',
          summary: 'Somente o UF',
        },
        postCode: {
          type: 'string',
          summary: 'CEP somente com os números',
        },
      },
      required: ['street', 'number', 'neighborhood', 'city', 'state', 'postCode'],
    },
    bankAccount: {
      type: 'object',
      properties: {
        bankNumber: {
          type: 'string',
          summary: 'Código do banco',
          minLength: 3,
          maxLength: 3,
        },
        agencyNumber: {
          type: 'string',
        },
        accountNumber: {
          type: 'string',
        },
        accountComplementNumber: {
          type: 'string',
          enum: ['001', '002', '003', '006', '007', '013', '022', '023', '028', '043', '031'],
          summary: 'Exclusivo e obrigatório apenas para contas Caixa.',
        },
        accountType: {
          type: 'string',
          enum: ['CHECKING', 'SAVINGS'],
        },
        accountHolder: {
          type: 'object',
          properties: {
            name: {
              type: 'string',
            },
            document: {
              type: 'string',
              summary: 'CPF do representante (somente números)',
            },
          },
          required: ['name', 'document'],
        },
      },
      required: ['bankNumber', 'agencyNumber', 'accountNumber', 'accountType', 'accountHolder'],
    },
    cnae: {
      type: 'string',
    },
    establishmentDate: {
      type: 'string',
      format: 'date',
      summary: 'Data de abertura da empresa',
    },
    monthlyIncomeOrRevenue: {
      type: 'number',
      format: 'double',
      summary: 'Renda mensal ou receita',
    },
    companyMembers: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          name: {
            type: 'string',
          },
          document: {
            type: 'string',
            summary: 'CPF do representante (somente números)',
          },
          birthDate: {
            type: 'string',
            format: 'date',
          },
        },
        required: ['name', 'document', 'birthDate'],
      },
    },
  },
  required: [
    'name',
    'document',
    'email',
    'phone',
    'linesOfBusiness',
    'companyType',
    'businessArea',
    'legalRepresentative',
    'address',
    'bankAccount',
    'cnae',
    'establishmentDate',
    'monthlyIncomeOrRevenue',
    'companyMembers',
  ],
};
