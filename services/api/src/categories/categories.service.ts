import { Inject, Injectable } from '@nestjs/common';
import { CategoryRepository } from './categories.repository';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';

@Injectable()
export class CategoriesService {
  constructor(
    @Inject(CategoryRepository) private categoryRepository: CategoryRepository,
  ) {}
  create(createCategoryDto: CreateCategoryDto) {
    return this.categoryRepository.addCategory(createCategoryDto);
  }

  findAll() {
    return this.categoryRepository.getAllCategory();
  }

  findOne(id: string) {
    return this.categoryRepository.getCategoryItem(id);
  }

  find(filters: Record<string, unknown>) {
    return this.categoryRepository.findCategory(filters);
  }

  update(id: string, updateCategoryDto: UpdateCategoryDto) {
    return this.categoryRepository.updateCategory(id, updateCategoryDto);
  }

  remove(id: string) {
    return this.categoryRepository.deleteCategory(id);
  }

  addOption(categoryId: string, optionId: string) {
    return this.categoryRepository.addOption(categoryId, optionId);
  }

  removeOption(categoryId: string, optionId: string) {
    return this.categoryRepository.addOption(categoryId, optionId);
  }
}
