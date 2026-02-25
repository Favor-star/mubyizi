import { Hono } from "hono";
import orgRoutes from "./orgs.route.js";
import authRoutes from "./auth.route.js";
import workplaceRoutes from "./workplace.route.js";
import usersRoutes from "./users.route.js";
import attendanceRoutes from "./attendance.route.js";
import qrAttendanceRoutes from "./qr-attendance.route.js";
import selfAttendanceRoutes from "./self-attendance.route.js";
import workplaceAttendanceRoutes from "./workplace-attendance.route.js";

const routes = new Hono()
  .route("/users", usersRoutes)
  .route("/auth", authRoutes)
  .route("/orgs", orgRoutes)
  .route("/orgs/:orgId/workplaces", workplaceRoutes)
  .route("/orgs/:orgId/attendance", attendanceRoutes)
  .route("/attendance/qr", qrAttendanceRoutes)        // Must be before /attendance
  .route("/attendance", selfAttendanceRoutes)
  .route("/orgs/:orgId/workplaces/:workplaceId/attendance", workplaceAttendanceRoutes);

export default routes;
