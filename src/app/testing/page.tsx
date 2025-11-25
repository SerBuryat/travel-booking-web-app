import { LogsTest } from '@/components/LogsTest';

export default function TestingPage() {
  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold text-gray-800 mb-4">
          Тестирование системы логирования
        </h1>
        <p className="text-gray-600 mb-6">
          Используйте кнопки ниже для тестирования различных типов клиентских ошибок и их отправки в сервис логирования.
        </p>
        <LogsTest />
      </div>
    </div>
  );
}

