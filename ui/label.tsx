import React from 'react';

type LabelProps = React.LabelHTMLAttributes<HTMLLabelElement> & { className?: string };

export function Label(props: LabelProps) {
  return <label {...props} />;
}

export default Label;
