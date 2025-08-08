import {CategoryEntity} from '@/entity/CategoryEntity';
import {CategoryType} from '@/model/CategoryType';
import {CategoryRepository} from '@/repository/CategoryRepository';
import { getGeneralCategoryCodes } from '@/utils/generalCategories';

export class CategoryService {
  private categoryRepository: CategoryRepository;

  constructor() {
    this.categoryRepository = new CategoryRepository();
  }

  /**
   * Maps CategoryEntity to CategoryType
   */
  static mapToCategoryType(entity: CategoryEntity, children: CategoryEntity[] = [], parent: CategoryEntity | null = null): CategoryType {
    return {
      id: entity.id,
      code: entity.code,
      sysname: entity.sysname,
      name: entity.name,
      photo: entity.photo,
      parent_id: entity.parent_id,
      children,
      parent,
      isParent: entity.parent_id === null
    };
  }

  /**
   * Maps CategoryType back to CategoryEntity
   */
  static mapToCategoryEntity(type: CategoryType): CategoryEntity {
    return {
      id: type.id,
      code: type.code,
      sysname: type.sysname,
      name: type.name,
      photo: type.photo,
      parent_id: type.parent_id
    };
  }

  /**
   * Gets general categories (accommodation, food, transport, tours)
   */
  async getGeneralCategories(): Promise<CategoryEntity[]> {
    return this.categoryRepository.findAllByCodeIn(getGeneralCategoryCodes());
  }

  /**
   * Get all parent categories (categories with no parent)
   */
  async getAllParentCategories(): Promise<CategoryEntity[]> {
    return this.categoryRepository.findAllByParentId(null);
  }

  /**
   * Get category by ID as CategoryType with hierarchical structure
   */
  async getById(categoryId: number): Promise<CategoryType | null> {
    const categoryWithRelations = await this.categoryRepository.findById(categoryId);
    
    if (!categoryWithRelations) {
      return null;
    }

    return CategoryService.mapToCategoryType(
      categoryWithRelations.category, 
      categoryWithRelations.children, 
      categoryWithRelations.parent
    );
  }
}