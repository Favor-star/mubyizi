"use client";

// Expense categories — wire to real API when ready
const CATEGORIES = [
  { label: "Labor", amount: "$540k", pct: 45, color: "oklch(0.546 0.245 262.881)" },
  { label: "Material", amount: "$360k", pct: 30, color: "oklch(0.6 0.15 180)" },
  { label: "Equipment", amount: "$180k", pct: 15, color: "oklch(0.65 0.18 295)" },
  { label: "Subcontractors", amount: "$120k", pct: 10, color: "oklch(0.48 0.02 286)" },
] as const;

const CX = 90;
const CY = 90;
const R = 58;
const STROKE_W = 26;
const CIRCUMFERENCE = 2 * Math.PI * R;

function pctToLen(pct: number) {
  return (pct / 100) * CIRCUMFERENCE;
}

export function ExpenseDonut() {
  let cumulative = 0;

  return (
    <div className="bg-card border border-border p-5">
      {/* Header */}
      <div className="mb-4 flex items-start justify-between">
        <div>
          <h3 className="text-sm font-semibold">Expenses by Category</h3>
          <p className="mt-0.5 text-xs text-muted-foreground">Total: $1.2M This Month</p>
        </div>
        <button className="text-xs text-primary hover:underline underline-offset-2">
          View Report
        </button>
      </div>

      <div className="flex items-center gap-6">
        {/* Donut SVG */}
        <div className="shrink-0">
          <svg width={180} height={180} viewBox="0 0 180 180">
            {/* Track */}
            <circle
              cx={CX}
              cy={CY}
              r={R}
              fill="none"
              stroke="currentColor"
              strokeOpacity={0.07}
              strokeWidth={STROKE_W}
            />

            {/* Segments (start at 12 o'clock via rotate(-90)) */}
            {CATEGORIES.map((cat) => {
              const dashLen = pctToLen(cat.pct);
              const dashArr = `${dashLen} ${CIRCUMFERENCE}`;
              const dashOff = -(cumulative / 100) * CIRCUMFERENCE;
              cumulative += cat.pct;

              return (
                <circle
                  key={cat.label}
                  cx={CX}
                  cy={CY}
                  r={R}
                  fill="none"
                  stroke={cat.color}
                  strokeWidth={STROKE_W}
                  strokeDasharray={dashArr}
                  strokeDashoffset={dashOff}
                  transform={`rotate(-90 ${CX} ${CY})`}
                />
              );
            })}

            {/* Center label */}
            <text
              x={CX}
              y={CY - 7}
              textAnchor="middle"
              fontSize={22}
              fontWeight={600}
              fill="currentColor"
            >
              45%
            </text>
            <text
              x={CX}
              y={CY + 13}
              textAnchor="middle"
              fontSize={11}
              fill="currentColor"
              opacity={0.5}
            >
              Labor
            </text>
          </svg>
        </div>

        {/* Legend */}
        <div className="grid grid-cols-2 gap-x-6 gap-y-4">
          {CATEGORIES.map((cat) => (
            <div key={cat.label}>
              <div className="mb-0.5 flex items-center gap-1.5">
                <span
                  className="inline-block h-2 w-2 shrink-0"
                  style={{ backgroundColor: cat.color }}
                />
                <span className="text-xs text-muted-foreground">{cat.label}</span>
              </div>
              <p className="text-sm font-semibold">{cat.amount}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
