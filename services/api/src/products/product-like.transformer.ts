import { ProductViewer } from './entities/product-viewers.entity';

export * as transformer from 'object-transformer';

const remove__v_product_LikeSchema = {
  userId: 'user',
  product: 'product',
};

export const remove__v_product_like = function remove__v_product_like(
  productViewer: ProductViewer,
) {
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  return new transformer.Single(
    productViewer,
    remove__v_product_LikeSchema,
  ).parse();
};

export const remove__v_product_likeCollection =
  function remove__v_product_likeCollection(productLike: ProductViewer[]) {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    return new transformer.List(
      productLike,
      remove__v_product_LikeSchema,
    ).parse();
  };
