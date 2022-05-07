export const paymentParamsSchema = {
  type: 'object',
  properties: {
    charge: {
      type: 'object',
      summary: 'Dados do pagamento',
      properties: {
        description: {
          type: 'string',
          summary: 'Descrição do pagamento',
        },
        amount: {
          type: 'number',
          summary: 'Valor a ser cobrado',
        },
        paymentType: {
          type: 'string',
          enum: ['CREDIT_CARD', 'BOLETO'],
          summary: 'Pagamento pode ser com boleto ou cartão de crédito',
        },
        installments: {
          type: 'number',
          summary: 'Número de parcelas',
        },
        duaDate: {
          type: 'string',
          format: 'date',
          summary:
            'Data de vencimento da cobrança. Por pradrão o vencimento é sempre depois de 3 dias',
        },
        maxOverdueDays: {
          type: 'number',
          summary: 'Número de dias permitido para pagamento após o vencimento. Por padrão é 0',
        },
        fine: {
          type: 'number',
          format: 'float',
          minimun: 1,
          maximum: 20,
          summary:
            'Multa para pagamento após o vencimento. Recebe valores de 0.00 a 20.00. Só é efetivo se maxOverdueDays for maior que zero.',
        },
        interest: {
          type: 'number',
          format: 'float',
          minimun: 1,
          maximum: 20,
          summary:
            'Juros ao mês. Recebe valores de 0.00 a 20.00. Só é efetivo se maxOverdueDays for maior que zero. O valor inserido é dividido pelo número de dias para cobrança de juros diária.',
        },
      },
      required: ['description', 'amount', 'paymentType'],
    },
    payer: {
      type: 'object',
      summary: 'Dados do pagador',
      properties: {
        name: {
          type: 'string',
        },
        document: {
          type: 'string',
          summary: 'CPF do pagador (somente números)',
        },
        email: {
          type: 'string',
          format: 'email',
        },
        uidCard: {
          type: 'string',
          format: 'uuid',
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
      },
      required: ['name', 'document', 'email', 'uidCard', 'address'],
    },
  },
  required: ['charge', 'payer'],
};
