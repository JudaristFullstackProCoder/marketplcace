import * as Transformer from 'object-transformer';
import { AdminDocument } from './entities/admin.entity';

const adminLoginSchema = {
  admin_login_id: '_id',
};

export const adminLoginTransformer = function adminLoginTransformer(
  admin: AdminDocument,
) {
  return new Transformer.Single(admin, adminLoginSchema).parse();
};
