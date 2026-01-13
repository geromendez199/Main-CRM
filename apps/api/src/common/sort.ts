export function parseSort(sort: string | undefined, allowed: string[], fallback: string) {
  if (!sort) {
    return { [fallback]: 'desc' } as Record<string, 'asc' | 'desc'>;
  }
  const [field, direction] = sort.split(':');
  if (!allowed.includes(field)) {
    return { [fallback]: 'desc' } as Record<string, 'asc' | 'desc'>;
  }
  const order = direction === 'asc' ? 'asc' : 'desc';
  return { [field]: order } as Record<string, 'asc' | 'desc'>;
}
