# Kairos Transcultural - Deployment Guide

## Prerequisites

- ✅ Server access: `ssh root@88.198.218.71`
- ✅ Dokploy installed: `https://dokploy.ifrim.tech`
- ✅ Domain: `kairostranscultural.ifrim.tech`
- ✅ Supabase project configured

---

## Quick Deployment (5 minutes)

### Step 1: Set Up Nginx & SSL (Run on Server)

```bash
# SSH into your server
ssh root@88.198.218.71

# Download and run the deployment script
cd /root
git clone <your-repo-url> kairos-transcultural
cd kairos-transcultural
chmod +x deploy-setup.sh
./deploy-setup.sh
```

**Or do it manually:**

```bash
# 1. Create Nginx config
sudo nano /etc/nginx/sites-available/kairostranscultural.ifrim.tech
```

Paste this configuration:
```nginx
server {
    listen 80;
    server_name kairostranscultural.ifrim.tech;
    return 301 https://$host$request_uri;
}

server {
    listen 443 ssl http2;
    server_name kairostranscultural.ifrim.tech;

    ssl_certificate /etc/letsencrypt/live/kairostranscultural.ifrim.tech/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/kairostranscultural.ifrim.tech/privkey.pem;
    include /etc/nginx/snippets/ssl-params.conf;

    location / {
        proxy_pass http://127.0.0.1:8080;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto https;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
    }
}
```

```bash
# 2. Enable site
sudo ln -s /etc/nginx/sites-available/kairostranscultural.ifrim.tech /etc/nginx/sites-enabled/

# 3. Test Nginx
sudo nginx -t

# 4. Generate SSL certificate
sudo certbot --nginx -d kairostranscultural.ifrim.tech

# 5. Reload Nginx
sudo systemctl reload nginx
```

---

### Step 2: Deploy with Dokploy

1. **Go to Dokploy**: https://dokploy.ifrim.tech

2. **Create New Application**:
   - Click "Create Application"
   - Connect your GitHub repository
   - Select branch: `main`

3. **Configure Build**:
   - **Build Type**: `Dockerfile`
   - **Dockerfile Path**: `./Dockerfile`
   - **Context Path**: `/`
   - **Container Port**: `3000`

4. **Configure Domain**:
   - **Domain**: `kairostranscultural.ifrim.tech`
   - **HTTPS**: Enabled ✓

5. **Environment Variables** (already in .env.local):
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `NEXT_PUBLIC_SITE_URL`

6. **Deploy**:
   - Click "Deploy"
   - Wait for build (~3-5 minutes)

---

### Step 3: Verify Deployment

```bash
# Check if container is running
docker ps | grep kairos

# Check logs
docker service logs kairos-transcultural --tail 50

# Test the application
curl -I https://kairostranscultural.ifrim.tech
```

---

## Dokploy Configuration Summary

| Setting | Value |
|---------|-------|
| **Build Type** | Dockerfile |
| **Dockerfile** | `./Dockerfile` (multi-stage build) |
| **Container Port** | 3000 |
| **Domain** | kairostranscultural.ifrim.tech |
| **SSL** | Managed by Nginx (Let's Encrypt) |
| **Proxy** | Nginx → Traefik → Container |

---

## Environment Variables (Already Set)

The `.env.local` file contains all necessary variables:

```env
NEXT_PUBLIC_SUPABASE_URL=https://rzpssehbzutuakyremya.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGci...
SUPABASE_SERVICE_ROLE_KEY=...
NEXT_PUBLIC_SITE_URL=https://kairostranscultural.ifrim.tech
OPENROUTER_API_KEY=sk-or-v1-672eaf1dde558d83734085b097b9995d2f746f5ff35ecc18384dc93b63bfc12
```

**Important**: The `.env.local` file is committed to the repo because Next.js needs these variables at **build time**.

---

## Troubleshooting

### Application Not Loading

```bash
# Check container status
docker ps | grep kairos

# Check container logs
docker logs <container-id> --tail 100

# Restart the service
docker service update --force kairos-transcultural
```

### SSL Certificate Errors

```bash
# Check certificate expiry
openssl x509 -enddate -noout -in /etc/letsencrypt/live/kairostranscultural.ifrim.tech/fullchain.pem

# Renew certificate
sudo certbot renew --force-renewal

# Reload Nginx
sudo systemctl reload nginx
```

### Port Conflicts

```bash
# Check what's listening on port 3000
netstat -tlnp | grep :3000

# Check Traefik configuration
cat /etc/dokploy/traefik/dynamic/kairos-transcultural.yml
```

### Build Errors in Dokploy

```bash
# Check build logs in Dokploy UI
# Common issues:
# - Missing .env.local file
# - Node modules not installing
# - Build timeout (increase in Dokploy settings)

# Solution: Check Dockerfile build stage
docker build -t kairos-test .
```

---

## Post-Deployment Checklist

- [ ] Homepage loads at https://kairostranscultural.ifrim.tech
- [ ] Supabase connection works (check browser console)
- [ ] Admin login works (danifrim14@gmail.com / K348S953WE)
- [ ] Participants can be added/edited/deleted
- [ ] Cohorts can be managed
- [ ] Images load correctly
- [ ] SSL certificate is valid (check browser lock icon)
- [ ] No console errors in browser

---

## Architecture Overview

```
User Request
    ↓
Nginx (Port 443, SSL)
    ↓
Traefik (Port 8080, Docker Swarm routing)
    ↓
Kairos Container (Port 3000, Next.js)
    ↓
Supabase (Database + Auth)
```

---

## Useful Commands

### On Your Local Machine

```bash
# Check git status
git status

# Commit changes
git add .
git commit -m "feat: Update for deployment"
git push

# SSH into server
ssh root@88.198.218.71
```

### On The Server

```bash
# Check application logs
docker service logs kairos-transcultural -f

# Restart application
docker service update --force kairos-transcultural

# Scale to zero (stop)
docker service scale kairos-transcultural=0

# Scale back up (start)
docker service scale kairos-transcultural=1

# Check Nginx status
systemctl status nginx

# Check Nginx error logs
tail -f /var/log/nginx/kairostranscultural.ifrim.tech-error.log

# Check SSL certificates
ls -la /etc/letsencrypt/live/kairostranscultural.ifrim.tech/
```

---

## Monitoring

### View Real-Time Logs

```bash
# Application logs
docker service logs kairos-transcultural -f --tail 50

# Nginx access logs
tail -f /var/log/nginx/kairostranscultural.ifrim.tech-access.log

# Nginx error logs
tail -f /var/log/nginx/kairostranscultural.ifrim.tech-error.log
```

### Health Check

```bash
# Check if site is accessible
curl -I https://kairostranscultural.ifrim.tech

# Check SSL certificate
curl -vI https://kairostranscultural.ifrim.tech 2>&1 | grep -i ssl

# Check response time
time curl -s https://kairostranscultural.ifrim.tech > /dev/null
```

---

## Rollback Procedure

If something goes wrong:

```bash
# 1. Revert to previous commit
git revert HEAD
git push

# 2. Redeploy in Dokploy
# Dokploy will automatically detect the new commit and redeploy

# 3. If that fails, scale to zero
docker service scale kairos-transcultural=0

# 4. Check previous version
docker service ps kairos-transcultural
```

---

## Performance Optimization

### Enable Compression (in Nginx)

```nginx
# Add to server block
gzip on;
gzip_vary on;
gzip_types text/plain text/css application/json application/javascript text/xml application/xml application/xml+rss text/javascript;
```

### Configure Caching (in Next.js)

Already configured in `next.config.ts`:
- Static asset optimization
- Image optimization
- Font optimization
- Script optimization

---

## Security Notes

1. **Environment Variables**: Contains Supabase keys, but .env.local is gitignored
2. **SSL/TLS**: Enabled by default with Let's Encrypt
3. **Authentication**: Admin areas protected by Supabase Auth
4. **RLS Policies**: Configured in Supabase for data access control
5. **CORS**: Configured to allow only your domain

---

## Backup Strategy

### Database Backups (Supabase)

- Automated daily backups (configured in Supabase dashboard)
- Point-in-time recovery enabled
- Export functionality available

### Application Backups

```bash
# Backup Docker volumes (if needed)
docker run --rm -v kairos_transcultural_data:/data -v $(pwd):/backup alpine tar czf /backup/kairos-backup-$(date +%Y%m%d).tar.gz /data
```

---

## Support

If you encounter issues:

1. **Check Dokploy logs** in the UI
2. **Check server logs** via SSH
3. **Review this guide** for common issues
4. **Check Supabase dashboard** for database issues

**Server**: Hetzner (88.198.218.71)  
**Dokploy**: https://dokploy.ifrim.tech  
**Application**: https://kairostranscultural.ifrim.tech  
**Documentation**: Updated January 6, 2026
