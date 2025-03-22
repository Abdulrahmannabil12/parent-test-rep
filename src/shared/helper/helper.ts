export function IsNullOrEmptyString(value: string): boolean {
  return value == null || value === '' || value.length === 0;
}

export function ArrayIsNotEmpty<T>(value: T[]): boolean {
  return value && value.length > 0;
}

export function ObjectHasValue(obj: any): boolean {
  return obj !== undefined && obj != null && Object.keys(obj).length > 0;
}

export function CloneObject<T>(obj: T): T {
  const objString = JSON.stringify(obj);
  return JSON.parse(objString);
}

export function ConvertObjectToString<T>(obj: T): string {
  if (ObjectHasValue(obj)) {
    return JSON.stringify(obj);
  }
  return '';
}
