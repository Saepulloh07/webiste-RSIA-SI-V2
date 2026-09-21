import * as React from "react"
import { cn } from "@/utils/cn"
import { AlertCircle, CheckCircle, Info, AlertTriangle } from "lucide-react"

interface AlertProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "destructive" | "success" | "warning" | "info";
  title?: string;
}

const icons = {
  default: Info,
  destructive: AlertCircle,
  success: CheckCircle,
  warning: AlertTriangle,
  info: Info,
}

const Alert = React.forwardRef<HTMLDivElement, AlertProps>(
  ({ className, variant = "default", title, children, ...props }, ref) => {
    const Icon = icons[variant]

    return (
      <div
        ref={ref}
        role="alert"
        className={cn(
          "relative w-full rounded-lg border p-4 [&>svg~*]:pl-7 [&>svg+div]:translate-y-[-3px] [&>svg]:absolute [&>svg]:left-4 [&>svg]:top-4 [&>svg]:text-foreground",
          {
            "bg-background text-foreground": variant === "default",
            "border-red-500/50 text-red-600 dark:border-red-500 [&>svg]:text-red-600 bg-red-50": variant === "destructive",
            "border-green-500/50 text-green-600 dark:border-green-500 [&>svg]:text-green-600 bg-green-50": variant === "success",
            "border-amber-500/50 text-amber-600 dark:border-amber-500 [&>svg]:text-amber-600 bg-amber-50": variant === "warning",
            "border-blue-500/50 text-blue-700 dark:border-blue-500 [&>svg]:text-blue-700 bg-blue-50": variant === "info",
          },
          className
        )}
        {...props}
      >
        <Icon className="h-4 w-4" />
        {title && <h5 className="mb-1 font-medium leading-none tracking-tight">{title}</h5>}
        <div className="text-sm [&_p]:leading-relaxed">
          {children}
        </div>
      </div>
    )
  }
)
Alert.displayName = "Alert"

export { Alert }

