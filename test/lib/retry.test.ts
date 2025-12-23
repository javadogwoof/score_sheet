import { describe, it, expect, vi, beforeEach } from 'vitest';
import { retryWithBackoff } from '@/lib/retry';
import {
  NonRetryableError,
  NotFoundError,
  RetryableError,
} from '@/lib/errors';

describe('retryWithBackoff', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('初回で成功した場合、即座に結果を返す', async () => {
    const mockFn = vi.fn().mockResolvedValue('success');

    const result = await retryWithBackoff(mockFn);

    expect(result).toBe('success');
    expect(mockFn).toHaveBeenCalledTimes(1);
  });

  it('2回目で成功した場合、リトライして結果を返す', async () => {
    const mockFn = vi
      .fn()
      .mockRejectedValueOnce(new RetryableError('一時的なエラー'))
      .mockResolvedValueOnce('success');

    const result = await retryWithBackoff(mockFn);

    expect(result).toBe('success');
    expect(mockFn).toHaveBeenCalledTimes(2);
  });

  it('maxRetries回試行しても失敗した場合、エラーをthrowする', async () => {
    const error = new RetryableError('永続的なエラー');
    const mockFn = vi.fn().mockRejectedValue(error);

    await expect(retryWithBackoff(mockFn, 3, 10)).rejects.toThrow(
      '永続的なエラー',
    );
    expect(mockFn).toHaveBeenCalledTimes(4); // 初回 + 3回リトライ
  });

  it('NonRetryableErrorの場合、リトライせずに即座に失敗する', async () => {
    const error = new NonRetryableError('リトライ不要なエラー');
    const mockFn = vi.fn().mockRejectedValue(error);

    await expect(retryWithBackoff(mockFn)).rejects.toThrow(
      'リトライ不要なエラー',
    );
    expect(mockFn).toHaveBeenCalledTimes(1); // リトライなし
  });

  it('NotFoundError（NonRetryableErrorの継承）の場合、リトライせずに即座に失敗する', async () => {
    const error = new NotFoundError('Post', 'test-id');
    const mockFn = vi.fn().mockRejectedValue(error);

    await expect(retryWithBackoff(mockFn)).rejects.toThrow(
      'Post with id test-id does not exist',
    );
    expect(mockFn).toHaveBeenCalledTimes(1); // リトライなし
  });

  it('複数回リトライして最終的に成功する', async () => {
    const mockFn = vi
      .fn()
      .mockRejectedValueOnce(new RetryableError('エラー1'))
      .mockRejectedValueOnce(new RetryableError('エラー2'))
      .mockResolvedValueOnce('success');

    const result = await retryWithBackoff(mockFn, 3, 10);

    expect(result).toBe('success');
    expect(mockFn).toHaveBeenCalledTimes(3); // 3回目で成功
  });
});
