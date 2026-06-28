import React from 'react';

type SelectProps = React.SelectHTMLAttributes<HTMLSelectElement> & {
  value?: string;
  onValueChange?: (val: string) => void;
  className?: string;
};

export function Select({ onValueChange, ...rest }: SelectProps) {
  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onValueChange?.(e.target.value);
    if (rest.onChange) rest.onChange(e as any);
  };
  return <select {...(rest as any)} onChange={handleChange} />;
}

export const SelectTrigger = (props: React.HTMLAttributes<HTMLButtonElement>) => <button {...props} />;
export const SelectContent = (props: React.HTMLAttributes<HTMLDivElement>) => <div {...props} />;
export const SelectItem = (props: React.HTMLAttributes<HTMLDivElement>) => <div {...props} />;
export const SelectValue = (props: React.HTMLAttributes<HTMLSpanElement>) => <span {...props} />;

export default Select;
