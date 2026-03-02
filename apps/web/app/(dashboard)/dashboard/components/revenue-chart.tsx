"use client";

// Monthly revenue vs expenses data ($M) — wire to real API when ready
const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun"];
const REVENUE = [1.2, 1.4, 1.8, 2.2, 2.6, 2.4];
const EXPENSES = [0.8, 0.9, 1.1, 1.4, 1.5, 1.6];

const MAX_VAL = 3.0;

// SVG canvas constants
const L = 44; // chart left (space for y-labels)
const R = 500; // chart right
const T = 10; // chart top
const B = 182; // chart bottom
const CW = R - L; // chart width
const CH = B - T; // chart height

const GW = CW / MONTHS.length; // group width
const BW = 20; // bar width
const BG = 5; // gap between paired bars

function toY(val: number) {
  return B - (val / MAX_VAL) * CH;
}
function toH(val: number) {
  return (val / MAX_VAL) * CH;
}

const Y_TICKS = [0, 1, 2, 3];

export function RevenueChart() {
  return (
    <div className="bg-card border border-border p-5 ">
      {/* Header */}
      <div className="mb-1 flex items-start justify-between">
        <div>
          <h3 className="text-sm font-semibold">Revenue vs. Expenses</h3>
          <p className="mt-0.5 text-xs text-muted-foreground">Monthly performance breakdown</p>
        </div>
        <div className="flex items-center gap-4 text-xs text-muted-foreground">
          <span className="flex items-center gap-1.5">
            <span className="inline-block h-2 w-2" style={{ background: "oklch(0.623 0.214 259.815)" }} />
            Revenue
          </span>
          <span className="flex items-center gap-1.5">
            <span className="inline-block h-2 w-2" style={{ background: "oklch(0.552 0.016 285.938)" }} />
            Expenses
          </span>
        </div>
      </div>

      <svg
        viewBox={`0 0 ${R + 10} ${B + 22}`}
        width="100%"
        style={{ display: "block", height: 230 }}
        preserveAspectRatio="xMidYMid meet">
        {/* Horizontal gridlines + y-axis labels */}
        {Y_TICKS.map((v) => {
          const y = toY(v);
          return (
            <g key={v}>
              <line x1={L} y1={y} x2={R} y2={y} stroke="currentColor" strokeOpacity={0.07} strokeWidth={1} />
              <text x={L - 6} y={y + 4} textAnchor="end" fontSize={10} fill="currentColor" opacity={0.45}>
                ${v}M
              </text>
            </g>
          );
        })}

        {/* Bar groups */}
        {MONTHS.map((month, i) => {
          const cx = L + (i + 0.5) * GW;
          const revX = cx - BW - BG / 2;
          const expX = cx + BG / 2;

          return (
            <g key={month}>
              {/* Revenue bar */}
              <rect
                x={revX}
                y={toY(REVENUE[i])}
                width={BW}
                height={toH(REVENUE[i])}
                fill="oklch(0.623 0.214 259.815)"
              />
              {/* Expense bar */}
              <rect
                x={expX}
                y={toY(EXPENSES[i])}
                width={BW}
                height={toH(EXPENSES[i])}
                fill="oklch(0.552 0.016 285.938)"
                fillOpacity={0.7}
              />
              {/* Month label */}
              <text x={cx} y={B + 16} textAnchor="middle" fontSize={10.5} fill="currentColor" opacity={0.45}>
                {month}
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
}
