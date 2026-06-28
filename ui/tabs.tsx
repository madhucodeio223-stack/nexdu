import React from 'react';

type DivProps = React.HTMLAttributes<HTMLDivElement> & { className?: string };

export const Tabs = ({ children }: { children?: React.ReactNode }) => <div>{children}</div>;
export const TabsList = (props: DivProps) => <div {...props} />;
export const TabsTrigger = (props: React.ButtonHTMLAttributes<HTMLButtonElement>) => <button {...props} />;
export const TabsContent = (props: DivProps) => <div {...props} />;

export default Tabs;
