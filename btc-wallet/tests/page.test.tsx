import { expect, it, vi, test } from 'vitest';
import { render, screen } from '@testing-library/react';
import HomePage from '../app/page';

vi.mock('../app/components/NavBar', () => {
    return {
        __esModule: true,
        default: () => <div data-testid="mockNavBar">Mocked NavBar</div>,
    };
});

test('HomePage renders without NavBar interactions', () => {
    render(<HomePage />);

    const navBarMock = screen.getByTestId('mockNavBar');
    expect(navBarMock).toBeDefined();
    expect(navBarMock.textContent).toBe('Mocked NavBar');
});