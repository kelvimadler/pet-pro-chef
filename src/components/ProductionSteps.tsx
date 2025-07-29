import { cn } from "@/lib/utils";
import {
  Stepper,
  StepperIndicator,
  StepperItem,
  StepperSeparator,
  StepperTitle,
  StepperTrigger,
  StepperDescription,
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
  
  // Calculate current step number for stepper (1-based)
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
              completed={isCompleted}
              className="max-md:items-start [&:not(:last-child)]:flex-1"
            >
              <StepperTrigger asChild className="max-md:flex-col">
                <div className="flex items-center gap-3 max-md:flex-col">
                  <StepperIndicator />
                  <div className="text-center md:text-left max-w-[80px] md:max-w-[120px]">
                    <StepperTitle 
                      className={cn(
                        "transition-all duration-300",
                        isCurrent ? "text-primary font-semibold" : 
                        isCompleted ? "text-green-600 font-medium" : "text-muted-foreground"
                      )}
                    >
                      {step.title}
                    </StepperTitle>
                    <StepperDescription className="hidden md:block mt-1">
                      {step.description}
                    </StepperDescription>
                  </div>
                </div>
              </StepperTrigger>
              {stepNumber < steps.length && (
                <StepperSeparator className="max-md:mt-3.5 md:mx-4" />
              )}
            </StepperItem>
          );
        })}
      </Stepper>
    </div>
  );
}