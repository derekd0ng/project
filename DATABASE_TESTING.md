# 🧪 Database Testing Endpoints

## Quick Test URLs

Once your server is running, test these endpoints to verify database functionality:

### 🏥 Health & Connection Tests

**Basic Health Check:**
```
GET /api/health
```
Shows connection status and data counts.

**Connection Test:**
```
GET /api/test/connection
```
Tests database connection, shows version, and connection pool stats.

**Schema Check:**
```
GET /api/test/tables
```
Verifies all tables exist and shows column information.

### 📊 Data Testing

**Create Sample Data:**
```
POST /api/test/sample-data
```
Creates a complete test project with stages and tasks.

**View All Data:**
```
GET /api/test/all-data
```
Shows all data with full hierarchical relationships.

**Performance Test:**
```
GET /api/test/performance
```
Runs multiple queries and measures execution time.

**Clear All Data:**
```
DELETE /api/test/clear-data
```
⚠️ **Warning**: Deletes ALL data from database.

## Testing Workflow

### 1. Basic Connection Test
```bash
curl http://localhost:5173/api/health
curl http://localhost:5173/api/test/connection
```

### 2. Verify Schema
```bash
curl http://localhost:5173/api/test/tables
```

### 3. Create Test Data
```bash
curl -X POST http://localhost:5173/api/test/sample-data
```

### 4. Verify Data Creation
```bash
curl http://localhost:5173/api/test/all-data
```

### 5. Test Performance
```bash
curl http://localhost:5173/api/test/performance
```

### 6. Cleanup (Optional)
```bash
curl -X DELETE http://localhost:5173/api/test/clear-data
```

## Expected Responses

### ✅ Successful Health Check
```json
{
  "status": "OK",
  "timestamp": "2024-01-XX...",
  "message": "API is working with Neon database!",
  "database": "Connected",
  "data": {
    "projects": 0,
    "stages": 0,
    "tasks": 0
  }
}
```

### ✅ Successful Sample Data Creation
```json
{
  "status": "SUCCESS",
  "message": "Sample data created successfully",
  "data": {
    "project": {...},
    "stages": [...],
    "tasks": [...],
    "summary": {
      "projects_created": 1,
      "stages_created": 3,
      "tasks_created": 9
    }
  }
}
```

### ❌ Connection Error
```json
{
  "status": "ERROR",
  "message": "Database connection failed",
  "database": "Disconnected",
  "error": "connection refused..."
}
```

## Browser Testing

You can also test these endpoints directly in your browser:

1. **Health Check**: `http://localhost:5173/api/health`
2. **Connection Test**: `http://localhost:5173/api/test/connection`
3. **Schema Info**: `http://localhost:5173/api/test/tables`
4. **All Data**: `http://localhost:5173/api/test/all-data`
5. **Performance**: `http://localhost:5173/api/test/performance`

## Troubleshooting

### Connection Issues
- Verify your `.env` file has the correct `DATABASE_URL`
- Check Neon dashboard for connection string
- Ensure `?sslmode=require` is in your connection string

### Table Issues
- Tables are created automatically on first run
- Check `/api/test/tables` to verify schema
- Restart server if tables seem missing

### Data Issues
- Use `/api/test/sample-data` to create test data
- Check `/api/test/all-data` to see relationships
- Use `/api/test/clear-data` to reset everything

## Production Notes

⚠️ **Important**: These test endpoints should be removed or protected in production!

Consider adding authentication or removing the `/api/test/*` endpoints before deploying to production.