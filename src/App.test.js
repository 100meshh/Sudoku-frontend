import { render, screen } from '@testing-library/react';
import App from './App';

test('renders New Game button', () => {
  render(<App />);
  const buttonElement = screen.getByText(/New Game/i);
  expect(buttonElement).toBeInTheDocument();
}); 