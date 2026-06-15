import { Page } from '@playwright/test';

export function generateRandomString(length = 8): string {
  return Math.random().toString(36).substring(2, 2 + length);
}

export function generateRandomEmail(): string {
  return `test.${generateRandomString()}@example.com`;
}

export function generateRandomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export function formatDate(date: Date): string {
  return date.toISOString().split('T')[0];
}

export function addDays(date: Date, days: number): Date {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
}

export async function retryAction<T>(
  action: () => Promise<T>,
  retries = 3,
  delayMs = 1000
): Promise<T> {
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      return await action();
    } catch (error) {
      if (attempt === retries) throw error;
      await new Promise(resolve => setTimeout(resolve, delayMs));
    }
  }
  throw new Error('retryAction exhausted all retries');
}

export async function waitForNetworkIdle(page: Page, timeout = 5000): Promise<void> {
  await page.waitForLoadState('networkidle', { timeout });
}

export function buildQueryString(params: Record<string, string | number | boolean>): string {
  return Object.entries(params)
    .map(([k, v]) => `${encodeURIComponent(k)}=${encodeURIComponent(String(v))}`)
    .join('&');
}
