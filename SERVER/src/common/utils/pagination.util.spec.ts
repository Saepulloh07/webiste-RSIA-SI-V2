import { buildPaginationMeta, paginationSkip, parseSort } from './pagination.util';

describe('pagination.util', () => {
  it('computes skip correctly for a given page/limit', () => {
    expect(paginationSkip(1, 10)).toBe(0);
    expect(paginationSkip(2, 10)).toBe(10);
    expect(paginationSkip(3, 25)).toBe(50);
  });

  it('builds pagination meta with correct hasNext/hasPrev flags', () => {
    const meta = buildPaginationMeta(2, 10, 25);
    expect(meta.totalPages).toBe(3);
    expect(meta.hasNextPage).toBe(true);
    expect(meta.hasPrevPage).toBe(true);
  });

  it('falls back to the default order when sort is omitted', () => {
    const result = parseSort(undefined, ['name'], { createdAt: 'desc' });
    expect(result).toEqual({ createdAt: 'desc' });
  });

  it('parses a "-field" sort string into descending order', () => {
    const result = parseSort('-created_at', ['createdAt'], { createdAt: 'desc' });
    expect(result).toEqual({ createdAt: 'desc' });
  });

  it('ignores an unknown/unsortable field and falls back to default', () => {
    const result = parseSort('not_a_real_field', ['name'], { createdAt: 'desc' });
    expect(result).toEqual({ createdAt: 'desc' });
  });
});
