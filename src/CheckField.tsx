import type React from 'react';

type CheckFieldBaseProps = {
  id: string;
  name: string;
  helperText?: string;
  label?: string;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
};

export type CheckFieldSingleProps = CheckFieldBaseProps & {
  value: boolean;
  items?: undefined;
};

export type CheckFieldMultiProps = CheckFieldBaseProps & {
  value: string[];
  items: string[];
};

export type CheckFieldProps = CheckFieldSingleProps | CheckFieldMultiProps;

export default function CheckField(props: CheckFieldProps): React.ReactElement {
  const { id, name, value, onChange, helperText, label, items } = props;

  if (Array.isArray(items) && items.length > 0) {
    const selected: readonly string[] = Array.isArray(value) ? value : [];
    return (
      <div className='space-y-2'>
        {items.map((item) => (
          <label key={item} className='flex items-center space-x-2 cursor-pointer'>
            <input
              type='checkbox'
              id={`${id}_${item.replace(/[\W_]+/g, '')}`}
              checked={selected.includes(item)}
              onChange={(event) => {
                const next = [...selected];
                if (event.target.checked) {
                  next.push(item);
                } else {
                  const index = next.indexOf(item);
                  if (index > -1) {
                    next.splice(index, 1);
                  }
                }
                // Multi-mode synthesises a ChangeEvent whose target.value is a
                // string[]. The HTMLInputElement typing can't express that, so
                // this one boundary cast is intentional.
                const synthetic = {
                  target: { name, value: next },
                  // eslint-disable-next-line no-restricted-syntax -- intentional cross-boundary cast
                } as unknown as React.ChangeEvent<HTMLInputElement>;
                onChange(synthetic);
              }}
              className='form-checkbox h-5 w-5 text-blue-600 transition duration-150 ease-in-out'
            />
            <span className='text-gray-700'>{item}</span>
          </label>
        ))}
      </div>
    );
  }
  const checked = typeof value === 'boolean' ? value : false;
  return (
    <label className='flex items-center space-x-2 cursor-pointer'>
      <input
        type='checkbox'
        id={id}
        name={name}
        checked={checked}
        onChange={onChange}
        className='form-checkbox h-5 w-5 text-blue-600 transition duration-150 ease-in-out'
      />
      <span className='text-gray-700'>{helperText ?? label}</span>
    </label>
  );
}
