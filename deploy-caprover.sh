#!/bin/bash

# CapRover Deployment Script for apiPushover
# Make sure you have caprover CLI installed: npm install -g caprover

echo "🚀 Starting CapRover deployment for apiPushover..."

# Check if caprover CLI is installed
if ! command -v caprover &> /dev/null; then
    echo "❌ CapRover CLI not found. Installing..."
    npm install -g caprover
fi

# Login to CapRover (if not already logged in)
echo "🔐 Logging in to CapRover..."
caprover login

# Create app if it doesn't exist
echo "📱 Creating app 'apiPushover'..."
caprover apps:create apiPushover || echo "App might already exist, continuing..."

# Deploy the application
echo "🚀 Deploying application..."
caprover deploy --appName apiPushover

echo "✅ Deployment complete!"
echo ""
echo "📋 Next steps:"
echo "1. Go to your CapRover dashboard"
echo "2. Navigate to Apps → apiPushover → App Configs → Environment Variables"
echo "3. Add your Pushover credentials:"
echo "   - PUSHOVER_APP_TOKEN=your_token_here"
echo "   - PUSHOVER_USER_KEY=your_user_key_here"
echo "   - PUSHOVER_DEVICE=your_device_name (optional)"
echo "   - PORT=3000"
echo "   - NODE_ENV=production"
echo "4. Save and restart the app"
echo ""
echo "🌐 Your app will be available at: https://apiPushover.your-caprover-domain.com"
echo "🔍 Health check: https://apiPushover.your-caprover-domain.com/api/v1/health"
echo "🎮 GraphQL Playground: https://apiPushover.your-caprover-domain.com/api/v1/graphql"