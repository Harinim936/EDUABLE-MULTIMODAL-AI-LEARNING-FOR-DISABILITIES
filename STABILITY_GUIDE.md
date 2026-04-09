# Stability Guide for EduAble Simplification Feature

## Why It Wasn't Stable (Root Causes)

The content simplification feature had **7 critical stability issues**:

### 1. **Missing Request Timeout**
- **Problem**: Requests had no timeout, so if the server hung or was slow, the frontend would freeze indefinitely
- **Solution**: Added 15-second timeout with `AbortController`

### 2. **Race Conditions**
- **Problem**: If you clicked "Simplify" multiple times quickly, responses could arrive out of order, showing old results
- **Solution**: Added `requestId` tracking to ignore stale responses

### 3. **No Response Validation**
- **Problem**: Code assumed the server response always had `simplifiedText`, but if the server crashed during processing, nothing would catch it
- **Solution**: Added validation checks for response structure before accessing properties

### 4. **Memory Leaks in Error State**
- **Problem**: Error messages persisted even after new successful requests, confusing users
- **Solution**: Clear error state before each new request

### 5. **Poor Server Input Validation**
- **Problem**: Server had minimal checks, could crash on unexpected input (null, empty, non-string values)
- **Solution**: Added comprehensive validation: type checking, length limits, empty string checks

### 6. **No Server Error Recovery**
- **Problem**: If simplification function failed, error details weren't properly passed to frontend
- **Solution**: Wrapped in try-catch with detailed error messages

### 7. **Inconsistent Error Handling**
- **Problem**: Two different components (Simplify.jsx and SimplifyPage.tsx) handled errors differently
- **Solution**: Standardized error handling pattern in both

---

## How to Run the Project Properly

### Prerequisites
- Node.js (v16+)
- npm or yarn

### Setup Steps

#### 1. Install Frontend Dependencies
```bash
cd d:\Edu
npm install
```

#### 2. Install Backend Server Dependencies
```bash
cd d:\Edu\server
npm install
cd ..
```

#### 3. Start Backend Server (Terminal 1)
```bash
cd d:\Edu\server
npm start
```

**Expected Output:**
```
✅ EduAble Backend running at http://localhost:5000
📍 Health Check: http://localhost:5000/health
📍 Endpoints:
   - POST /api/tts        (Text to Speech)
   - POST /api/stt        (Speech to Text)
   - POST /api/sign       (Sign Language Detection)
   - POST /api/simplify   (Content Simplification)
```

#### 4. Start Frontend Dev Server (Terminal 2)
```bash
cd d:\Edu
npm run dev
```

**Expected Output:**
```
  VITE v... ready in ... ms

  ➜  Local:   http://localhost:5173/
  ➜  press h to show help
```

#### 5. Open in Browser
- Navigate to `http://localhost:5173/`
- Login if required
- Navigate to the Content Simplification feature

---

## Testing the Stability Improvements

### Test Case 1: Normal Operation
1. Paste this text: `"The photosynthesis process is fundamental to the ecosystem. Plants utilize sunlight to create energy."`
2. Click "Simplify"
3. **Expected**: See simplified text, key points, and process flow

### Test Case 2: Timeout Handling
1. Open browser DevTools (F12)
2. Go to Network tab
3. Set throttling to "Slow 3G"
4. Paste text and click "Simplify"
5. **Expected**: See "Request timed out" message instead of hanging UI

### Test Case 3: Rapid Requests (Race Condition)
1. Paste different texts in quick succession
2. Click "Simplify" multiple times rapidly
3. **Expected**: Only the latest result shows (no stale data)

### Test Case 4: Server Unavailable
1. Stop the backend server
2. Try to simplify text
3. **Expected**: See "Backend may not be running" error message

### Test Case 5: Empty Input
1. Leave text empty
2. Click "Simplify"
3. **Expected**: See "Please enter text" validation message

### Test Case 6: Very Long Text
1. Paste 5000+ characters
2. Press "Simplify"
3. **Expected**: Server rejects with "Text is too long" message

---

## Monitoring for Stability

### Check Server Health
```bash
curl http://localhost:5000/health
```

**Expected Response:**
```json
{
  "status": "ok",
  "message": "EduAble Backend is running",
  "endpoints": ["/api/tts", "/api/stt", "/api/sign", "/api/simplify"],
  "version": "1.0.0"
}
```

### Check Server Logs
Monitor the terminal where the server is running for these good signs:
- ✅ No error messages
- ✅ Requests logged as they arrive
- ✅ Port 5000 is not already in use

### Troubleshooting

**"Address already in use" error:**
```bash
# Windows - Find process on port 5000
netstat -ano | findstr :5000

# Kill the process (replace 1234 with PID)
taskkill /PID 1234 /F

# Or use a different port
PORT=5001 npm start
```

**Module not found errors:**
```bash
# In server directory
rm -r node_modules package-lock.json
npm install

# In root directory
npm install
```

**CORS errors in console:**
- Make sure server is running at `http://localhost:5000`
- Server has `cors()` middleware enabled
- Frontend is making requests to correct URL

---

## Code Changes Made

### Frontend (2 files updated)
1. **`src/modules/Simplify.jsx`**
   - Added `requestId` for race condition prevention
   - Added 15-second timeout with `AbortController`
   - Added response validation
   - Added better error messages

2. **`src/app/components/SimplifyPage.tsx`**
   - Same improvements as above

### Backend (1 file updated)
1. **`server/index.js`**
   - Enhanced `simplifyContent()` function with input validation
   - Added comprehensive checks in `/api/simplify` endpoint
   - Added text length limit (5000 characters)
   - Improved error messages
   - All arrays now guaranteed to return (never undefined)

---

## Best Practices Going Forward

1. **Always run both servers** before testing any feature
2. **Check server logs** first if something seems broken
3. **Use the Health Check endpoint** to verify server is running
4. **Monitor browser console** (DevTools) for error messages
5. **Keep text under 5000 characters** for stable performance

