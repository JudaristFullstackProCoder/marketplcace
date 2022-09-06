import * as Transformer from 'object-transformer';
import { FamilyDocument } from './entities/family.entity';

const remove__vSchema = {
  name: 'name',
};

export const remove_v = function remove_v(family: FamilyDocument) {
  return new Transformer.Single(family, remove__vSchema).parse();
};
