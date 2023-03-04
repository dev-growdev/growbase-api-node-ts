export interface FaqModel {
  uid: string;
  question: string;
  answer: string;
}

export class Faq {
  #uid: string;
  get uid(): string {
    return this.#uid;
  }

  #question: string;
  get question(): string {
    return this.#question;
  }

  #answer: string;
  get answer(): string {
    return this.#answer;
  }

  constructor({ uid, question, answer }: FaqModel) {
    this.#uid = uid;
    this.#answer = answer;
    this.#question = question;
  }

  toJson(): FaqModel {
    return {
      uid: this.#uid,
      question: this.#question,
      answer: this.#answer,
    };
  }
}
