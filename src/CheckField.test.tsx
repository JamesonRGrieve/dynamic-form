import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import CheckField from './CheckField';

describe('CheckField', () => {
  describe('single mode', () => {
    it('renders an unchecked checkbox by default', () => {
      render(<CheckField id='c' name='c' label='Agree' value={false} onChange={() => undefined} />);
      expect(screen.getByRole('checkbox')).not.toBeChecked();
    });

    it('renders a checked checkbox when value is true', () => {
      render(<CheckField id='c' name='c' label='Agree' value={true} onChange={() => undefined} />);
      expect(screen.getByRole('checkbox')).toBeChecked();
    });

    it('emits onChange when clicked', async () => {
      const onChange = vi.fn();
      const user = userEvent.setup();
      render(<CheckField id='c' name='c' label='Agree' value={false} onChange={onChange} />);
      await user.click(screen.getByRole('checkbox'));
      expect(onChange).toHaveBeenCalled();
    });

    it('prefers helperText over label inside the span', () => {
      render(<CheckField id='c' name='c' label='Label' helperText='Helper' value={false} onChange={() => undefined} />);
      expect(screen.getByText('Helper')).toBeInTheDocument();
    });
  });

  describe('multi mode', () => {
    it('renders one checkbox per item', () => {
      render(
        <CheckField
          id='c'
          name='c'
          items={['Apples', 'Bananas', 'Cherries']}
          value={['Apples']}
          onChange={() => undefined}
        />,
      );
      expect(screen.getAllByRole('checkbox')).toHaveLength(3);
    });

    it('marks members of `value` as checked', () => {
      render(<CheckField id='c' name='c' items={['Apples', 'Bananas']} value={['Bananas']} onChange={() => undefined} />);
      const boxes = screen.getAllByRole('checkbox') as HTMLInputElement[];
      expect(boxes[0]!.checked).toBe(false);
      expect(boxes[1]!.checked).toBe(true);
    });

    it('calls onChange with the updated array on toggle', async () => {
      const onChange = vi.fn();
      const user = userEvent.setup();
      render(<CheckField id='c' name='c' items={['Apples', 'Bananas']} value={[]} onChange={onChange} />);
      await user.click(screen.getAllByRole('checkbox')[0]!);
      expect(onChange).toHaveBeenCalled();
    });
  });
});
