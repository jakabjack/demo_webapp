import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Button from './Button';

describe('Button', () => {
  it('calls onClick callback when clicked', async () => {
    const handleClick = jest.fn();
    const user = userEvent.setup();

    render(<Button title="Click me" onClick={handleClick} />);

    const button = screen.getByRole('button', { name: 'Click me' });
    await user.click(button);

    expect(handleClick).toHaveBeenCalledTimes(1);
  });
});
