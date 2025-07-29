import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { Check } from "lucide-react"
import { cn } from "@/lib/utils"

const stepperVariants = cva(
  "flex w-full items-center",
  {
    variants: {
      orientation: {
        horizontal: "flex-row",
        vertical: "flex-col",
      },
    },
    defaultVariants: {
      orientation: "horizontal",
    },
  }
)

interface StepperContextType {
  currentStep: number
  orientation: "horizontal" | "vertical"
}

const StepperContext = React.createContext<StepperContextType | null>(null)

const useStepper = () => {
  const context = React.useContext(StepperContext)
  if (!context) {
    throw new Error("useStepper must be used within a Stepper")
  }
  return context
}

interface StepperProps extends React.HTMLAttributes<HTMLDivElement>, VariantProps<typeof stepperVariants> {
  defaultValue?: number
  orientation?: "horizontal" | "vertical"
}

const Stepper = React.forwardRef<HTMLDivElement, StepperProps>(
  ({ className, orientation = "horizontal", defaultValue = 1, ...props }, ref) => {
    return (
      <StepperContext.Provider value={{ currentStep: defaultValue, orientation }}>
        <div
          ref={ref}
          className={cn(stepperVariants({ orientation }), className)}
          {...props}
        />
      </StepperContext.Provider>
    )
  }
)
Stepper.displayName = "Stepper"

interface StepperItemProps extends React.HTMLAttributes<HTMLDivElement> {
  step: number
}

const StepperItem = React.forwardRef<HTMLDivElement, StepperItemProps>(
  ({ className, step, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn("flex items-center", className)}
        {...props}
      />
    )
  }
)
StepperItem.displayName = "StepperItem"

const StepperTrigger = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn("flex items-center gap-2", className)}
        {...props}
      />
    )
  }
)
StepperTrigger.displayName = "StepperTrigger"

interface StepperIndicatorProps extends React.HTMLAttributes<HTMLDivElement> {
  step?: number
}

const StepperIndicator = React.forwardRef<HTMLDivElement, StepperIndicatorProps>(
  ({ className, step, ...props }, ref) => {
    const { currentStep } = useStepper()
    const stepNumber = step || 0
    
    const isCompleted = stepNumber < currentStep
    const isCurrent = stepNumber === currentStep
    
    return (
      <div
        ref={ref}
        className={cn(
          "flex h-8 w-8 md:h-10 md:w-10 items-center justify-center rounded-full border-2 transition-all duration-500",
          isCompleted && "border-green-500 bg-gradient-to-r from-green-500 to-green-600 text-white shadow-green-200",
          isCurrent && "border-primary bg-gradient-to-r from-primary to-primary-glow text-white shadow-primary/30 ring-4 ring-primary/30 animate-pulse",
          !isCompleted && !isCurrent && "border-border bg-muted text-muted-foreground",
          className
        )}
        {...props}
      >
        {isCompleted ? (
          <Check className="h-4 w-4 text-white" />
        ) : (
          <span className="text-xs font-medium">{stepNumber}</span>
        )}
      </div>
    )
  }
)
StepperIndicator.displayName = "StepperIndicator"

const StepperSeparator = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          "h-0.5 bg-muted flex-1 rounded-full transition-all duration-500",
          className
        )}
        {...props}
      />
    )
  }
)
StepperSeparator.displayName = "StepperSeparator"

const StepperTitle = React.forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLParagraphElement>>(
  ({ className, ...props }, ref) => {
    return (
      <p
        ref={ref}
        className={cn("text-sm font-medium", className)}
        {...props}
      />
    )
  }
)
StepperTitle.displayName = "StepperTitle"

export {
  Stepper,
  StepperItem,
  StepperTrigger,
  StepperIndicator,
  StepperSeparator,
  StepperTitle,
}