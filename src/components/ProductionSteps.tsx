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
        return <Check className="w-3 h-3 md:w-4 md:h-4 text-white" />;
      case 'current':
        return <Clock className="w-3 h-3 md:w-4 md:h-4 text-white animate-pulse" />;
      default:
        return <Circle className="w-3 h-3 md:w-4 md:h-4 text-muted-foreground" />;
    }
  };

  const getStepColors = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-gradient-to-r from-green-500 to-green-600 border-green-500 shadow-green-200';
      case 'current':
        return 'bg-gradient-to-r from-primary to-primary-glow border-primary shadow-primary/30';
      default:
        return 'bg-muted border-border';
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
    <div className="w-full relative px-2">
      <div className="flex items-center justify-between relative">
        {steps.map((step, index) => (
          <div key={step.id} className="flex flex-col items-center relative z-10">
            {/* Step Circle */}
            <div
              className={cn(
                "w-8 h-8 md:w-10 md:h-10 rounded-full border-2 flex items-center justify-center transition-all duration-500 shadow-lg relative z-20",
                getStepColors(step.status),
                step.status === 'current' && "ring-4 ring-primary/30 animate-pulse"
              )}
            >
              {getStepIcon(step.status)}
            </div>
            
            {/* Step Content */}
            <div className="mt-2 text-center max-w-[80px] md:max-w-[120px]">
              <h3 className={cn(
                "font-semibold text-xs md:text-sm transition-all duration-300",
                step.status === 'current' ? "text-primary scale-105" : 
                step.status === 'completed' ? "text-green-600" : "text-muted-foreground"
              )}>
                {step.title}
              </h3>
              <p className="text-xs text-muted-foreground mt-1 hidden md:block">
                {step.description}
              </p>
            </div>
          </div>
        ))}
        
        {/* Progress Bar */}
        <div className="absolute top-4 left-4 right-4 h-2 bg-muted rounded-full z-0">
          <div 
            className="h-full bg-gradient-to-r from-green-500 to-green-600 rounded-full transition-all duration-1000 ease-out"
            style={{
              width: `${(steps.filter(s => s.status === 'completed').length / (steps.length - 1)) * 100}%`
            }}
          />
        </div>
      </div>
    </div>
  );
}