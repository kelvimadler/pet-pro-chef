import { Check, Circle, Clock } from "lucide-react";
import { cn } from "@/lib/utils";

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

  const getStepIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <Check className="w-5 h-5 text-white" />;
      case 'current':
        return <Clock className="w-5 h-5 text-primary animate-pulse" />;
      default:
        return <Circle className="w-5 h-5 text-muted-foreground" />;
    }
  };

  const getStepColors = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-500 border-green-500';
      case 'current':
        return 'bg-primary border-primary';
      default:
        return 'bg-muted border-muted-foreground/20';
    }
  };

  const getConnectorColor = (currentIndex: number) => {
    const currentStep = steps[currentIndex];
    const nextStep = steps[currentIndex + 1];
    
    if (currentStep.status === 'completed') {
      return 'bg-green-500';
    }
    return 'bg-muted-foreground/20';
  };

  return (
    <div className="w-full">
      <div className="flex items-center justify-between relative">
        {steps.map((step, index) => (
          <div key={step.id} className="flex flex-col items-center relative z-10">
            {/* Step Circle */}
            <div
              className={cn(
                "w-12 h-12 rounded-full border-2 flex items-center justify-center transition-all duration-300",
                getStepColors(step.status),
                step.status === 'current' && "ring-4 ring-primary/20 shadow-lg"
              )}
            >
              {getStepIcon(step.status)}
            </div>
            
            {/* Step Content */}
            <div className="mt-4 text-center max-w-[120px]">
              <h3 className={cn(
                "font-medium text-sm transition-colors",
                step.status === 'current' ? "text-primary" : 
                step.status === 'completed' ? "text-green-600" : "text-muted-foreground"
              )}>
                {step.title}
              </h3>
              <p className="text-xs text-muted-foreground mt-1">
                {step.description}
              </p>
            </div>
            
            {/* Connector Line */}
            {index < steps.length - 1 && (
              <div
                className={cn(
                  "absolute top-6 left-full w-[calc(100%-3rem)] h-0.5 transition-all duration-300",
                  getConnectorColor(index)
                )}
                style={{
                  transform: 'translateX(-50%)',
                  left: '50%',
                  right: 'auto',
                  width: 'calc(100vw / 3 - 3rem)'
                }}
              />
            )}
          </div>
        ))}
      </div>
      
      {/* Progress Bar Background */}
      <div className="absolute top-6 left-6 right-6 h-0.5 bg-muted-foreground/10 -z-10" />
    </div>
  );
}