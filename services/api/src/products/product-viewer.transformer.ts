import { ProductViewer } from './entities/product-viewers.entity';

export * as transformer from 'object-transformer';

const remove__v_product_viewerSchema = {
  userId: 'user',
  product: 'product',
};

export const remove__v_product_viewer = function remove__v_product_viewer(
  productViewer: ProductViewer,
) {
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  return new transformer.Single(
    productViewer,
    remove__v_product_viewerSchema,
  ).parse();
};

export const remove__v_product_viewerCollection =
  function remove__v_product_viewerCollection(productViewer: ProductViewer[]) {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    return new transformer.List(
      productViewer,
      remove__v_product_viewerSchema,
    ).parse();
  };
