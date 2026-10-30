import { forwardRef, type ButtonHTMLAttributes, type InputHTMLAttributes, type HTMLAttributes, type ReactNode } from 'react';
import { cn } from '@/lib/utils';

type Variante = 'primary' | 'outline' | 'ghost' | 'danger';
type Tamanho = 'sm' | 'md';

const base =
  'inline-flex items-center justify-center gap-2 rounded-xl font-medium transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2 focus-visible:ring-offset-bg disabled:pointer-events-none disabled:opacity-50 active:scale-[0.98]';

const variantes: Record<Variante, string> = {
  primary: 'bg-brand text-white shadow-soft hover:bg-brand/90',
  outline: 'border border-border bg-card text-ink hover:bg-brand-soft/40',
  ghost: 'text-ink hover:bg-brand-soft/50',
  danger: 'border border-red-200 bg-card text-red-600 hover:bg-red-50 dark:border-red-900 dark:hover:bg-red-950/40',
};

const tamanhos: Record<Tamanho, string> = {
  sm: 'h-8 px-3 text-sm',
  md: 'h-10 px-4 text-sm',
};

/** Classes de botão, para aplicar também em links (<Link>) sem aninhar <button> dentro de <a>. */
export function botaoClasses(variant: Variante = 'primary', size: Tamanho = 'md', extra?: string): string {
  return cn(base, variantes[variant], tamanhos[size], extra);
}

export const Button = forwardRef<
  HTMLButtonElement,
  ButtonHTMLAttributes<HTMLButtonElement> & { variant?: Variante; size?: Tamanho }
>(({ className, variant = 'primary', size = 'md', type = 'button', ...props }, ref) => (
  <button ref={ref} type={type} className={cn(botaoClasses(variant, size), className)} {...props} />
));
Button.displayName = 'Button';

export function Card({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn('rounded-2xl border border-border bg-card p-5 shadow-soft transition-colors duration-300', className)}
      {...props}
    />
  );
}

/** Entrada suave com atraso escalonado, para listas e grupos de cards. */
export function Reveal({ children, delay = 0, className }: { children: ReactNode; delay?: number; className?: string }) {
  return (
    <div className={cn('animate-slide-up', className)} style={{ animationDelay: `${delay}ms` }}>
      {children}
    </div>
  );
}

export function Badge({ className, ...props }: HTMLAttributes<HTMLSpanElement>) {
  return (
    <span
      className={cn('inline-flex items-center gap-1 rounded-full bg-brand-soft px-2.5 py-0.5 text-xs font-medium text-brand', className)}
      {...props}
    />
  );
}

export const Input = forwardRef<HTMLInputElement, InputHTMLAttributes<HTMLInputElement>>(({ className, ...props }, ref) => (
  <input
    ref={ref}
    className={cn(
      'h-10 w-full rounded-xl border border-border bg-card px-3 text-sm text-ink placeholder:text-muted focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/30',
      className,
    )}
    {...props}
  />
));
Input.displayName = 'Input';
