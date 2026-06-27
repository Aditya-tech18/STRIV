import * as React from 'react'
import { cn } from '@/lib/utils'

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'outline' | 'ghost' | 'destructive' | 'secondary' | 'link'
  size?: 'sm' | 'default' | 'lg' | 'icon'
  loading?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'default', size = 'default', loading, children, disabled, ...props }, ref) => {
    return (
      <button
        ref={ref}
        disabled={disabled || loading}
        className={cn(
          'inline-flex items-center justify-center gap-2 rounded-xl font-semibold transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 select-none',
          {
            'bg-[#5B3BEB] text-white hover:bg-[#4025D4] active:scale-[0.98] shadow-sm': variant === 'default',
            'border border-border bg-background hover:bg-accent hover:text-accent-foreground': variant === 'outline',
            'hover:bg-accent hover:text-accent-foreground': variant === 'ghost',
            'bg-destructive text-white hover:bg-destructive/90': variant === 'destructive',
            'bg-secondary text-secondary-foreground hover:bg-secondary/80': variant === 'secondary',
            'underline-offset-4 hover:underline text-primary p-0 h-auto': variant === 'link',
          },
          {
            'h-8 px-3 text-xs': size === 'sm',
            'h-10 px-5 text-sm': size === 'default',
            'h-12 px-7 text-base': size === 'lg',
            'h-9 w-9 p-0': size === 'icon',
          },
          className
        )}
        {...props}
      >
        {loading ? (
          <>
            <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
            {children}
          </>
        ) : children}
      </button>
    )
  }
)
Button.displayName = 'Button'

export { Button }
