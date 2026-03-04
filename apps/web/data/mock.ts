import { IconBuildingCommunity, IconBuildingFactory2, IconBuildingSkyscraper } from "@tabler/icons-react";

// ---------------------------------------------------------------------------
// Orgs
// ---------------------------------------------------------------------------

export type MockOrg = {
  id: string;
  name: string;
  logo: React.ElementType;
};

export const MOCK_ORGS: MockOrg[] = [
  { id: "org_acme_001", name: "Acme Corp. Holdings", logo: IconBuildingCommunity },
  { id: "org_build_002", name: "BuildRight Construction", logo: IconBuildingFactory2 },
  { id: "org_metro_003", name: "Metro Logistics Ltd", logo: IconBuildingSkyscraper }
];

// ---------------------------------------------------------------------------
// Org Stats  —  mirrors GET /api/v1/orgs/:orgId/stats
// ---------------------------------------------------------------------------

export type OrgStatsData = {
  totalMembers: number;
  totalWorkplaces: number;
  workplacesByStatus: Record<string, number>;
  totalSpent: number;
  laborCost: number;
  pendingAttendance: number;
};

export const MOCK_ORG_STATS: Record<string, OrgStatsData> = {
  org_acme_001: {
    totalMembers: 142,
    totalWorkplaces: 12,
    workplacesByStatus: { ACTIVE: 8, INACTIVE: 2, ARCHIVED: 2 },
    totalSpent: 1_200_000,
    laborCost: 850_000,
    pendingAttendance: 7
  },
  org_build_002: {
    totalMembers: 78,
    totalWorkplaces: 6,
    workplacesByStatus: { ACTIVE: 5, INACTIVE: 1 },
    totalSpent: 640_000,
    laborCost: 480_000,
    pendingAttendance: 3
  },
  org_metro_003: {
    totalMembers: 210,
    totalWorkplaces: 18,
    workplacesByStatus: { ACTIVE: 14, INACTIVE: 3, ARCHIVED: 1 },
    totalSpent: 2_100_000,
    laborCost: 1_350_000,
    pendingAttendance: 12
  }
};

// ---------------------------------------------------------------------------
// Activity Log  —  mirrors GET /api/v1/orgs/:orgId/activity-log?limit=10
// ---------------------------------------------------------------------------

export type ActivityItem = {
  type: "JOINED" | "REMOVED";
  userId: string;
  userName: string;
  role: string;
  timestamp: string;
};

export type ActivityLogData = {
  data: {
    items: ActivityItem[];
    meta: { page: number; limit: number; total: number; pages: number };
  };
};

const now = Date.now();
const hoursAgo = (h: number) => new Date(now - h * 3_600_000).toISOString();

export const MOCK_ORG_ACTIVITY: Record<string, ActivityLogData> = {
  org_acme_001: {
    data: {
      items: [
        {
          type: "JOINED",
          userId: "usr_a1b2c3d4e5f6",
          userName: "James Mutua",
          role: "MEMBER",
          timestamp: hoursAgo(0.3)
        },
        {
          type: "JOINED",
          userId: "usr_b2c3d4e5f6a1",
          userName: "Priya Sharma",
          role: "MANAGER",
          timestamp: hoursAgo(2)
        },
        {
          type: "REMOVED",
          userId: "usr_c3d4e5f6a1b2",
          userName: "David Okonkwo",
          role: "MEMBER",
          timestamp: hoursAgo(5)
        },
        {
          type: "JOINED",
          userId: "usr_d4e5f6a1b2c3",
          userName: "Sofia Gonzalez",
          role: "VIEWER",
          timestamp: hoursAgo(8)
        },
        { type: "JOINED", userId: "usr_e5f6a1b2c3d4", userName: "Liam Chen", role: "MEMBER", timestamp: hoursAgo(14) },
        {
          type: "REMOVED",
          userId: "usr_f6a1b2c3d4e5",
          userName: "Amara Diallo",
          role: "MANAGER",
          timestamp: hoursAgo(22)
        },
        {
          type: "JOINED",
          userId: "usr_a1b2c3d4e5f7",
          userName: "Noah Williams",
          role: "MEMBER",
          timestamp: hoursAgo(30)
        },
        { type: "JOINED", userId: "usr_a1b2c3d4e5f8", userName: "Yuki Tanaka", role: "ADMIN", timestamp: hoursAgo(48) }
      ],
      meta: { page: 1, limit: 10, total: 8, pages: 1 }
    }
  },
  org_build_002: {
    data: {
      items: [
        {
          type: "JOINED",
          userId: "usr_g1h2i3j4k5l6",
          userName: "Carlos Mendez",
          role: "MANAGER",
          timestamp: hoursAgo(1)
        },
        { type: "JOINED", userId: "usr_h2i3j4k5l6g1", userName: "Fatima Nour", role: "MEMBER", timestamp: hoursAgo(4) },
        { type: "REMOVED", userId: "usr_i3j4k5l6g1h2", userName: "Evan Park", role: "VIEWER", timestamp: hoursAgo(9) },
        { type: "JOINED", userId: "usr_j4k5l6g1h2i3", userName: "Grace Osei", role: "MEMBER", timestamp: hoursAgo(16) },
        { type: "JOINED", userId: "usr_k5l6g1h2i3j4", userName: "Omar Farouq", role: "ADMIN", timestamp: hoursAgo(24) },
        {
          type: "REMOVED",
          userId: "usr_l6g1h2i3j4k5",
          userName: "Chloe Dupont",
          role: "MEMBER",
          timestamp: hoursAgo(36)
        }
      ],
      meta: { page: 1, limit: 10, total: 6, pages: 1 }
    }
  },
  org_metro_003: {
    data: {
      items: [
        {
          type: "JOINED",
          userId: "usr_m1n2o3p4q5r6",
          userName: "Aisha Kamara",
          role: "OWNER",
          timestamp: hoursAgo(0.5)
        },
        { type: "JOINED", userId: "usr_n2o3p4q5r6m1", userName: "Raj Patel", role: "MANAGER", timestamp: hoursAgo(3) },
        {
          type: "REMOVED",
          userId: "usr_o3p4q5r6m1n2",
          userName: "Lucas Silva",
          role: "MEMBER",
          timestamp: hoursAgo(7)
        },
        { type: "JOINED", userId: "usr_p4q5r6m1n2o3", userName: "Mei Lin", role: "MEMBER", timestamp: hoursAgo(12) },
        { type: "JOINED", userId: "usr_q5r6m1n2o3p4", userName: "Samuel Ojo", role: "VIEWER", timestamp: hoursAgo(18) },
        {
          type: "REMOVED",
          userId: "usr_r6m1n2o3p4q5",
          userName: "Elena Popov",
          role: "MANAGER",
          timestamp: hoursAgo(26)
        },
        { type: "JOINED", userId: "usr_m1n2o3p4q5r7", userName: "Hassan Ali", role: "MEMBER", timestamp: hoursAgo(40) }
      ],
      meta: { page: 1, limit: 10, total: 7, pages: 1 }
    }
  }
};

// ---------------------------------------------------------------------------
// Pending Attendance  —  mirrors GET /api/v1/orgs/:orgId/attendance?approvalStatus=PENDING&limit=5
// ---------------------------------------------------------------------------

export type PendingAttendanceItem = {
  id: string;
  userId: string;
  workplaceId: string;
  date: string;
  approvalStatus: "PENDING";
  hoursWorked: number | null;
  notes: string | null;
};

export type PendingAttendanceData = {
  data: {
    items: PendingAttendanceItem[];
    meta: { page: number; limit: number; total: number; pages: number };
  };
};

const today = new Date().toISOString().split("T")[0]!;
const yesterday = new Date(now - 86_400_000).toISOString().split("T")[0]!;

export const MOCK_PENDING_ATTENDANCE: Record<string, PendingAttendanceData> = {
  org_acme_001: {
    data: {
      items: [
        {
          id: "att_a1b2c3d4",
          userId: "usr_a1b2c3d4e5f6",
          workplaceId: "wp_x1y2z3w4",
          date: today,
          approvalStatus: "PENDING",
          hoursWorked: 8,
          notes: null
        },
        {
          id: "att_b2c3d4e5",
          userId: "usr_b2c3d4e5f6a1",
          workplaceId: "wp_x1y2z3w4",
          date: today,
          approvalStatus: "PENDING",
          hoursWorked: 7.5,
          notes: "Left early"
        },
        {
          id: "att_c3d4e5f6",
          userId: "usr_d4e5f6a1b2c3",
          workplaceId: "wp_y2z3w4x1",
          date: yesterday,
          approvalStatus: "PENDING",
          hoursWorked: null,
          notes: "Clock-out missing"
        },
        {
          id: "att_d4e5f6a1",
          userId: "usr_e5f6a1b2c3d4",
          workplaceId: "wp_z3w4x1y2",
          date: yesterday,
          approvalStatus: "PENDING",
          hoursWorked: 9,
          notes: "Overtime"
        }
      ],
      meta: { page: 1, limit: 5, total: 7, pages: 2 }
    }
  },
  org_build_002: {
    data: {
      items: [
        {
          id: "att_e5f6a1b2",
          userId: "usr_g1h2i3j4k5l6",
          workplaceId: "wp_a1b2c3d4",
          date: today,
          approvalStatus: "PENDING",
          hoursWorked: 8,
          notes: null
        },
        {
          id: "att_f6a1b2c3",
          userId: "usr_h2i3j4k5l6g1",
          workplaceId: "wp_b2c3d4a1",
          date: yesterday,
          approvalStatus: "PENDING",
          hoursWorked: 6,
          notes: "Partial day"
        },
        {
          id: "att_g1h2i3j4",
          userId: "usr_j4k5l6g1h2i3",
          workplaceId: "wp_a1b2c3d4",
          date: yesterday,
          approvalStatus: "PENDING",
          hoursWorked: null,
          notes: null
        }
      ],
      meta: { page: 1, limit: 5, total: 3, pages: 1 }
    }
  },
  org_metro_003: {
    data: {
      items: [
        {
          id: "att_h2i3j4k5",
          userId: "usr_m1n2o3p4q5r6",
          workplaceId: "wp_c3d4e5f6",
          date: today,
          approvalStatus: "PENDING",
          hoursWorked: 10,
          notes: "Double shift"
        },
        {
          id: "att_i3j4k5l6",
          userId: "usr_n2o3p4q5r6m1",
          workplaceId: "wp_d4e5f6c3",
          date: today,
          approvalStatus: "PENDING",
          hoursWorked: 8,
          notes: null
        },
        {
          id: "att_j4k5l6m1",
          userId: "usr_p4q5r6m1n2o3",
          workplaceId: "wp_c3d4e5f6",
          date: yesterday,
          approvalStatus: "PENDING",
          hoursWorked: 7,
          notes: null
        },
        {
          id: "att_k5l6m1n2",
          userId: "usr_q5r6m1n2o3p4",
          workplaceId: "wp_e5f6c3d4",
          date: yesterday,
          approvalStatus: "PENDING",
          hoursWorked: null,
          notes: "Missing clock-in"
        }
      ],
      meta: { page: 1, limit: 5, total: 12, pages: 3 }
    }
  }
};

// ---------------------------------------------------------------------------
// SITES data  —  mirrors GET /api/v1/orgs/:orgId/sites
// ---------------------------------------------------------------------------

export type Workplace = {
  id: string;
  name: string;
  location: string;
  activeWorkplaces: number;
};

export const MOCK_WORKPLACES: Record<string, Workplace[]> = {
  org_acme_001: [
    { id: "site_001", name: "Downtown Office", location: "123 Main St, Cityville", activeWorkplaces: 5 },
    { id: "site_002", name: "Uptown Warehouse", location: "456 Industrial Rd, Cityville", activeWorkplaces: 3 },
    { id: "site_007", name: "Suburban Branch", location: "789 Suburb Ln, Cityville", activeWorkplaces: 4 },
    { id: "site_008", name: "Remote Site", location: "N/A - Remote Workers", activeWorkplaces: 2 },
    { id: "site_009", name: "Rooftop Workspace", location: "123 Main St, Cityville - Rooftop", activeWorkplaces: 1 },
    { id: "site_010", name: "Mobile Unit", location: "Varies - Mobile Workforce", activeWorkplaces: 3 },
    { id: "site_011", name: "Satellite Office", location: "321 Side St, Cityville", activeWorkplaces: 2 }
  ],
  org_build_002: [
    { id: "site_003", name: "Construction Site A", location: "789 Construction Ave, Buildtown", activeWorkplaces: 4 },
    { id: "site_004", name: "Construction Site B", location: "321 Development Blvd, Buildtown", activeWorkplaces: 2 }
  ],
  org_metro_003: [
    { id: "site_005", name: "Logistics Hub 1", location: "654 Logistics Ln, Metropolis", activeWorkplaces: 6 },
    { id: "site_006", name: "Logistics Hub 2", location: "987 Distribution Dr, Metropolis", activeWorkplaces: 8 }
  ]
};
