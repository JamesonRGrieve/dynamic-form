import type React from 'react';
import type { FieldChangeEvent } from './types';

type CheckFieldBaseProps = {
  id: string;
  name: string;
  helperText?: string;
  label?: string;
};

export type CheckFieldSingleProps = CheckFieldBaseProps & {
  value: boolean;
  items?: undefined;
  // Single-mode forwards the raw DOM change event so consumers can read
  // `target.checked`.
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
};

export type CheckFieldMultiProps = CheckFieldBaseProps & {
  value: string[];
  items: string[];
  onChange: (event: FieldChangeEvent<string[]>) => void;
};

export type CheckFieldProps = CheckFieldSingleProps | CheckFieldMultiProps;

function MultiCheckField({ id, name, value, onChange, items }: CheckFieldMultiProps): React.ReactElement {
  const selected: readonly string[] = value;
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
              // Multi-mode emits a FieldChangeEvent whose target.value is the
              // new string[] — the honest contract, no DOM-event cast needed.
              const synthetic: FieldChangeEvent<string[]> = {
                target: { name, value: next },
              };
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

function SingleCheckField({ id, name, value, onChange, helperText, label }: CheckFieldSingleProps): React.ReactElement {
  return (
    <label className='flex items-center space-x-2 cursor-pointer'>
      <input
        type='checkbox'
        id={id}
        name={name}
        checked={value}
        onChange={onChange}
        className='form-checkbox h-5 w-5 text-blue-600 transition duration-150 ease-in-out'
      />
      <span className='text-gray-700'>{helperText ?? label}</span>
    </label>
  );
}

export default function CheckField(props: CheckFieldProps): React.ReactElement {
  if (props.items !== undefined) {
    return <MultiCheckField {...props} />;
  }
  return <SingleCheckField {...props} />;
}
