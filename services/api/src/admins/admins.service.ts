import { Inject, Injectable } from '@nestjs/common';
import { AdminRepository } from './admin.repository';
import { CreateAdminDto } from './dto/create-admin.dto';
import { UpdateAdminDto } from './dto/update-admin.dto';

@Injectable()
export class AdminsService {
  constructor(@Inject(AdminRepository) private repository: AdminRepository) {}
  create(user: CreateAdminDto) {
    return this.repository.addAdmin(user);
  }

  findAll() {
    return this.repository.getAllAdmins();
  }

  findOne(id: string) {
    return this.repository.getAdminItem(id);
  }

  update(id: string, updateUserDto: UpdateAdminDto) {
    return this.repository.updateAdmin(id, updateUserDto);
  }

  remove(id: string) {
    return this.repository.deleteAdmin(id);
  }

  getOneUserItem(filters: Record<string, unknown>) {
    return this.repository.getAdminItemByFilters(filters);
  }
}
