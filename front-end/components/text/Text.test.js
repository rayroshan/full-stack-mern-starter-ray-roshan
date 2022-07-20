import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import Text from './Text';

it('Allows me to type my name', () => {
    render(<Text label="Name" name="Name" />)
    userEvent.type(screen.getByLabelText(/name/i), 'John');
})