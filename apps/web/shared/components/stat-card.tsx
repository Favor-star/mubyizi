import { TablerIcon } from "@tabler/icons-react";
export const StatCard = ({
  icon: Icon,
  title,
  value,
  color,
  children
}: {
  icon: TablerIcon;
  title: string;
  value: string;
  color: `var(--${string})`;
  children?: React.ReactNode;
}) => {
  return (
    <div className="bg-sidebar border rounded-lg p-3 flex items-center gap-4">
      <div
        className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg `}
        style={{ backgroundColor: `color-mix(in oklab, ${color} 10%, transparent)` }}>
        <Icon strokeWidth={1.5} size={20} style={{ color }} />
      </div>

      <div className="flex-1">
        <p className="text-xs text-muted-foreground">{title}</p>
        <p className="text-lg font-semibold" style={{ color }}>
          {value}
        </p>
      </div>
      {children}
    </div>
  );
};
