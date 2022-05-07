export const isValidDocument = (doc: string): boolean => {
  if (!doc) return false;

  if (doc.length != 11 && doc.length != 14) {
    return false;
  }

  if (doc.length == 11) {
    return isValidCPF(doc);
  }

  return isValidCNPJ(doc);
};

const isValidCPF = (cpf: string): boolean => {
  if (
    cpf == '00000000000' ||
    cpf == '11111111111' ||
    cpf == '22222222222' ||
    cpf == '33333333333' ||
    cpf == '44444444444' ||
    cpf == '55555555555' ||
    cpf == '66666666666' ||
    cpf == '77777777777' ||
    cpf == '88888888888' ||
    cpf == '99999999999'
  ) {
    return false;
  }
  let number = 0;
  let caracter = '';
  const numeros = '0123456789';
  let j = 10;
  let sum = 0;
  let rest = 0;
  let digit1 = 0;
  let digit2 = 0;
  let cpfAux = '';
  cpfAux = cpf.substring(0, 9);
  for (let i = 0; i < 9; i++) {
    caracter = cpfAux.charAt(i);
    if (numeros.search(caracter) == -1) {
      return false;
    }
    number = Number(caracter);
    sum = sum + number * j;
    j--;
  }
  rest = sum % 11;
  digit1 = 11 - rest;
  if (digit1 > 9) {
    digit1 = 0;
  }
  j = 11;
  sum = 0;
  cpfAux = cpfAux + digit1;
  for (let i = 0; i < 10; i++) {
    caracter = cpfAux.charAt(i);
    number = Number(caracter);
    sum = sum + number * j;
    j--;
  }
  rest = sum % 11;
  digit2 = 11 - rest;
  if (digit2 > 9) {
    digit2 = 0;
  }
  cpfAux = cpfAux + digit2;
  if (cpf != cpfAux) {
    return false;
  } else {
    return true;
  }
};

const isValidCNPJ = (value: string) => {
  // Teste Regex para veificar se é uma string apenas dígitos válida
  const digitsOnly = /^\d{14}$/.test(value);

  // Se o formato é válido, usa um truque para seguir o fluxo da validação
  if (!digitsOnly) return false;

  // Guarda um array com todos os dígitos do valor
  const match = value.toString().match(/\d/g);
  const numbers = Array.isArray(match) ? match.map(Number) : [];

  // Elimina inválidos com todos os dígitos iguais
  const items = [...new Set(numbers)];
  if (items.length === 1) return false;

  // Cálculo validador
  const calc = (x: number) => {
    const slice = numbers.slice(0, x);
    let factor = x - 7;
    let sum = 0;

    for (let i = x; i >= 1; i--) {
      const n = slice[x - i];
      sum += n * factor--;
      if (factor < 2) factor = 9;
    }

    const result = 11 - (sum % 11);

    return result > 9 ? 0 : result;
  };

  // Separa os 2 últimos dígitos de verificadores
  const digits = numbers.slice(12);

  // Valida 1o. dígito verificador
  const digit0 = calc(12);
  if (digit0 !== digits[0]) return false;

  // Valida 2o. dígito verificador
  const digit1 = calc(13);
  return digit1 === digits[1];
};
