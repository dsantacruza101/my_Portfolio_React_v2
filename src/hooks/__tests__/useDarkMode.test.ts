import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { renderHook, act, waitFor } from '@testing-library/react';
import { useDarkMode } from '../useDarkMode';

beforeEach(() => {
  localStorage.clear();
  document.documentElement.classList.remove('dark');
});

afterEach(() => {
  localStorage.clear();
  document.documentElement.classList.remove('dark');
});

describe('useDarkMode', () => {
  it('returns true when localStorage theme is "dark"', () => {
    localStorage.setItem('theme', 'dark');

    const { result } = renderHook(() => useDarkMode());

    expect(result.current).toBe(true);
  });

  it('returns false when localStorage theme is "light"', () => {
    localStorage.setItem('theme', 'light');

    const { result } = renderHook(() => useDarkMode());

    expect(result.current).toBe(false);
  });

  it('returns false when localStorage has no theme and system prefers light', () => {
    window.matchMedia = (query) => ({
      matches: query !== '(prefers-color-scheme: dark)',
      media: query,
      onchange: null,
      addListener: () => {},
      removeListener: () => {},
      addEventListener: () => {},
      removeEventListener: () => {},
      dispatchEvent: () => true,
    });

    const { result } = renderHook(() => useDarkMode());

    expect(result.current).toBe(false);
  });

  it('updates to true when the "dark" class is added to <html>', async () => {
    localStorage.setItem('theme', 'light');
    const { result } = renderHook(() => useDarkMode());

    expect(result.current).toBe(false);

    act(() => { document.documentElement.classList.add('dark'); });

    await waitFor(() => expect(result.current).toBe(true));
  });

  it('updates to false when the "dark" class is removed from <html>', async () => {
    localStorage.setItem('theme', 'dark');
    document.documentElement.classList.add('dark');

    const { result } = renderHook(() => useDarkMode());
    expect(result.current).toBe(true);

    act(() => { document.documentElement.classList.remove('dark'); });

    await waitFor(() => expect(result.current).toBe(false));
  });
});
