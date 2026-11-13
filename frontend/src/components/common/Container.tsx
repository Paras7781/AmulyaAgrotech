import type { ReactNode } from 'react';
export function Container({ children, className = '', id }: { children: ReactNode; className?: string; id?: string }) { return <div id={id} className={`section ${className}`}>{children}</div>; }
