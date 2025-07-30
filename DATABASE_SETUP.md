# 🗄️ Neon Database Setup Guide

## Step 1: Create Neon Database

1. Go to [neon.tech](https://neon.tech) and create a free account
2. Click "Create Project"
3. Choose a project name (e.g., "project-tracker")
4. Select a region close to your users
5. Click "Create Project"

## Step 2: Get Connection String

1. In your Neon dashboard, go to "Connection Details"
2. Copy the connection string that looks like:
   ```
   postgresql://username:password@ep-xxxxx.region.neon.tech/database_name?sslmode=require
   ```

## Step 3: Update Environment Variables

1. Open the `.env` file in your project root
2. Replace `your_neon_connection_string_here` with your actual connection string:
   ```env
   DATABASE_URL=postgresql://username:password@ep-xxxxx.region.neon.tech/database_name?sslmode=require
   ```

## Step 4: Test the Connection

1. Start your development server:
   ```bash
   npm run dev
   ```

2. Check the health endpoint:
   ```bash
   curl http://localhost:5173/api/health
   ```

3. You should see a response with database connection status and counts.

## Step 5: Deploy to Vercel

1. In your Vercel dashboard, go to your project settings
2. Add the environment variable:
   - Key: `DATABASE_URL`
   - Value: Your Neon connection string
3. Redeploy your project

## Database Schema

The following tables will be automatically created:

- **projects**: Store project information
- **stages**: Store project stages/phases
- **tasks**: Store individual tasks

## Troubleshooting

- **Connection Error**: Make sure your connection string is correct and includes `?sslmode=require`
- **Permission Error**: Ensure your Neon database user has the necessary permissions
- **SSL Error**: Add `ssl: { rejectUnauthorized: false }` to the pool configuration for development

## Features

✅ **Automatic table creation** - Tables are created on first run  
✅ **CASCADE deletion** - Deleting projects removes associated stages and tasks  
✅ **UUID primary keys** - Modern, secure identifier system  
✅ **Indexed queries** - Optimized for performance  
✅ **Error handling** - Comprehensive error messages  