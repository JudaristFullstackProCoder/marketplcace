import * as transformer from 'object-transformer';
import { User, UserDocument } from './entities/user.entity';

const getUserAsItemSchema = {
  username: 'username',
  useremail: 'email',
  userrole: 'role',
  userperms: 'permissions',
};

/**
 * @do format user object properties and exclude password properties.
 */
export const formatUserDocument = function getUserAsItem(user: User) {
  return new transformer.Single(user, getUserAsItemSchema).parse();
};

const getUserUpdateSchema = {
  user_id: '_id',
};

/**
 * @do format the object properties to kip only the user id
 */
export const getUserUpdate = function getUserUpdate(user: User) {
  return new transformer.Single(user, getUserUpdateSchema).parse();
};

const getUserAsColletionSchema = {
  user_name: 'name',
  user_email: 'email',
  user_id: '_id',
};

export const getUserAsColletion = function getUserAsColletion(user: User) {
  return new transformer.Single(user, getUserAsColletionSchema).parse();
};

const getDeletedUserSchema = {
  user_id: '_id',
};

export const getDeletedUser = function getDeletedUser(user: User) {
  return new transformer.Single(user, getDeletedUserSchema).parse();
};

const userLoginSchema = {
  user_login_id: '_id',
};

export const userLoginTransformer = function userLoginTransformer(
  user: UserDocument,
) {
  return new transformer.Single(user, userLoginSchema).parse();
};
