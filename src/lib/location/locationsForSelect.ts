'use server';

import {prisma} from '@/lib/db/prisma';

export interface LocationEntity {
  id: number;
  name: string;
  sysname: string;
  parent_id: number | null;
  tier: number;
  created_at?: Date | null;
  parent: ParentLocationEntity | null;
  children: LocationEntity[];
}

/**
 * Тип для родительской локации (без children, чтобы избежать циклов)
 */
export type ParentLocationEntity = Omit<LocationEntity, 'children'>;

/**
 * Возвращает иерархию локаций с полями children[] и parent (полный объект)
 */
export async function locationsForSelect(): Promise<LocationEntity[]> {
  const locations = await prisma.tarea.findMany({
    orderBy: [{name: 'asc'}],
    select: {
      id: true,
      name: true,
      sysname: true,
      parent_id: true,
      tier: true,
      created_at: true,
    }
  });

  // Создаем Map для быстрого доступа к локациям по id
  const idToNode = new Map<number, LocationEntity>();
  for (const row of locations) {
    idToNode.set(row.id, {
      ...row,
      parent: null,
      children: [],
    });
  }

  // Заполняем parent и children
  for (const node of idToNode.values()) {
    if (node.parent_id) {
      const parent = idToNode.get(node.parent_id);
      if (parent) {
        node.parent = parent;
        parent.children.push(node);
      }
    }
  }

  // Корневые локации (без parent_id)
  const roots: LocationEntity[] = [];
  for (const node of idToNode.values()) {
    if (!node.parent_id) {
      roots.push(node);
    }
  }

  return roots;
}


