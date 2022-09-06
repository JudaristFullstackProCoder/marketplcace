import { VariationDocument } from './entities/variation.entity';
import * as t from 'object-transformer';

const remove__vSchema = {};

export const remove__v_variation = function remove__v_variation(
  variation: VariationDocument,
) {
  return new t.Single(variation, remove__vSchema).parse();
};
