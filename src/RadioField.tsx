export interface RadioOption {
  value: string;
  label: string;
}

export interface RadioFieldProps {
  id: string;
  value: string;
  onChange: (value: string) => void;
  items: RadioOption[];
  name: string;
  label?: string;
  disabled?: boolean;
}

export function RadioField({ id, value, onChange, items, name, label, disabled = false }: RadioFieldProps) {
  return (
    <fieldset id={id} role='radiogroup' aria-labelledby={`${id}-legend`} className='space-y-2'>
      <legend id={`${id}-legend`} className='text-sm font-semibold text-gray-800'>
        {label ?? name}
      </legend>
      {items.map((item) => {
        const itemId = `${id}-${item.value.replace(/[\W_]+/g, '').toLowerCase()}`;
        return (
          <label key={item.value} htmlFor={itemId} className='flex items-center gap-2 text-sm text-gray-700'>
            <input
              type='radio'
              id={itemId}
              name={name}
              value={item.value}
              checked={item.value === value}
              disabled={disabled}
              onChange={(event) => onChange(event.target.value)}
              className='h-4 w-4 border-gray-300 text-blue-600 focus:ring-blue-500'
            />
            <span>{item.label}</span>
          </label>
        );
      })}
    </fieldset>
  );
}
