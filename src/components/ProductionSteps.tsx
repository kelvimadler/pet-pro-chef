import { Check, Circle, Clock } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Stepper,
  StepperIndicator,
  StepperItem,
  StepperSeparator,
  StepperTitle,
  StepperTrigger,
} from "@/components/ui/stepper";

interface Step {
  id: string;
  title: string;
  description: string;
  status: 'completed' | 'current' | 'pending';
}

interface ProductionStepsProps {
  production: any;
}

export function ProductionSteps({ production }: ProductionStepsProps) {
  const getSteps = (): Step[] => {
    const steps: Step[] = [
      {
        id: 'thawing',
        title: 'Descongelamento',
        description: 'Preparação inicial do produto',
        status: 'pending'
      },
      {
        id: 'production',
        title: 'Produção e Pesagens',
        description: 'Processamento e controle de qualidade',
        status: 'pending'
      },
      {
        id: 'analysis',
        title: 'Análise e Finalização',
        description: 'Análise final e empacotamento',
        status: 'pending'
      }
    ];

    // Determine current step based on production data
    if (production.status === 'finished') {
      steps.forEach(step => step.status = 'completed');
    } else if (production.status === 'in_progress') {
      if (production.dehydrator_exit_time) {
        steps[0].status = 'completed';
        steps[1].status = 'completed';
        steps[2].status = 'current';
      } else if (production.dehydrator_entry_time) {
        steps[0].status = 'completed';
        steps[1].status = 'current';
      } else if (production.thaw_time) {
        steps[0].status = 'current';
      } else {
        steps[0].status = 'current';
      }
    } else if (production.status === 'open') {
      if (production.thaw_time) {
        steps[0].status = 'completed';
        steps[1].status = 'current';
      } else {
        steps[0].status = 'current';
      }
    }

    return steps;
  };

  const steps = getSteps();
  
  // Calculate current step number for stepper
  const getCurrentStepNumber = () => {
    const currentStepIndex = steps.findIndex(step => step.status === 'current');
    if (currentStepIndex !== -1) return currentStepIndex + 1;
    
    const completedSteps = steps.filter(step => step.status === 'completed').length;
    return completedSteps === steps.length ? steps.length : Math.max(1, completedSteps + 1);
  };

  return (
    <div className="w-full py-2">
      <Stepper defaultValue={getCurrentStepNumber()}>
        {steps.map((step, index) => {
          const stepNumber = index + 1;
          const isCompleted = step.status === 'completed';
          const isCurrent = step.status === 'current';
          
          return (
            <StepperItem
              key={step.id}
              step={stepNumber}
              className="max-md:items-start [&:not(:last-child)]:flex-1"
            >
              <StepperTrigger className="max-md:flex-col">
                <StepperIndicator step={stepNumber} />
                <div className="text-center md:text-left max-w-[80px] md:max-w-[120px]">
                  <StepperTitle 
                    className={cn(
                      "text-xs md:text-sm transition-all duration-300",
                      isCurrent ? "text-primary font-semibold" : 
                      isCompleted ? "text-green-600 font-medium" : "text-muted-foreground"
                    )}
                  >
                    {step.title}
                  </StepperTitle>
                  <p className="text-xs text-muted-foreground mt-1 hidden md:block">
                    {step.description}
                  </p>
                </div>
              </StepperTrigger>
              {stepNumber < steps.length && (
                <StepperSeparator 
                  className={cn(
                    "max-md:mt-3.5 md:mx-4 transition-all duration-500",
                    isCompleted ? "bg-gradient-to-r from-green-500 to-green-600" : "bg-muted"
                  )}
                />
              )}
            </StepperItem>
          );
        })}
      </Stepper>
    </div>
  );
}