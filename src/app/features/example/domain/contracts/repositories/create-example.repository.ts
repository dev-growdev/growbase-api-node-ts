import { Example } from '../../models';
import { ExampleDTO } from '../../dtos';

export interface CreateExampleRepository {
  createExample(example: ExampleDTO): Promise<Example>;
}
