# Deployment Guide

This guide covers deploying the Movie Reservation App to production using Render (backend) and Vercel (frontend).

## Architecture Overview

- **Backend**: Node.js/Express API deployed on Render
- **Frontend**: React/Vite SPA deployed on Vercel
- **Database**: MongoDB Atlas (cloud-hosted)
- **File Storage**: Cloudinary (for avatars and images)
- **Email**: Resend API
- **Cache**: Redis Cloud or Upstash
- **Search**: Elasticsearch Cloud (optional)

---

## Backend Deployment (Render)

### Prerequisites

1. Create a [Render](https://render.com) account
2. Set up external services:
   - MongoDB Atlas database
   - Cloudinary account
   - Resend API key
   - Redis Cloud or Upstash instance
   - (Optional) Elasticsearch Cloud
   - (Optional) Razorpay account for payments

### Step 1: Prepare Your Repository

Ensure your code is pushed to GitHub, GitLab, or Bitbucket. The `server/render.yaml` file is already configured.

### Step 2: Create Web Service on Render

1. Go to [Render Dashboard](https://dashboard.render.com)
2. Click **New +** → **Web Service**
3. Connect your repository
4. Configure the service:
   - **Name**: `movie-reservation-api` (or your choice)
   - **Region**: Choose closest to your users
   - **Branch**: `main` (or your production branch)
   - **Root Directory**: `server`
   - **Environment**: `Node`
   - **Build Command**: `npm install && npm run build`
   - **Start Command**: `npm start`
   - **Plan**: Free (or paid for better performance)

### Step 3: Configure Environment Variables

Add these environment variables in Render dashboard (Settings → Environment):

#### Required Variables

```bash
# Server Configuration
NODE_ENV=production
PORT=10000

# Database (MongoDB Atlas)
MONGODB_URI=mongodb+srv://<username>:<password>@<cluster>.mongodb.net/<database>?retryWrites=true&w=majority

# JWT Secret (generate a strong random string)
JWT_SECRET=your-super-secret-jwt-key-minimum-32-characters-long

# Redis (Redis Cloud or Upstash)
REDIS_URL=redis://<username>:<password>@<host>:<port>

# Cloudinary (for image uploads)
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret

# Email Service (Resend)
RESEND_API_KEY=re_your_resend_api_key

# Frontend URL (will be your Vercel URL)
FRONTEND_URL=https://your-app.vercel.app

# Elasticsearch (optional - for advanced search)
ELASTICSEARCH_NODE=https://your-elasticsearch-cloud-url:9200

# Payment Gateway (optional - Razorpay)
RAZORPAY_KEY_ID=your-razorpay-key-id
RAZORPAY_KEY_SECRET=your-razorpay-key-secret
```

#### How to Get Each Variable

**MONGODB_URI**:
1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a free cluster
3. Click "Connect" → "Connect your application"
4. Copy the connection string and replace `<password>` and `<database>`

**JWT_SECRET**:
- Generate a secure random string (32+ characters)
- Use: `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"`

**REDIS_URL**:
- Option 1: [Redis Cloud](https://redis.com/try-free/) - Free 30MB
- Option 2: [Upstash](https://upstash.com/) - Serverless Redis
- Get connection URL from dashboard

**CLOUDINARY_***:
1. Sign up at [Cloudinary](https://cloudinary.com/)
2. Go to Dashboard
3. Copy Cloud Name, API Key, and API Secret

**RESEND_API_KEY**:
1. Sign up at [Resend](https://resend.com/)
2. Go to API Keys
3. Create new API key

**ELASTICSEARCH_NODE** (Optional):
- Use [Elastic Cloud](https://cloud.elastic.co/) free trial
- Or remove Elasticsearch features from code

**RAZORPAY_*** (Optional):
- Sign up at [Razorpay](https://razorpay.com/)
- Get keys from Dashboard → Settings → API Keys

### Step 4: Deploy

1. Click **Create Web Service**
2. Render will automatically deploy from your repository
3. Monitor the build logs for any errors
4. Once deployed, note your backend URL: `https://movie-reservation-api.onrender.com`

### Step 5: Set Up Health Checks

Render automatically uses the `/health` endpoint defined in your app. Verify it's working:
```bash
curl https://your-app.onrender.com/health
```

### Important Notes for Render

- **Free tier**: Service spins down after 15 minutes of inactivity (first request may be slow)
- **Uploads folder**: Render's filesystem is ephemeral. Use Cloudinary for persistent storage
- **Build time**: First build may take 5-10 minutes
- **Auto-deploy**: Enabled by default on git push

---

## Frontend Deployment (Vercel)

### Prerequisites

1. Create a [Vercel](https://vercel.com) account
2. Have your backend URL from Render deployment

### Step 1: Prepare Environment Variables

Create a `.env.production` file in the `client` folder (don't commit this):

```bash
VITE_API_URL=https://your-render-backend-url.onrender.com/api
```

### Step 2: Deploy to Vercel

#### Option A: Using Vercel CLI

1. Install Vercel CLI:
```bash
npm install -g vercel
```

2. Navigate to client folder:
```bash
cd client
```

3. Deploy:
```bash
vercel
```

4. Follow the prompts:
   - Set up and deploy? **Y**
   - Which scope? Select your account
   - Link to existing project? **N**
   - Project name? `movie-reservation-app` (or your choice)
   - In which directory is your code? `./`
   - Override settings? **N**

5. Set environment variable:
```bash
vercel env add VITE_API_URL production
```
Enter your backend URL: `https://your-render-backend-url.onrender.com/api`

6. Deploy to production:
```bash
vercel --prod
```

#### Option B: Using Vercel Dashboard

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Click **Add New** → **Project**
3. Import your Git repository
4. Configure project:
   - **Framework Preset**: Vite
   - **Root Directory**: `client`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
   - **Install Command**: `npm install`

5. Add Environment Variable:
   - Key: `VITE_API_URL`
   - Value: `https://your-render-backend-url.onrender.com/api`

6. Click **Deploy**

### Step 3: Update Backend CORS

After getting your Vercel URL, update the `FRONTEND_URL` environment variable in Render:

1. Go to Render Dashboard → Your Service → Environment
2. Update `FRONTEND_URL` to your Vercel URL: `https://your-app.vercel.app`
3. Save changes (this will trigger a redeploy)

### Step 4: Verify Deployment

1. Visit your Vercel URL
2. Test authentication (login/register)
3. Test API calls (movies, profile, etc.)
4. Check browser console for any CORS errors

### Important Notes for Vercel

- **Automatic deployments**: Every git push to main branch triggers deployment
- **Preview deployments**: Pull requests get preview URLs
- **Environment variables**: Separate for Development, Preview, and Production
- **Custom domain**: Can add custom domain in project settings
- **Build time**: Usually 1-2 minutes

---

## Post-Deployment Checklist

### Backend (Render)

- [ ] Service is running and healthy (`/health` endpoint returns 200)
- [ ] MongoDB connection is successful
- [ ] Redis connection is working
- [ ] Cloudinary uploads are working
- [ ] Environment variables are all set correctly
- [ ] CORS allows your frontend domain
- [ ] Logs show no critical errors

### Frontend (Vercel)

- [ ] Application loads without errors
- [ ] API calls reach backend successfully
- [ ] Authentication works (login/register)
- [ ] Avatar uploads work
- [ ] Profile page loads correctly
- [ ] Movies page displays data
- [ ] Admin features work (if admin user)
- [ ] No CORS errors in browser console

### Testing Checklist

1. **Authentication Flow**:
   - Register new user with avatar
   - Login with credentials
   - Access protected routes
   - Logout successfully

2. **Movies Feature**:
   - Browse movies list
   - Search movies
   - Filter by category
   - View movie details
   - Check nearby shows (with location permission)

3. **Profile Management**:
   - View profile
   - Update profile information
   - Avatar displays correctly

4. **Admin Features** (if applicable):
   - Access admin dashboard
   - Create theater
   - Edit theater
   - Delete theater
   - Search theaters

---

## Troubleshooting

### Backend Issues

**Service won't start**:
- Check build logs in Render dashboard
- Verify all environment variables are set
- Check MongoDB connection string format
- Ensure Node version compatibility

**CORS errors**:
- Verify `FRONTEND_URL` matches your Vercel URL exactly
- Check CORS configuration in `server/index.ts`
- Ensure no trailing slashes in URLs

**Database connection fails**:
- Verify MongoDB Atlas allows connections from anywhere (0.0.0.0/0)
- Check username/password in connection string
- Ensure database name is correct

**Redis connection fails**:
- Verify Redis URL format
- Check Redis Cloud/Upstash dashboard for connection details
- Ensure Redis instance is running

**File uploads fail**:
- Verify Cloudinary credentials
- Check upload folder permissions (though Cloudinary is recommended)
- Review multer configuration

### Frontend Issues

**API calls fail**:
- Check `VITE_API_URL` environment variable
- Verify backend is running and accessible
- Check browser network tab for actual URLs being called
- Ensure `/api` is included in the URL

**Authentication doesn't work**:
- Check localStorage for tokens
- Verify JWT_SECRET is set on backend
- Check token expiration settings
- Review axios interceptor configuration

**Images don't load**:
- Verify Cloudinary URLs are correct
- Check avatar path format
- Ensure VITE_API_URL is set correctly for fallback

**Build fails**:
- Check for TypeScript errors
- Verify all dependencies are in package.json
- Check Node version compatibility
- Review build logs in Vercel dashboard

---

## Environment Variables Summary

### Backend (Render) - 11 Variables

| Variable | Required | Description | Example |
|----------|----------|-------------|---------|
| `NODE_ENV` | Yes | Environment mode | `production` |
| `PORT` | Yes | Server port | `10000` |
| `MONGODB_URI` | Yes | MongoDB connection string | `mongodb+srv://...` |
| `JWT_SECRET` | Yes | JWT signing secret | `random-32-char-string` |
| `REDIS_URL` | Yes | Redis connection URL | `redis://...` |
| `CLOUDINARY_CLOUD_NAME` | Yes | Cloudinary cloud name | `your-cloud-name` |
| `CLOUDINARY_API_KEY` | Yes | Cloudinary API key | `123456789012345` |
| `CLOUDINARY_API_SECRET` | Yes | Cloudinary API secret | `abcdef123456` |
| `RESEND_API_KEY` | Yes | Resend email API key | `re_...` |
| `FRONTEND_URL` | Yes | Frontend URL for CORS | `https://app.vercel.app` |
| `ELASTICSEARCH_NODE` | No | Elasticsearch URL | `https://...` |
| `RAZORPAY_KEY_ID` | No | Razorpay key ID | `rzp_...` |
| `RAZORPAY_KEY_SECRET` | No | Razorpay secret | `...` |

### Frontend (Vercel) - 1 Variable

| Variable | Required | Description | Example |
|----------|----------|-------------|---------|
| `VITE_API_URL` | Yes | Backend API URL | `https://api.onrender.com/api` |

---

## Monitoring and Maintenance

### Render Monitoring

- Check service logs regularly
- Monitor response times
- Set up alerts for downtime
- Review resource usage

### Vercel Monitoring

- Check deployment logs
- Monitor build times
- Review analytics (if enabled)
- Check error tracking

### Database Maintenance

- Monitor MongoDB Atlas metrics
- Set up backup schedules
- Review slow queries
- Check storage usage

---

## Scaling Considerations

### When to Upgrade

**Backend (Render)**:
- Upgrade from Free tier if:
  - Need faster cold starts
  - Require more than 512MB RAM
  - Need persistent disk storage
  - Require custom domains with SSL

**Frontend (Vercel)**:
- Upgrade from Hobby tier if:
  - Need team collaboration
  - Require password protection
  - Need advanced analytics
  - Require more bandwidth

**Database (MongoDB Atlas)**:
- Upgrade from Free tier (512MB) if:
  - Storage exceeds 500MB
  - Need more than 100 connections
  - Require automated backups
  - Need better performance

---

## Security Best Practices

1. **Never commit `.env` files** - Use `.env.example` as template
2. **Use strong JWT secrets** - Minimum 32 characters, random
3. **Enable HTTPS only** - Both Render and Vercel provide this
4. **Rotate secrets regularly** - Especially after team changes
5. **Limit CORS origins** - Only allow your frontend domain
6. **Use environment-specific configs** - Different keys for dev/prod
7. **Enable rate limiting** - Already configured in the app
8. **Monitor logs** - Watch for suspicious activity
9. **Keep dependencies updated** - Regular security patches
10. **Use MongoDB IP whitelist** - Restrict database access

---

## Support and Resources

- **Render Docs**: https://render.com/docs
- **Vercel Docs**: https://vercel.com/docs
- **MongoDB Atlas**: https://docs.atlas.mongodb.com
- **Cloudinary**: https://cloudinary.com/documentation
- **Resend**: https://resend.com/docs

---

## Quick Reference Commands

### Backend Development
```bash
cd server
npm install
npm run dev
```

### Frontend Development
```bash
cd client
npm install
npm run dev
```

### Build for Production
```bash
# Backend
cd server
npm run build
npm start

# Frontend
cd client
npm run build
npm run preview
```

### Environment Setup
```bash
# Copy example files
cp server/.env.example server/.env
cp client/.env.example client/.env

# Edit with your values
# Then deploy!
```

---

## Conclusion

Your Movie Reservation App is now deployed and ready for production use. Remember to:

1. Monitor both services regularly
2. Keep dependencies updated
3. Back up your database
4. Review logs for errors
5. Test all features after deployment

For issues or questions, refer to the troubleshooting section or check the official documentation of each service.
