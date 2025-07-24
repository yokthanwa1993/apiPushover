# CapRover Deployment Guide

## 📋 Prerequisites

1. **CapRover Server**: Running CapRover instance
2. **CapRover CLI**: Install globally with `npm install -g caprover`
3. **Pushover Credentials**: APP_TOKEN and USER_KEY from Pushover

## 🚀 Deployment Steps

### 1. Login to CapRover
```bash
caprover login
```

### 2. Create New App
```bash
caprover apps:create apiPushover
```

### 3. Configure Environment Variables
Go to your CapRover dashboard → Apps → apiPushover → App Configs → Environment Variables

Add these variables:
```
PUSHOVER_APP_TOKEN=your_actual_app_token_here
PUSHOVER_USER_KEY=your_actual_user_key_here
PUSHOVER_DEVICE=your_device_name_here
PORT=3000
NODE_ENV=production
```

### 4. Deploy from GitHub
Option A: **Deploy from GitHub (Recommended)**
1. Go to CapRover dashboard → Apps → apiPushover → Deployment
2. Select "Deploy from GitHub/Bitbucket/GitLab"
3. Repository: `https://github.com/yokthanwa1993/apiPushover.git`
4. Branch: `main`
5. Click "Deploy Now"

Option B: **Deploy from Local**
```bash
caprover deploy --appName apiPushover
```

### 5. Configure App Settings
1. **Port Mapping**: CapRover will automatically map port 3000
2. **Health Check**: Already configured in Dockerfile
3. **Domain**: Set up custom domain if needed

### 6. Enable HTTPS (Optional)
1. Go to HTTP Settings
2. Enable "Force HTTPS by redirecting all HTTP traffic to HTTPS"
3. Enable "Enable HTTPS" and get SSL certificate

## 🔧 Post-Deployment Configuration

### Health Check Endpoint
Your app will be available at: `https://apiPushover.your-caprover-domain.com`

Test health check:
```bash
curl https://apiPushover.your-caprover-domain.com/api/v1/health
```

### GraphQL Playground
Access GraphQL Playground at:
```
https://apiPushover.your-caprover-domain.com/api/v1/graphql
```

### API Documentation
View API docs at:
```
https://apiPushover.your-caprover-domain.com/api/v1/docs
```

## 📊 Monitoring

### View Logs
```bash
caprover logs --appName apiPushover --lines 100
```

### App Metrics
Monitor your app through CapRover dashboard:
- CPU usage
- Memory usage
- Network traffic
- Response times

## 🔄 Updates

### Auto-Deploy from GitHub
1. Set up webhook in GitHub repository
2. Go to CapRover → Apps → apiPushover → Deployment
3. Enable "Deploy on push"
4. Copy webhook URL to GitHub repository settings

### Manual Update
```bash
# Pull latest changes
git pull origin main

# Deploy
caprover deploy --appName apiPushover
```

## 🐛 Troubleshooting

### Common Issues

**1. App won't start**
- Check environment variables are set correctly
- View logs: `caprover logs --appName apiPushover`
- Verify Pushover credentials

**2. Health check failing**
- Ensure port 3000 is exposed in Dockerfile
- Check if app is binding to 0.0.0.0, not localhost

**3. GraphQL endpoint not accessible**
- Verify app is running on correct port
- Check CapRover port mapping
- Test health endpoint first

**4. Environment variables not working**
- Double-check variable names in CapRover dashboard
- Restart app after changing environment variables
- Verify .env file is not overriding production variables

### Debug Commands
```bash
# Check app status
caprover apps:list

# View detailed logs
caprover logs --appName apiPushover --follow

# Restart app
caprover apps:restart --appName apiPushover
```

## 🔒 Security Considerations

1. **Environment Variables**: Never commit real credentials to repository
2. **HTTPS**: Always enable HTTPS in production
3. **Rate Limiting**: Built-in rate limiting is configured
4. **CORS**: Configure CORS for your domain
5. **Firewall**: Use CapRover's built-in firewall features

## 📈 Scaling

### Horizontal Scaling
1. Go to CapRover dashboard → Apps → apiPushover
2. Increase "Instance Count" for load balancing
3. CapRover will automatically distribute traffic

### Resource Limits
Set appropriate resource limits:
- Memory: 512MB - 1GB recommended
- CPU: 0.5 - 1.0 CPU units

## 🎯 Production Checklist

- [ ] Environment variables configured
- [ ] HTTPS enabled
- [ ] Custom domain set up (optional)
- [ ] Health checks passing
- [ ] Logs monitoring set up
- [ ] Auto-deployment configured
- [ ] Resource limits set
- [ ] Backup strategy in place

## 📞 Support

If you encounter issues:
1. Check CapRover documentation
2. Review application logs
3. Test API endpoints manually
4. Verify Pushover API credentials

---

**Happy deploying! 🚀**