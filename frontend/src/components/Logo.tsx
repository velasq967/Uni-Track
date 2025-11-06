import { GraduationCap } from "lucide-react";

export const Logo = ({ size = "md" }: { size?: "sm" | "md" | "lg" }) => {
  const sizes = {
    sm: "h-8 w-8",
    md: "h-12 w-12",
    lg: "h-20 w-20",
  };

  const iconSizes = {
    sm: 20,
    md: 32,
    lg: 48,
  };

  return (
    <div className={`${sizes[size]} rounded-2xl bg-primary flex items-center justify-center shadow-lg`}>
      <GraduationCap className="text-primary-foreground" size={iconSizes[size]} />
    </div>
  );
};
