import { Injectable } from '@nestjs/common';
import { EventEmitter2, OnEvent } from '@nestjs/event-emitter';
import { AdminDocument } from '../../admins/entities/admin.entity';
import {
  ADMIN_CREATED,
  ADMIN_CREATED_SESSION_REGISTERED,
  ADMIN_LOGIN,
  ADMIN_LOGOUT,
  SHOPKEEPER_PERMISSION_CHANGE,
  STORE_OPENED,
  SUPER_ADMIN_LOGIN,
  SUPER_ADMIN_LOGOUT,
  USER_CREATED,
  USER_CREATED_SESSION_REGISTERED,
  USER_LOGIN,
  USER_LOGOUT,
  USER_PERMISSION_CHANGE,
} from '../../events/app.events';
import { ShopkeeperDocument } from '../../shopkeepers/entities/shopkeeper.entity';
import { StoreDocument } from '../../stores/entities/store.entity';
import { User, UserDocument } from '../../users/entities/user.entity';

@Injectable()
export class SessionService {
  constructor(private eventEmitter: EventEmitter2) {}

  @OnEvent(USER_CREATED)
  handleUserCreatedEvent(session: Record<string, any>, data: UserDocument) {
    session['user'] = data;
    this.eventEmitter.emit(USER_CREATED_SESSION_REGISTERED);
  }

  @OnEvent(ADMIN_CREATED)
  handleAdminCreatedEvent(session: Record<string, any>, data: User) {
    session['admin'] = data;
    this.eventEmitter.emit(ADMIN_CREATED_SESSION_REGISTERED);
  }

  @OnEvent(ADMIN_LOGIN)
  handleAdminLoginEvent(session: Record<string, any>, data: AdminDocument) {
    session['admin'] = data;
  }

  @OnEvent(ADMIN_LOGOUT)
  handleAdminLogoutEvent(session: Record<string, any>) {
    session['admin'] = null;
  }

  @OnEvent(USER_LOGIN)
  handleUserLoginEvent(session: Record<string, any>, user: UserDocument) {
    session['user'] = user;
  }

  @OnEvent(USER_LOGOUT)
  handleUserLogoutEvent(session: Record<string, any>) {
    session['user'] = null;
  }

  @OnEvent(USER_PERMISSION_CHANGE)
  handleUserRoleChange(
    session: Record<string, any>,
    newPermissions: Record<string, unknown>[],
  ) {
    session['user']['permissions'] = newPermissions;
  }

  @OnEvent(SHOPKEEPER_PERMISSION_CHANGE)
  handleShopkeeperPermissionChange(
    session: Record<string, any>,
    newPermissions: Record<string, unknown>[],
  ) {
    session['shopkeeper']['permissions'] = newPermissions;
  }

  @OnEvent(STORE_OPENED)
  handleStoreOpening(
    session: Record<string, any>,
    store: StoreDocument,
    shopkeeper: ShopkeeperDocument,
  ) {
    session['store'] = store;
    session['shopkeeper'] = shopkeeper;
  }

  @OnEvent(SUPER_ADMIN_LOGIN)
  handleSuperAdminLoginEvent(session: Record<string, any>) {
    session['superadmin'] = true;
  }

  @OnEvent(SUPER_ADMIN_LOGOUT)
  handleSuperAdminLogoutEvent(session: Record<string, any>) {
    session['superadmin'] = false;
  }
}
