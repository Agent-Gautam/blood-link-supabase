import { LucideIcon, Plus, Droplet } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ReactNode } from "react";

interface EmptyStateProps {
  title?: string;
  description?: string;
  icon?: LucideIcon;
  onAdd?: () => void;
  showAddButton?: boolean;
  buttonText?: string;
  buttonIcon?: LucideIcon;
  footer?: ReactNode;
}

const EmptyState = ({
  title = "No Items Yet",
  description = "Get started by adding your first item.",
  icon: Icon = Droplet,
  onAdd,
  showAddButton = true,
  buttonText = "Add First Item",
  buttonIcon: ButtonIcon = Plus,
  footer,
}: EmptyStateProps) => {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4">
      <div className="relative mb-8">
        {/* Animated icon with pulse effect */}
        <div className="absolute inset-0 bg-primary/20 rounded-full blur-xl animate-pulse" />
        <div className="relative bg-accent rounded-full p-8">
          <Icon className="h-16 w-16 text-primary" strokeWidth={1.5} />
        </div>
      </div>

      <h3 className="text-2xl font-bold text-foreground mb-2 text-center">
        {title}
      </h3>

      <p className="text-muted-foreground text-center max-w-md mb-8">
        {description}
      </p>

      {showAddButton && onAdd && (
        <Button onClick={onAdd} size="lg" className="gap-2">
          {ButtonIcon && <ButtonIcon className="h-5 w-5" />}
          {buttonText}
        </Button>
      )}

      {footer && <div className="mt-12">{footer}</div>}
    </div>
  );
};

export default EmptyState;
