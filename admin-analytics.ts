import { Handler } from "@netlify/functions";

interface Analytics {
  overview: {
    total_views: number;
    total_applications: number;
    active_listings: number;
    total_employers: number;
    total_candidates: number;
  };
  jobs: {
    total_posted: number;
    published: number;
    pending_review: number;
    rejected: number;
    by_category: Record<string, number>;
    by_location: Record<string, number>;
  };
  applications: {
    total: number;
    last_7_days: number;
    average_per_job: number;
  };
  users: {
    total_candidates: number;
    total_employers: number;
    new_this_week: number;
    active_this_week: number;
  };
  trending: {
    top_categories: Array<{ category: string; count: number }>;
    top_locations: Array<{ location: string; count: number }>;
    most_viewed_jobs: Array<{ title: string; views: number }>;
  };
}

// Mock analytics data
const mockAnalytics: Analytics = {
  overview: {
    total_views: 12543,
    total_applications: 387,
    active_listings: 42,
    total_employers: 18,
    total_candidates: 1247,
  },
  jobs: {
    total_posted: 156,
    published: 42,
    pending_review: 8,
    rejected: 12,
    by_category: {
      "Healthcare & Nursing": 12,
      "Skilled Trades & Construction": 15,
      "Manufacturing & Production": 8,
      "Transportation & Warehousing": 6,
      "Technology & Engineering": 1,
    },
    by_location: {
      Canton: 18,
      Woodstock: 12,
      "Holly Springs": 7,
      "Ball Ground": 5,
    },
  },
  applications: {
    total: 387,
    last_7_days: 67,
    average_per_job: 9.2,
  },
  users: {
    total_candidates: 1247,
    total_employers: 18,
    new_this_week: 34,
    active_this_week: 287,
  },
  trending: {
    top_categories: [
      { category: "Healthcare & Nursing", count: 12 },
      { category: "Skilled Trades & Construction", count: 15 },
      { category: "Manufacturing & Production", count: 8 },
    ],
    top_locations: [
      { location: "Canton", count: 18 },
      { location: "Woodstock", count: 12 },
      { location: "Holly Springs", count: 7 },
    ],
    most_viewed_jobs: [
      { title: "Registered Nurse - Emergency Department", views: 342 },
      { title: "HVAC Technician", views: 298 },
      { title: "Machine Operator", views: 256 },
    ],
  },
};

export const handler: Handler = async (event) => {
  // Handle CORS
  if (event.httpMethod === "OPTIONS") {
    return {
      statusCode: 200,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type, Authorization",
      },
    };
  }

  // Verify admin authorization
  const token = event.headers.authorization?.replace("Bearer ", "");
  if (!token) {
    return {
      statusCode: 401,
      body: JSON.stringify({ error: "Unauthorized" }),
    };
  }

  const path = event.path;
  const method = event.httpMethod;

  try {
    // GET /api/admin/analytics/overview - Dashboard overview
    if (method === "GET" && path === "/api/admin/analytics/overview") {
      return {
        statusCode: 200,
        body: JSON.stringify({
          overview: mockAnalytics.overview,
          timestamp: new Date().toISOString(),
        }),
      };
    }

    // GET /api/admin/analytics/jobs - Job statistics
    if (method === "GET" && path === "/api/admin/analytics/jobs") {
      return {
        statusCode: 200,
        body: JSON.stringify({
          jobs: mockAnalytics.jobs,
          trending: mockAnalytics.trending,
          timestamp: new Date().toISOString(),
        }),
      };
    }

    // GET /api/admin/analytics/applications - Application statistics
    if (method === "GET" && path === "/api/admin/analytics/applications") {
      return {
        statusCode: 200,
        body: JSON.stringify({
          applications: mockAnalytics.applications,
          timestamp: new Date().toISOString(),
        }),
      };
    }

    // GET /api/admin/analytics/users - User statistics
    if (method === "GET" && path === "/api/admin/analytics/users") {
      return {
        statusCode: 200,
        body: JSON.stringify({
          users: mockAnalytics.users,
          timestamp: new Date().toISOString(),
        }),
      };
    }

    // GET /api/admin/analytics - Full analytics
    if (method === "GET" && path === "/api/admin/analytics") {
      return {
        statusCode: 200,
        body: JSON.stringify({
          ...mockAnalytics,
          timestamp: new Date().toISOString(),
        }),
      };
    }

    return {
      statusCode: 404,
      body: JSON.stringify({ error: "Not found" }),
    };
  } catch (error) {
    console.error("Analytics error:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Internal server error" }),
    };
  }
};
