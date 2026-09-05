# CherokeeWorks Admin Panel Setup Guide

## Overview
This document describes the admin management system for CherokeeWorks, including the integrated admin panel and separate management dashboard.

## Features

### Admin Panel (Integrated)
The admin panel is built into the main site and accessible at `/admin/`:
- **Dashboard**: Overview of site metrics, trending jobs, and quick actions
- **Job Listings**: Full CRUD operations for job postings
- **User Management**: View and manage employer and candidate accounts
- **Moderation Queue**: Review and approve pending job listings
- **Analytics**: Comprehensive site statistics and insights

### Backend API
All admin operations are powered by serverless Netlify Functions:
- `admin-auth.ts`: Authentication and session management
- `admin-jobs.ts`: Job listing operations
- `admin-analytics.ts`: Analytics and metrics
- `admin-users.ts`: User management (coming soon)
- `admin-moderation.ts`: Moderation operations (coming soon)

### Database Schema
The admin system uses these tables in Netlify Database:
- `admin_users`: Admin account credentials
- `job_listings`: Extended job listing data
- `job_metrics`: View/application tracking
- `moderation_queue`: Pending review items
- `user_activity`: User interaction tracking
- `system_logs`: Audit trail
- `site_metrics`: Daily statistics

## Getting Started

### 1. Set Up Netlify Database
```bash
# The database schema is in migrations/001_admin_schema.sql
# Deploy this to your Netlify Database using the Netlify CLI:
netlify db:seed migrations/001_admin_schema.sql
```

### 2. Configure Admin Credentials
Create a `.env` file in your project root:
```
ADMIN_EMAIL=admin@cherokee-works.local
ADMIN_PASSWORD_HASH=<your_password_hash>
```

To generate a password hash:
```bash
node -e "console.log(require('crypto').createHash('sha256').update('changeme123').digest('hex'))"
```

### 3. Deploy to Netlify
```bash
npm run build
netlify deploy --prod
```

## Admin Panel Routes

| Route | Purpose |
|-------|---------|
| `/admin/login` | Admin login page |
| `/admin/dashboard` | Main dashboard |
| `/admin/jobs` | Job management |
| `/admin/users` | User management |
| `/admin/moderation` | Moderation queue |
| `/admin/analytics` | Analytics & insights |

## API Endpoints

### Authentication
```
POST /api/admin-auth
Body: { action: "login", email: string, password: string }
POST /api/admin-auth
Body: { action: "logout" }
GET /api/admin-auth
Headers: { Authorization: "Bearer <token>" }
```

### Jobs
```
GET /api/admin-jobs - List all jobs
POST /api/admin-jobs - Create job
PUT /api/admin-jobs/:id - Update job
DELETE /api/admin-jobs/:id - Delete job
PATCH /api/admin-jobs/:id/publish - Publish job
PATCH /api/admin-jobs/:id/unpublish - Unpublish job
```

### Analytics
```
GET /api/admin-analytics - Full analytics
GET /api/admin-analytics/overview - Overview stats
GET /api/admin-analytics/jobs - Job stats
GET /api/admin-analytics/applications - Application stats
GET /api/admin-analytics/users - User stats
```

## Development

### Run Locally
```bash
npm install
npm run dev
```

The admin panel will be available at `http://localhost:5173/admin`

### Build
```bash
npm run build
```

### Deploy Functions
```bash
netlify deploy
```

## Next Steps

1. **Database Migration**: Apply the schema migration to Netlify Database
2. **Configure Credentials**: Set admin email and password in environment variables
3. **Deploy**: Push to GitHub and Netlify will auto-deploy
4. **Test**: Access the admin panel and verify all features work
5. **Standalone Dashboard**: (Optional) Create a separate React app as a standalone management portal

## Architecture Notes

- **Frontend**: React with TanStack Start framework
- **Backend**: Netlify Functions (Node.js 22.x)
- **Database**: Netlify Database (PostgreSQL)
- **File Storage**: Netlify Blobs (for future exports/reports)
- **Authentication**: Token-based sessions

## Security Considerations

- Admin credentials should be stored in Netlify environment variables
- API endpoints require valid Bearer tokens
- Session tokens expire after 24 hours
- All admin actions are logged in the `system_logs` table
- CORS is configured to allow requests from admin panel

## Troubleshooting

### "Unauthorized" error
- Verify your token is valid: `GET /api/admin-auth`
- Check environment variables are set correctly
- Clear browser cookies and login again

### Database connection issues
- Ensure Netlify Database is provisioned
- Check Netlify CLI is up to date: `npm i -g netlify-cli@latest`
- Verify database migration was applied

### Admin panel not loading
- Clear browser cache
- Check browser console for errors
- Verify `/admin` routes exist in the build

## Support

For issues or questions about the admin system, check:
1. Browser DevTools Console for client-side errors
2. Netlify Function logs for server-side errors
3. This guide for common setup issues
