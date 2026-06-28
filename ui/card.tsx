import React from 'react';

type DivProps = React.HTMLAttributes<HTMLDivElement> & { className?: string };

export const Card = (props: DivProps) => <div {...props} />;
export const CardHeader = (props: DivProps) => <header {...props} />;
export const CardContent = (props: DivProps) => <div {...props} />;
export const CardTitle = (props: DivProps) => <h3 {...props} />;

export default Card;
