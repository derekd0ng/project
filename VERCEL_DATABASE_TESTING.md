# 🚀 Vercel Database Testing Guide

## Your Vercel Deployment URL

Your project is likely deployed at one of these URLs:
- `https://project-derekd0ng.vercel.app`
- `https://project-git-main-derekd0ngs-projects.vercel.app`
- Check your Vercel dashboard for the exact URL

## 🧪 Database Testing Endpoints (Production)

Replace `YOUR_VERCEL_URL` with your actual Vercel deployment URL:

### 🏥 Health & Connection Tests

**Basic Health Check:**
```
https://YOUR_VERCEL_URL/api/health
```

**Connection Test:**
```
https://YOUR_VERCEL_URL/api/test/connection
```

**Schema Check:**
```
https://YOUR_VERCEL_URL/api/test/tables
```

### 📊 Data Testing

**Create Sample Data:**
```bash
curl -X POST https://YOUR_VERCEL_URL/api/test/sample-data
```

**View All Data:**
```
https://YOUR_VERCEL_URL/api/test/all-data
```

**Performance Test:**
```
https://YOUR_VERCEL_URL/api/test/performance
```

**Clear All Data:**
```bash
curl -X DELETE https://YOUR_VERCEL_URL/api/test/clear-data
```

## 🔧 Setup Steps for Vercel

### 1. Add Database URL to Vercel
1. Go to your Vercel dashboard
2. Select your project
3. Go to **Settings** → **Environment Variables**
4. Add: `DATABASE_URL` = `your_neon_connection_string`
5. Redeploy your project

### 2. Test Database Connection
Click this link (replace with your URL):
```
https://YOUR_VERCEL_URL/api/health
```

Expected response:
```json
{
  "status": "OK",
  "database": "Connected",
  "data": {
    "projects": 0,
    "stages": 0,
    "tasks": 0
  }
}
```

### 3. Create Test Data
Run this command (replace with your URL):
```bash
curl -X POST https://YOUR_VERCEL_URL/api/test/sample-data
```

### 4. Verify Data Creation
Visit:
```
https://YOUR_VERCEL_URL/api/test/all-data
```

## 🌐 Browser Testing (Easy Way)

Just click these links in your browser (replace YOUR_VERCEL_URL):

1. **[Health Check](https://YOUR_VERCEL_URL/api/health)**
2. **[Connection Test](https://YOUR_VERCEL_URL/api/test/connection)**
3. **[Table Schema](https://YOUR_VERCEL_URL/api/test/tables)**
4. **[All Data](https://YOUR_VERCEL_URL/api/test/all-data)**
5. **[Performance Test](https://YOUR_VERCEL_URL/api/test/performance)**

## 📱 Quick Test URLs (Copy & Paste)

**Health Check:**
```
https://project-derekd0ng.vercel.app/api/health
```

**Connection Test:**
```
https://project-derekd0ng.vercel.app/api/test/connection
```

**All Data:**
```
https://project-derekd0ng.vercel.app/api/test/all-data
```

## 🔍 Troubleshooting

### ❌ "Database connection failed"
- Check if `DATABASE_URL` is set in Vercel environment variables
- Verify your Neon connection string is correct
- Ensure the connection string includes `?sslmode=require`

### ❌ 404 Error
- Check if your Vercel deployment is working
- Verify the API routes are properly deployed
- Try the health endpoint first: `/api/health`

### ❌ 500 Internal Server Error
- Check Vercel function logs in your dashboard
- Verify your Neon database is active and accessible
- Check if tables are created (use `/api/test/tables`)

## 🎯 Testing Flow

1. **Check Health**: `GET /api/health`
2. **Test Connection**: `GET /api/test/connection`  
3. **Verify Schema**: `GET /api/test/tables`
4. **Create Data**: `POST /api/test/sample-data`
5. **View Data**: `GET /api/test/all-data`
6. **Check Performance**: `GET /api/test/performance`

## 🔒 Security Note

⚠️ **Remove test endpoints before production!** These endpoints expose database operations and should be removed or protected with authentication in a real production environment.