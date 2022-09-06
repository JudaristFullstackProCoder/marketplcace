import { Inject, Injectable } from '@nestjs/common';
import { CreateOptionDto } from './dto/create-option.dto';
import { UpdateOptionDto } from './dto/update-option.dto';
import { OptionRepository } from './option.repository';

@Injectable()
export class OptionsService {
  constructor(@Inject(OptionRepository) private repository: OptionRepository) {}
  create(createOptionDto: CreateOptionDto) {
    return this.repository.addOption(createOptionDto);
  }

  findAll() {
    return this.repository.getAllOptions();
  }

  findOne(id: string) {
    return this.repository.getOptionItem(id);
  }

  find(filters: Record<string, any>) {
    return this.repository.getOneOptionItem(filters);
  }

  update(id: string, updateOptionDto: UpdateOptionDto) {
    return this.repository.updateOption(id, updateOptionDto);
  }

  remove(id: string) {
    return this.repository.deleteOption(id);
  }
}
