// SPDX-License-Identifier: AGPL-3.0-or-later
import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './select';

describe('Select', () => {
  it('renders the trigger with the placeholder when closed', () => {
    render(
      <Select>
        <SelectTrigger>
          <SelectValue placeholder='Choose…' />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value='one'>One</SelectItem>
        </SelectContent>
      </Select>,
    );
    expect(screen.getByText('Choose…')).toBeInTheDocument();
  });

  it('shows the selected value via defaultValue', () => {
    render(
      <Select defaultValue='one'>
        <SelectTrigger>
          <SelectValue placeholder='-' />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value='one'>One</SelectItem>
          <SelectItem value='two'>Two</SelectItem>
        </SelectContent>
      </Select>,
    );
    expect(screen.getByText('One')).toBeInTheDocument();
  });

  it('exposes a combobox role on the trigger', () => {
    render(
      <Select>
        <SelectTrigger>
          <SelectValue placeholder='-' />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value='x'>X</SelectItem>
        </SelectContent>
      </Select>,
    );
    expect(screen.getByRole('combobox')).toBeInTheDocument();
  });
});
