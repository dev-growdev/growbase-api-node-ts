import { ProductDTO } from '../../dtos';
import { Product } from '../../models';

export interface CreateProductRepository {
  createProduct(product: ProductDTO): Promise<Product>;
}
