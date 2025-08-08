// Тест для проверки работы моков Prisma
import { prisma } from '@/lib/prisma';

describe('Prisma Mock Test', () => {
  it('should have mocked prisma client', () => {
    expect(prisma).toBeDefined();
    expect(prisma.tclients).toBeDefined();
    expect(prisma.tclients_auth).toBeDefined();
    expect(prisma.$transaction).toBeDefined();
  });

  it('should have mocked methods', () => {
    expect(typeof prisma.tclients.findUnique).toBe('function');
    expect(typeof prisma.tclients.findFirst).toBe('function');
    expect(typeof prisma.tclients.create).toBe('function');
    expect(typeof prisma.tclients.update).toBe('function');
    expect(typeof prisma.tclients_auth.create).toBe('function');
    expect(typeof prisma.tclients_auth.update).toBe('function');
  });

  it('should be able to call mocked methods', () => {
    // Эти вызовы не должны вызывать ошибки
    expect(() => prisma.tclients.findUnique({ where: { id: 1 } })).not.toThrow();
    expect(() => prisma.tclients_auth.create({ data: {} })).not.toThrow();
    expect(() => prisma.$transaction([])).not.toThrow();
  });
});
