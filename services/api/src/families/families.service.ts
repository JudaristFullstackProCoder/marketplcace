import { Inject, Injectable } from '@nestjs/common';
import { CreateFamilyDto } from './dto/create-family.dto';
import { UpdateFamilyDto } from './dto/update-family.dto';
import { FamilyRepository } from './family.repository';

@Injectable()
export class FamiliesService {
  constructor(
    @Inject(FamilyRepository) private familyRepository: FamilyRepository,
  ) {}

  create(createCategoryDto: CreateFamilyDto) {
    return this.familyRepository.addFamily(createCategoryDto);
  }

  findAll() {
    return this.familyRepository.getAllFamily();
  }

  findOne(id: string) {
    return this.familyRepository.getFamilyItem(id);
  }

  find(filters: Record<string, unknown>) {
    return this.familyRepository.findFamily(filters);
  }

  update(id: string, updateCategoryDto: UpdateFamilyDto) {
    return this.familyRepository.updateFamily(id, updateCategoryDto);
  }

  remove(id: string) {
    return this.familyRepository.deleteFamily(id);
  }
}
