import * as t from 'object-transformer';
import { CartDocument } from './entities/cart.entity';

const remove__v_schema = {
  cart_id: '_id',
  cart_user: 'user',
};

export const remove__v = function remove__v(cart: CartDocument) {
  return new t.Single(cart, remove__v_schema).parse();
};
