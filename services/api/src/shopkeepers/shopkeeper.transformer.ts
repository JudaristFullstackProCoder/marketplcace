import * as Transformer from 'object-transformer';
import { ShopkeeperDocument } from './entities/shopkeeper.entity';

const remove__vSchema = {
  user: 'user',
  permsissions: 'perms',
};

/**
 * Remove the key _v from shopkeeper mongoose model
 * @param shopkeeper shopkeeper document
 * @returns
 */
export const remove__v_shopkeeper = function remove__v_shopkeeper(
  shopkeeper: ShopkeeperDocument,
) {
  return new Transformer.Single(shopkeeper, remove__vSchema).parse();
};
