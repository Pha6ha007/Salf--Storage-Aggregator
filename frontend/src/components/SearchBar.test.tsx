import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import SearchBar from './SearchBar';

// Mock the Select component from Radix UI
vi.mock('@radix-ui/react-select', () => ({
  Root: ({ children }: any) => <div data-testid="select-root">{children}</div>,
  Trigger: ({ children, ...props }: any) => (
    <button data-testid="select-trigger" {...props}>
      {children}
    </button>
  ),
  Value: ({ placeholder }: any) => <span>{placeholder}</span>,
  Content: ({ children }: any) => <div>{children}</div>,
  Item: ({ children, value, ...props }: any) => (
    <div data-value={value} {...props}>
      {children}
    </div>
  ),
  ItemText: ({ children }: any) => <span>{children}</span>,
}));

describe('SearchBar', () => {
  const mockOnSearch = vi.fn();

  beforeEach(() => {
    mockOnSearch.mockClear();
  });

  it('renders all form elements', () => {
    render(<SearchBar onSearch={mockOnSearch} />);

    // Check for emirate select
    const triggers = screen.getAllByTestId('select-trigger');
    expect(triggers).toHaveLength(2); // Emirate and Box Size selects

    // Check for search button
    expect(screen.getByRole('button', { name: /search/i })).toBeInTheDocument();
  });

  it('displays correct placeholder texts', () => {
    render(<SearchBar onSearch={mockOnSearch} />);

    expect(screen.getByText('Select Emirate')).toBeInTheDocument();
    expect(screen.getByText('Box Size')).toBeInTheDocument();
  });

  it('calls onSearch when search button is clicked', async () => {
    const user = userEvent.setup();
    render(<SearchBar onSearch={mockOnSearch} />);

    const searchButton = screen.getByRole('button', { name: /search/i });
    await user.click(searchButton);

    expect(mockOnSearch).toHaveBeenCalledTimes(1);
  });

  it('displays loading state', () => {
    render(<SearchBar onSearch={mockOnSearch} isLoading={true} />);

    const searchButton = screen.getByRole('button', { name: /searching/i });
    expect(searchButton).toBeInTheDocument();
    expect(searchButton).toBeDisabled();
  });

  it('disables search button when loading', async () => {
    const user = userEvent.setup();
    render(<SearchBar onSearch={mockOnSearch} isLoading={true} />);

    const searchButton = screen.getByRole('button');
    await user.click(searchButton);

    // Should not call onSearch when loading
    expect(mockOnSearch).not.toHaveBeenCalled();
  });

  it('has proper ARIA labels for accessibility', () => {
    render(<SearchBar onSearch={mockOnSearch} />);

    const searchButton = screen.getByRole('button', { name: /search/i });
    expect(searchButton).toBeInTheDocument();
  });

  it('renders icons correctly', () => {
    const { container } = render(<SearchBar onSearch={mockOnSearch} />);

    // Check for lucide-react icons (MapPin and Package)
    const icons = container.querySelectorAll('svg');
    expect(icons.length).toBeGreaterThan(0);
  });
});
