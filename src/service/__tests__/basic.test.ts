// Базовый тест для проверки работы Jest
describe('Basic Jest Test', () => {
  it('should work correctly', () => {
    expect(1 + 1).toBe(2);
  });

  it('should handle async operations', async () => {
    const result = await Promise.resolve('test');
    expect(result).toBe('test');
  });

  it('should handle objects', () => {
    const obj = { name: 'John', age: 30 };
    expect(obj).toEqual({ name: 'John', age: 30 });
  });

  it('should handle arrays', () => {
    const arr = [1, 2, 3];
    expect(arr).toHaveLength(3);
    expect(arr).toContain(2);
  });

  it('should handle strings', () => {
    const str = 'Hello, World!';
    expect(str).toContain('Hello');
    expect(str.length).toBeGreaterThan(0);
  });
});
