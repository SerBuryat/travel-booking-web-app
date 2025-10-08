export enum RequestType {
  ACCOMMODATION = 'accommodation',
  TRANSPORT = 'transport',
  ENTERTAINMENT = 'entertainment'
}

export namespace RequestType {
  /**
   * Получает тип запроса по значению (`tbids.tcategories_id.sysname`) или выбрасывает ошибку
   * @param categorySysName - строковое значение типа запроса
   * @returns RequestType
   * @throws Error если значение не найдено
   */
  export function getByCategorySysNameOrThrow(categorySysName: string): RequestType {
    const enumValues = Object.values(RequestType) as RequestType[];
    const requestType = enumValues.find(type => type === categorySysName);
    
    if (!requestType) {
      throw new Error(
          `Invalid request type: ${categorySysName}. Valid types are: ${enumValues.join(', ')}`
      );
    }
    
    return requestType;
  }
}