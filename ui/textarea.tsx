import React from 'react';

type TextareaProps = React.TextareaHTMLAttributes<HTMLTextAreaElement> & { className?: string };

export function Textarea(props: TextareaProps) {
  return <textarea {...props} />;
}

export default Textarea;
