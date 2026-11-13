import type { ButtonHTMLAttributes, ReactNode } from 'react';
import { Link } from 'react-router-dom';
export function Button({ children, to, className = '', ...props }: { children: ReactNode; to?: string; className?: string } & ButtonHTMLAttributes<HTMLButtonElement>) { return to ? <Link className={`button ${className}`} to={to}>{children}</Link> : <button className={`button ${className}`} {...props}>{children}</button>; }
