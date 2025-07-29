import { Card, CardContent } from "@/components/ui/card";
import { LucideIcon } from "lucide-react";

interface MetricCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  variant?: "default" | "success" | "warning" | "danger";
  subtitle?: string;
  trend?: {
    value: number;
    isPositive: boolean;
  };
}

export function MetricCard({ 
  title, 
  value, 
  icon: Icon, 
  variant = "default",
  subtitle,
  trend 
}: MetricCardProps) {
  const getVariantStyles = () => {
    switch (variant) {
      case "success":
        return "bg-gradient-success text-white shadow-elegant";
      case "warning":
        return "bg-gradient-warning text-white shadow-elegant";
      case "danger":
        return "bg-gradient-danger text-white shadow-elegant";
      default:
        return "bg-card hover:bg-accent/30 border border-border/50 shadow-card-hover";
    }
  };

  const getIconBg = () => {
    switch (variant) {
      case "success":
      case "warning":
      case "danger":
        return "bg-white/20";
      default:
        return "bg-gradient-primary";
    }
  };

  const getIconColor = () => {
    switch (variant) {
      case "success":
      case "warning":
      case "danger":
        return "text-white";
      default:
        return "text-primary-foreground";
    }
  };

  return (
    <Card className={`transition-all duration-300 hover:scale-105 ${getVariantStyles()}`}>
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <p className={`text-sm font-medium ${
              variant === "default" ? "text-muted-foreground" : "text-white/80"
            }`}>
              {title}
            </p>
            <div className="space-y-1">
              <p className={`text-2xl font-bold ${
                variant === "default" ? "text-foreground" : "text-white"
              }`}>
                {value}
              </p>
              {subtitle && (
                <p className={`text-xs ${
                  variant === "default" ? "text-muted-foreground" : "text-white/70"
                }`}>
                  {subtitle}
                </p>
              )}
              {trend && (
                <div className={`flex items-center gap-1 text-xs ${
                  variant === "default" 
                    ? trend.isPositive ? "text-green-600" : "text-red-600"
                    : "text-white/80"
                }`}>
                  <span>{trend.isPositive ? "↗" : "↘"}</span>
                  <span>{Math.abs(trend.value)}%</span>
                </div>
              )}
            </div>
          </div>
          <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${getIconBg()}`}>
            <Icon className={`w-6 h-6 ${getIconColor()}`} />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}