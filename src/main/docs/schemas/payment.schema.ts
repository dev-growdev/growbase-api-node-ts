export const paymentSchema = {
  type: 'object',
  properties: {
    uid: {
      type: 'string',
      format: 'uuid',
      summary: 'Identificador do pagamento',
    },
    uidCharge: {
      type: 'string',
      format: 'uuid',
      summary: 'Identificador da cobrança deste pagamento',
    },
    idPaymentPartner: {
      type: 'string',
      summary: 'Identificador do pagamento no parceiro',
    },
    amount: {
      type: 'number',
      summary: 'Valor cobrado',
    },
    amountConfirmed: {
      type: 'number',
      summary: 'Valor confirmado',
    },
    status: {
      type: 'string',
      enum: ['CONFIRMED', 'AUTHORIZED', 'ERROR'],
      summary: 'Status do pagamento',
    },
    amountCancelled: {
      type: 'number',
      summary: 'Valor cancelado',
    },
    idCancelledPartner: {
      type: 'string',
      summary: 'Identificador do cancelamento no parceiro',
    },
    cancelledDate: {
      type: 'string',
      format: 'date',
      summary: 'Data do cancelamento',
    },
  },
};
