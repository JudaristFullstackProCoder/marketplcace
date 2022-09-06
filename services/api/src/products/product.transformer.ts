import * as t from 'object-transformer';

const remove__v_productSchema = {};

export const remove__v_product = function remove__v_product(product: any) {
  return new t.Single(product, remove__v_productSchema).parse();
};
