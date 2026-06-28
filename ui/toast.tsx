import React from 'react';

export type ToastActionElement = React.ReactNode;
export type ToastProps = {
  title?: string;
  description?: string;
  className?: string;
};

export function Toast(props: ToastProps & { children?: React.ReactNode }) {
  const { className, ...rest } = props;
  return <div className={className}>{rest.title}{props.children}</div>;
}

export default Toast;
