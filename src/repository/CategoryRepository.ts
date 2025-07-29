import { prisma } from '@/lib/prisma';
import { CategoryEntity } from '@/entity/CategoryEntity';

export class CategoryRepository {
  /**
   * Find all categories
   */
  static async findAll(): Promise<CategoryEntity[]> {
    return prisma.tcategories.findMany({
      select: {
        id: true,
        code: true,
        sysname: true,
        name: true,
        photo: true,
        parent_id: true,
      },
      orderBy: { id: 'asc' },
    });
  }

  /**
   * Find all categories with their parent and children relations
   */
  static async findAllWithRelations(): Promise<{
    category: CategoryEntity;
    parent: CategoryEntity | null;
    children: CategoryEntity[];
  }[]> {
    const categoriesWithRelations = await prisma.tcategories.findMany({
      select: {
        id: true,
        code: true,
        sysname: true,
        name: true,
        photo: true,
        parent_id: true,
        // Parent relation
        tcategories: {
          select: {
            id: true,
            code: true,
            sysname: true,
            name: true,
            photo: true,
            parent_id: true,
          }
        },
        // Children relations
        other_tcategories: {
          select: {
            id: true,
            code: true,
            sysname: true,
            name: true,
            photo: true,
            parent_id: true,
          },
          orderBy: { id: 'asc' },
        }
      },
      orderBy: { id: 'asc' },
    });

    return categoriesWithRelations.map(item => ({
      category: {
        id: item.id,
        code: item.code,
        sysname: item.sysname,
        name: item.name,
        photo: item.photo,
        parent_id: item.parent_id,
      },
      parent: item.tcategories ? {
        id: item.tcategories.id,
        code: item.tcategories.code,
        sysname: item.tcategories.sysname,
        name: item.tcategories.name,
        photo: item.tcategories.photo,
        parent_id: item.tcategories.parent_id,
      } : null,
      children: item.other_tcategories.map(child => ({
        id: child.id,
        code: child.code,
        sysname: child.sysname,
        name: child.name,
        photo: child.photo,
        parent_id: child.parent_id,
      }))
    }));
  }

  /**
   * Get all parent categories (categories with no parent)
   */
  static async getAllParentCategories() {
    return prisma.tcategories.findMany({
      where: { parent_id: null },
      select: {
        id: true,
        name: true,
        code: true,
        photo: true,
      },
      orderBy: { id: 'asc' },
    });
  }

  /**
   * Get category by ID
   */
  static async getCategoryById(categoryId: number) {
    return prisma.tcategories.findUnique({
      where: { id: categoryId },
      select: {
        id: true,
        name: true,
        code: true,
        photo: true,
      },
    });
  }

  /**
   * Find all categories by parent ID
   */
  static async findAllByParentId(parentId: number): Promise<CategoryEntity[]> {
    return prisma.tcategories.findMany({
      where: { parent_id: parentId },
      select: {
        id: true,
        code: true,
        sysname: true,
        name: true,
        photo: true,
        parent_id: true,
      },
      orderBy: { id: 'asc' },
    });
  }

  /**
   * Get categories by array of IDs
   */
  static async getCategoriesByIds(ids: number[]) {
    if (!ids || ids.length === 0) return [];
    return prisma.tcategories.findMany({
      where: { id: { in: ids } },
      select: {
        id: true,
        name: true,
        code: true,
        photo: true,
      },
      orderBy: { id: 'asc' },
    });
  }

  /**
   * Get parent category of a given category
   */
  static async getCategoryParent(categoryId: number) {
    const category = await prisma.tcategories.findUnique({
      where: { id: categoryId },
      select: { parent_id: true },
    });
    if (!category || category.parent_id == null) return null;
    return prisma.tcategories.findUnique({
      where: { id: category.parent_id },
      select: {
        id: true,
        name: true,
        code: true,
        photo: true,
      },
    });
  }

  /**
   * Find categories by array of codes
   */
  static async findAllByCodeIn(codes: string[]) {
    if (!codes || codes.length === 0) return [];
    return prisma.tcategories.findMany({
      where: { code: { in: codes } },
      select: {
        id: true,
        name: true,
        code: true,
        photo: true,
      },
      orderBy: { id: 'asc' },
    });
  }
} 