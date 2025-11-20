# 🚀 Deployment Guide - Homelab with Traefik

This guide explains how to set up automatic deployment of Task Tracker to your homelab Docker server using GitHub Container Registry, Traefik, and Watchtower.

## 📋 Overview

The deployment workflow:
1. Push changes to the `main` branch on GitHub
2. GitHub Actions automatically builds a Docker image
3. The image is pushed to GitHub Container Registry (ghcr.io)
4. Watchtower on your homelab detects the new image
5. Watchtower pulls and restarts the container automatically
6. Traefik handles HTTPS routing and SSL certificates

---

## 🔧 One-Time Setup on Your Homelab Server

### Step 1: Authenticate with GitHub Container Registry

On your Docker server, log in to GitHub Container Registry:

```bash
# Create a GitHub Personal Access Token (PAT) first:
# 1. Go to: https://github.com/settings/tokens
# 2. Click "Generate new token" (classic)
# 3. Give it a name like "homelab-docker"
# 4. Select scope: "read:packages"
# 5. Click "Generate token" and copy it

# Log in to GitHub Container Registry
docker login ghcr.io -u YOUR_GITHUB_USERNAME
# When prompted for password, paste your PAT
```

This saves your credentials to `~/.docker/config.json` which Watchtower will use.

### Step 2: Clone or download the repository files

```bash
# Create a directory for the project
mkdir -p ~/docker/task-tracker
cd ~/docker/task-tracker

# Clone the repository (or just download the files you need)
git clone https://github.com/ilie/task-tracker.git .
# OR download just the necessary files:
# - docker-compose.yml
# - .env.example
```

### Step 3: Configure environment variables

```bash
# Copy the example env file
cp .env.example .env

# Edit the .env file with your settings
nano .env
```

Edit `.env` with your domain:

```env
# Your domain for Traefik routing
TASK_TRACKER_DOMAIN=task.local.flo-dev.com

# How often Watchtower checks for updates (in seconds)
WATCHTOWER_POLL_INTERVAL=300
```

### Step 4: Pull the initial image

```bash
# Pull the latest image from GitHub Container Registry
docker compose pull
```

### Step 5: Start the services

```bash
# Start in detached mode
docker compose up -d
```

This will:
- Start the Task Tracker app with Traefik labels
- Start Watchtower to monitor for updates
- Connect to your existing Traefik proxy network

### Step 6: Verify it's running

```bash
# Check container status
docker compose ps

# View logs
docker compose logs -f task-tracker

# Check Watchtower logs
docker compose logs -f watchtower
```

Access your app at: `https://task.local.flo-dev.com` (or your configured domain)

---

## 🔄 How Automatic Updates Work

Once set up, the workflow is completely automatic:

1. **You make changes** and push to the `main` branch
2. **GitHub Actions** builds and pushes the new image (~2-3 minutes)
3. **Watchtower checks** for updates every 5 minutes (configurable)
4. **Watchtower pulls** the new image and restarts the container
5. **Traefik** automatically routes traffic to the updated container
6. **Your app** is updated with minimal downtime!

Monitor deployments:
- GitHub Actions: `https://github.com/ilie/task-tracker/actions`
- Watchtower logs: `docker compose logs -f watchtower`
- Task Tracker logs: `docker compose logs -f task-tracker`

---

## 📊 Useful Commands

```bash
# View all logs
docker compose logs -f

# View Watchtower logs only
docker compose logs -f watchtower

# View Task Tracker logs only
docker compose logs -f task-tracker

# Manually trigger an update check (instead of waiting)
docker exec watchtower /watchtower --run-once

# Restart the Task Tracker app
docker compose restart task-tracker

# Stop everything
docker compose down

# Pull latest image and restart
docker compose pull && docker compose up -d

# View current image version
docker inspect ghcr.io/ilie/task-tracker:latest --format='{{.RepoDigests}}'
```

---

## ⚙️ Configuration Options

### Change Update Check Interval

Edit `.env` file:

```env
WATCHTOWER_POLL_INTERVAL=300  # Seconds
```

Common values:
- `60` = 1 minute (more frequent, higher resource usage)
- `300` = 5 minutes (recommended)
- `900` = 15 minutes (less frequent)
- `3600` = 1 hour (infrequent updates)

Then restart Watchtower:
```bash
docker compose restart watchtower
```

### Change Domain

Edit `.env` file:

```env
TASK_TRACKER_DOMAIN=your-new-domain.com
```

Then recreate the container:
```bash
docker compose up -d
```

---

## 🔒 Security Notes

- The `.env` file is git-ignored and never committed to GitHub
- GitHub Personal Access Token should have **read:packages** scope only
- Traefik handles SSL/TLS certificates automatically
- Watchtower has access to Docker socket - keep your server secure
- The app runs behind Traefik with HTTPS enabled

---

## 🐛 Troubleshooting

### Watchtower not pulling updates?

```bash
# Check Watchtower logs
docker compose logs watchtower

# Verify you can pull manually
docker pull ghcr.io/ilie/task-tracker:latest

# Check authentication
docker login ghcr.io

# Manually trigger update
docker exec watchtower /watchtower --run-once
```

### Can't access the app via domain?

```bash
# Check Traefik can reach the container
docker compose ps

# Verify Traefik labels
docker inspect task-tracker | grep -A 20 Labels

# Check Traefik logs (if accessible)
docker logs traefik

# Verify proxy network
docker network inspect proxy
```

### Authentication errors when pulling?

```bash
# Re-authenticate with GitHub Container Registry
docker login ghcr.io -u YOUR_GITHUB_USERNAME

# Restart Watchtower to pick up new credentials
docker compose restart watchtower
```

### App not starting?

```bash
# Check logs for errors
docker compose logs task-tracker

# Verify image exists
docker images | grep task-tracker

# Try pulling fresh
docker compose pull task-tracker
docker compose up -d
```

### Environment variables not working?

```bash
# Verify .env file exists
cat .env

# Check if variables are loaded
docker compose config

# Make sure to recreate containers after .env changes
docker compose down
docker compose up -d
```

---

## 🎯 Traefik Integration

Your setup includes:
- ✅ HTTP to HTTPS redirect
- ✅ SSL/TLS termination at Traefik
- ✅ Automatic certificate management
- ✅ Load balancer configuration
- ✅ External proxy network

The app is configured to work seamlessly with your existing Traefik setup.

---

## 📚 Additional Resources

- [Watchtower Documentation](https://containrrr.dev/watchtower/)
- [GitHub Container Registry Docs](https://docs.github.com/en/packages/working-with-a-github-packages-registry/working-with-the-container-registry)
- [Traefik Documentation](https://doc.traefik.io/traefik/)
- [Docker Compose Documentation](https://docs.docker.com/compose/)
