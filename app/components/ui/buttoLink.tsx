import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "~/lib/utils"
import { Link } from "react-router"

const buttonLinkVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none  disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default: "bg-primary dark:bg-orange dark:hover:bg-orange_hover text-primary-foreground hover:bg-primary/90 ",
        destructive:
          "bg-destructive text-destructive-foreground hover:bg-destructive/90",
        outline:
          "border border-input bg-background hover:bg-accent hover:text-accent-foreground dark:bg-gray-800 dark:text-white dark:hover:bg-orange dark:hover:border-orange",
        secondary:
          "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-md px-3",
        lg: "h-11 rounded-md px-8",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface ButtonLinkProps {
  className?:string;
  variant?:'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link';
  size?:'default' | 'sm' | 'lg' | 'icon';
  to:string;
  children: any;
}

const LinkButton = React.forwardRef<HTMLAnchorElement, ButtonLinkProps>(
  ({ className, variant, size, children ,to}) => {
    return (
      <Link
        className={cn(buttonLinkVariants({ variant, size, className }))}
        to={to}
        
      >
        {children}
      </Link>
    )
  }
)

export { LinkButton, buttonLinkVariants }
