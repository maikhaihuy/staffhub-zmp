// layers/GridLegend.tsx
// Status legend footer for the grid

import React, { memo } from "react";
import { STATUS_TOKENS, STATUS_LABEL } from "../utils/status-tokens";

interface GridLegendProps {
  statuses: string[];
}

export const GridLegend = memo(function GridLegend({ statuses }: GridLegendProps) {
  return (
    <div className="flex flex-wrap gap-x-4 gap-y-1.5 px-4 py-2.5 bg-slate-50 border-t border-slate-100">
      {statuses.map((s) => {
        const tk = STATUS_TOKENS[s];
        if (!tk) return null;
        return (
          <div key={s} className="flex items-center gap-1.5">
            <span
              className="w-2.5 h-2.5 rounded-sm border"
              style={{ background: tk.bg, borderColor: tk.border }}
            />
            <span className="text-[11px] text-slate-500">
              {STATUS_LABEL[s] ?? s}
            </span>
          </div>
        );
      })}
    </div>
  );
});
