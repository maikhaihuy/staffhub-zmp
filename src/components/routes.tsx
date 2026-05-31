/**
 * Income module routes.
 *
 * Mount this inside your app's <AnimationRoutes> like:
 *
 *   <Route path="/income/*" element={<IncomeRoutes />} />
 *
 * or spread the individual routes directly:
 *
 *   ...incomeRoutes
 */

import React from "react";
import { Route } from "zmp-ui";
import IncomePage from "../pages/staff/income";
import { PayrollDetailPage } from "./income/PayrollDetailPage";
import { PayrollHistoryPage } from "./income/PayrollHistoryPage";
import { mockPayrollHistory } from "@/constants/income";

export const IncomeRoutes = () => (
  <>
    <Route path="/income" element={<IncomePage />} />
    <Route
      path="/income/payroll/:id"
      element={<PayrollDetailPage payrolls={mockPayrollHistory} />}
    />
    <Route
      path="/income/payroll-history"
      element={<PayrollHistoryPage payrolls={mockPayrollHistory} />}
    />
  </>
);

/**
 * Spread these into your <AnimationRoutes> if you prefer explicit routes:
 *
 * import { incomeRouteElements } from "@/pages/income/routes";
 * <AnimationRoutes>{incomeRouteElements}</AnimationRoutes>
 */
export const incomeRouteElements = (
  <>
    <Route path="/income" element={<IncomePage />} />
    <Route
      path="/income/payroll/:id"
      element={<PayrollDetailPage payrolls={mockPayrollHistory} />}
    />
    <Route
      path="/income/payroll-history"
      element={<PayrollHistoryPage payrolls={mockPayrollHistory} />}
    />
  </>
);
