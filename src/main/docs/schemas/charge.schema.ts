export const chargeSchema = {
  type: 'object',
  properties: {
    uid: {
      type: 'string',
      format: 'uuid',
      summary: 'Identificador do pagamento',
    },
    uidCustomer: {
      type: 'string',
      format: 'uuid',
      summary: 'Identificador do cliente',
    },
    idChargePartner: {
      type: 'string',
      summary: 'Identificador do pagamento no parceiro',
    },
    amount: {
      type: 'number',
      summary: 'Valor cobrado',
    },
    installments: {
      type: 'number',
      summary: 'Número de parcelas',
    },
    status: {
      type: 'string',
      enum: ['PAID', 'ACTIVE', 'ERROR', 'CANCELLED'],
      summary: 'Status da cobrança',
    },
    paymentType: {
      type: 'string',
      enum: ['CREDIT_CARD', 'BOLETO'],
      summary: 'Tipo do pagamento',
    },
    duaDate: {
      type: 'string',
      format: 'date',
      summary: 'Data de vencimento da cobrança.',
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
        'Juros ao mês. Recebe valores de 0.00 a 20.00. Só é efetivo se maxOverdueDays for maior que zero. O valor é dividido pelo número de dias para cobrança de juros diária.',
    },
    cancelledDate: {
      type: 'string',
      format: 'date',
      summary: 'Data de cancelamento',
    },
    payments: {
      type: 'array',
      items: {
        $ref: '#/schemas/payment',
      },
    },
  },
};
