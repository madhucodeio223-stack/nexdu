import React from 'react';

type InputProps = React.InputHTMLAttributes<HTMLInputElement> & { className?: string };

export function Input(props: InputProps) {
  return <input {...props} />;
}

export default Input;
