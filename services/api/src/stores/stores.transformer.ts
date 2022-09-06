import * as Transformer from 'object-transformer';
import { StoreDocument } from './entities/store.entity';

const remove__vSchema = {
  name: 'name',
};

export const remove__v = function remove__v(store: StoreDocument) {
  return new Transformer.Single(store, remove__vSchema).parse();
};
