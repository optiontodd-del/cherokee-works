import { Handler } from "@netlify/functions";

interface Job {
  id: string;
  title: string;
  company_id: string;
  description: string;
  location: string;
  category: string;
  salary_min?: number;
  salary_max?: number;
  job_type: string;
  status: "draft" | "pending_review" | "published" | "rejected" | "closed";
  published_at?: string;
  expires_at?: string;
  created_at: string;
  view_count?: number;
  application_count?: number;
}

// Mock database for demo purposes
const jobs: Map<string, Job> = new Map();

function generateId(): string {
  return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
}

export const handler: Handler = async (event) => {
  // Handle CORS
  if (event.httpMethod === "OPTIONS") {
    return {
      statusCode: 200,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, PATCH, OPTIONS",
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

  // TODO: Verify token with auth function

  const path = event.path;
  const method = event.httpMethod;

  try {
    // GET /api/admin/jobs - List all jobs
    if (method === "GET" && path === "/api/admin/jobs") {
      const jobList = Array.from(jobs.values());
      return {
        statusCode: 200,
        body: JSON.stringify({
          jobs: jobList,
          total: jobList.length,
        }),
      };
    }

    // POST /api/admin/jobs - Create new job
    if (method === "POST" && path === "/api/admin/jobs") {
      const body = event.body ? JSON.parse(event.body) : {};
      const job: Job = {
        id: generateId(),
        title: body.title,
        company_id: body.company_id,
        description: body.description,
        location: body.location,
        category: body.category,
        salary_min: body.salary_min,
        salary_max: body.salary_max,
        job_type: body.job_type,
        status: "draft",
        created_at: new Date().toISOString(),
        view_count: 0,
        application_count: 0,
      };

      jobs.set(job.id, job);

      return {
        statusCode: 201,
        body: JSON.stringify(job),
      };
    }

    // GET /api/admin/jobs/:id - Get single job
    const jobIdMatch = path.match(/\/api\/admin\/jobs\/([^/]+)$/);
    if (method === "GET" && jobIdMatch) {
      const jobId = jobIdMatch[1];
      const job = jobs.get(jobId);

      if (!job) {
        return {
          statusCode: 404,
          body: JSON.stringify({ error: "Job not found" }),
        };
      }

      return {
        statusCode: 200,
        body: JSON.stringify(job),
      };
    }

    // PUT /api/admin/jobs/:id - Update job
    if (method === "PUT" && jobIdMatch) {
      const jobId = jobIdMatch[1];
      const job = jobs.get(jobId);

      if (!job) {
        return {
          statusCode: 404,
          body: JSON.stringify({ error: "Job not found" }),
        };
      }

      const body = event.body ? JSON.parse(event.body) : {};
      const updated: Job = {
        ...job,
        ...body,
        id: job.id,
        created_at: job.created_at,
      };

      jobs.set(jobId, updated);

      return {
        statusCode: 200,
        body: JSON.stringify(updated),
      };
    }

    // DELETE /api/admin/jobs/:id - Delete job
    if (method === "DELETE" && jobIdMatch) {
      const jobId = jobIdMatch[1];
      const job = jobs.get(jobId);

      if (!job) {
        return {
          statusCode: 404,
          body: JSON.stringify({ error: "Job not found" }),
        };
      }

      jobs.delete(jobId);

      return {
        statusCode: 200,
        body: JSON.stringify({ success: true, deleted: jobId }),
      };
    }

    // PATCH /api/admin/jobs/:id/publish - Publish job
    const publishMatch = path.match(/\/api\/admin\/jobs\/([^/]+)\/publish$/);
    if (method === "PATCH" && publishMatch) {
      const jobId = publishMatch[1];
      const job = jobs.get(jobId);

      if (!job) {
        return {
          statusCode: 404,
          body: JSON.stringify({ error: "Job not found" }),
        };
      }

      const updated: Job = {
        ...job,
        status: "published",
        published_at: new Date().toISOString(),
      };

      jobs.set(jobId, updated);

      return {
        statusCode: 200,
        body: JSON.stringify(updated),
      };
    }

    // PATCH /api/admin/jobs/:id/unpublish - Unpublish job
    const unpublishMatch = path.match(/\/api\/admin\/jobs\/([^/]+)\/unpublish$/);
    if (method === "PATCH" && unpublishMatch) {
      const jobId = unpublishMatch[1];
      const job = jobs.get(jobId);

      if (!job) {
        return {
          statusCode: 404,
          body: JSON.stringify({ error: "Job not found" }),
        };
      }

      const updated: Job = {
        ...job,
        status: "draft",
        published_at: undefined,
      };

      jobs.set(jobId, updated);

      return {
        statusCode: 200,
        body: JSON.stringify(updated),
      };
    }

    return {
      statusCode: 404,
      body: JSON.stringify({ error: "Not found" }),
    };
  } catch (error) {
    console.error("Jobs API error:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Internal server error" }),
    };
  }
};
