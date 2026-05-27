# 🚀 QUICK START: HOW TO RUN PAHADI-CRAFT ADMIN PANEL

## ⚡ 30-Second Setup

### Terminal 1: Start Backend
```powershell
cd c:\Users\yashi\OneDrive\Desktop\Pahadi-Craft\backend
npm start
```
✅ **You should see:**
```
Backend server is running at http://localhost:4000
```

### Terminal 2: Start Frontend
```powershell
cd c:\Users\yashi\OneDrive\Desktop\Pahadi-Craft\Frontend
npm run dev
```
✅ **You should see:**
```
  VITE v5.4.8  ready in XXX ms
  ➜  Local:   http://localhost:5173/
  ➜  press h + enter to show help
```

## ✅ Both servers must run simultaneously!

---

## 📱 Access the Admin Panel

Open browser and go to: **http://localhost:5173/admin/login**

### Login Credentials
```
Email: admin@pahadicraft.com
Password: Admin@123
```

Click "Sign In" → You're logged in with real JWT token from backend!

---

## ✅ What's Working

- ✅ Admin login (real JWT authentication)
- ✅ Dashboard (real analytics from backend)
- ✅ Product manager (load, create, edit, delete products)
- ✅ Search/filter/sort (all connected to backend)
- ✅ Real-time updates (instant feedback via toast notifications)

---

## 🔄 Stop Servers

- **Backend**: Press `Ctrl+C` in terminal 1
- **Frontend**: Press `Ctrl+C` in terminal 2

---

## 📋 Other Admin Roles (for testing)

| Email | Password | Role |
|-------|----------|------|
| manager@pahadicraft.com | Manager@123 | Product Manager |
| content@pahadicraft.com | Content@123 | Content Manager |

---

## 📚 Full Documentation

For complete setup, troubleshooting, and detailed API documentation, see:
- **HOW_TO_RUN_BACKEND.md** - Complete guide with everything
- **BACKEND_INTEGRATION_GUIDE.md** - Detailed API documentation

---

**That's it! Your admin panel with real backend is running!** 🎉
