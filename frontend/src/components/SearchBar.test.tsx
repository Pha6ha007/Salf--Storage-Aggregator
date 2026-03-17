import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { SearchBar } from './SearchBar';

// Mock next/navigation
vi.mock('next/navigation', () => ({
  useRouter: () => ({ push: vi.fn() }),
}));

// Mock Radix UI Select
vi.mock('@radix-ui/react-select', () => ({
  Root: ({ children }: any) => <div data-testid="select-root">{children}</div>,
  Trigger: ({ children, ...props }: any) => (
    <button data-testid="select-trigger" {...props}>{children}</button>
  ),
  Value: ({ placeholder }: any) => <span>{placeholder}</span>,
  Content: ({ children }: any) => <div>{children}</div>,
  Item: ({ children, value, ...props }: any) => (
    <div data-value={value} {...props}>{children}</div>
  ),
  ItemText: ({ children }: any) => <span>{children}</span>,
}));

describe('SearchBar', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders in hero variant by default', () => {
    render(<SearchBar />);
    expect(screen.getByRole('button', { name: /search/i })).toBeInTheDocument();
  });

  it('renders in default variant', () => {
    render(<SearchBar variant="compact" />);
    expect(screen.getByRole('button', { name: /search/i })).toBeInTheDocument();
  });

  it('renders icons', () => {
    const { container } = render(<SearchBar />);
    const icons = container.querySelectorAll('svg');
    expect(icons.length).toBeGreaterThan(0);
  });
});
