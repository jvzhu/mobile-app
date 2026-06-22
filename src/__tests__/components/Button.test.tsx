import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { Button } from '@components/ui/Button';

jest.mock('@hooks/useTheme', () => ({
  useTheme: () => ({
    theme: {
      colors: {
        primary: '#6366F1',
        secondary: '#EC4899',
        error: '#EF4444',
        white: '#FFFFFF',
        border: '#E5E7EB',
      },
    },
    isDark: false,
  }),
}));

describe('Button', () => {
  it('renders correctly with title', () => {
    const { getByText } = render(<Button title="Click Me" onPress={() => {}} />);
    expect(getByText('Click Me')).toBeTruthy();
  });

  it('calls onPress when tapped', () => {
    const onPress = jest.fn();
    const { getByText } = render(<Button title="Tap" onPress={onPress} />);
    fireEvent.press(getByText('Tap'));
    expect(onPress).toHaveBeenCalledTimes(1);
  });

  it('does not call onPress when disabled', () => {
    const onPress = jest.fn();
    const { getByText } = render(<Button title="Disabled" onPress={onPress} disabled />);
    fireEvent.press(getByText('Disabled'));
    expect(onPress).not.toHaveBeenCalled();
  });

  it('shows loading indicator when isLoading is true', () => {
    const { queryByText } = render(
      <Button title="Loading" onPress={() => {}} isLoading />
    );
    expect(queryByText('Loading')).toBeNull();
  });

  it('renders with primary variant by default', () => {
    const { getByText } = render(<Button title="Primary" onPress={() => {}} />);
    expect(getByText('Primary')).toBeTruthy();
  });

  it('renders all variants without crashing', () => {
    const variants = ['primary', 'secondary', 'outline', 'danger', 'ghost'] as const;
    variants.forEach(variant => {
      const { getByText } = render(
        <Button title={`${variant} btn`} onPress={() => {}} variant={variant} />
      );
      expect(getByText(`${variant} btn`)).toBeTruthy();
    });
  });

  it('renders with different sizes without crashing', () => {
    const sizes = ['sm', 'md', 'lg'] as const;
    sizes.forEach(size => {
      const { getByText } = render(
        <Button title={`${size} size`} onPress={() => {}} size={size} />
      );
      expect(getByText(`${size} size`)).toBeTruthy();
    });
  });
});
