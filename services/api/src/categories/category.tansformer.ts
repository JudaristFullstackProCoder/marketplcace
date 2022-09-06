import Transformer from 'object-transformer';
import { CategoryDocument } from './entities/category.entity';

const getCategoryAsItemSchema = {
  id: '_id',
  name: 'name',
  shortname: 'shortname',
};

export const trimCategoryKeys = function trimCategoryKeys(
  el: CategoryDocument,
) {
  return Transformer.Single(el, getCategoryAsItemSchema).parse();
};
