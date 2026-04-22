# Deployment Guide

This guide covers deploying the full-stack application to a VPS using Docker.

## Prerequisites

- VPS with Ubuntu 20.04+ or similar Linux distribution
- Root or sudo access
- Domain name (optional, for SSL)

## Step 1: Install Docker and Docker Compose

```bash
# Update system packages
sudo apt-get update
sudo apt-get upgrade -y

# Install Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh

# Add your user to docker group
sudo usermod -aG docker $USER

# Install Docker Compose
sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose

# Verify installation
docker --version
docker-compose --version
```

## Step 2: Clone Repository

```bash
# Clone your repository
git clone <your-repository-url>
cd internshipAssignment
```

## Step 3: Configure Environment Variables

```bash
# Copy example environment file
cp .env.example .env

# Edit environment variables
nano .env
```

**Important variables to configure:**
- `MYSQL_ROOT_PASSWORD`: Strong password for MySQL
- `MYSQL_PASSWORD`: Strong password for MySQL user
- `JWT_SECRET`: Strong secret key (min 32 characters)
- `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET`: From Google Cloud Console
- `TELEGRAM_BOT_TOKEN`: From BotFather
- `FRONTEND_URL`: Your domain or VPS IP
- `NEXT_PUBLIC_API_URL`: Your domain or VPS IP with /api/v1

## Step 4: Configure Domain (Optional)

If using a domain name:

```bash
# Update DNS records
# Add A record pointing to your VPS IP address
# Example: yourdomain.com -> 123.45.67.89
```

## Step 5: Generate SSL Certificates (Optional)

For HTTPS support:

```bash
# Install Certbot
sudo apt-get install certbot -y

# Stop any service using port 80
docker compose down

# Generate certificate
sudo certbot certonly --standalone -d yourdomain.com

# Copy certificates to nginx/ssl directory
sudo cp /etc/letsencrypt/live/yourdomain.com/fullchain.pem nginx/ssl/cert.pem
sudo cp /etc/letsencrypt/live/yourdomain.com/privkey.pem nginx/ssl/key.pem

# Set proper permissions
sudo chown $USER:$USER nginx/ssl/*.pem
```

Edit `nginx/nginx.conf` and uncomment the HTTPS server block.

## Step 6: Deploy Application

```bash
# Build and start all services
docker compose up -d --build

# Check service status
docker compose ps

# View logs
docker compose logs -f
```

## Step 7: Verify Deployment

```bash
# Check if all services are running
docker compose ps

# Test backend health
curl http://localhost/api/v1/health

# Test frontend
curl http://localhost
```

## Step 8: Configure Firewall

```bash
# Allow HTTP and HTTPS
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp

# Enable firewall
sudo ufw enable
```

## Maintenance

### View Logs
```bash
docker compose logs -f [service_name]
```

### Restart Services
```bash
docker compose restart [service_name]
```

### Update Application
```bash
git pull
docker compose up -d --build
```

### Backup Database
```bash
docker compose exec mysql mysqldump -u root -p internship > backup.sql
```

### Restore Database
```bash
docker compose exec -T mysql mysql -u root -p internship < backup.sql
```

### SSL Certificate Renewal
```bash
# Renew certificates (run every 60 days)
sudo certbot renew

# Copy new certificates
sudo cp /etc/letsencrypt/live/yourdomain.com/fullchain.pem nginx/ssl/cert.pem
sudo cp /etc/letsencrypt/live/yourdomain.com/privkey.pem nginx/ssl/key.pem

# Restart NGINX
docker compose restart nginx
```

## Monitoring

### Check Resource Usage
```bash
docker stats
```

### Check Disk Space
```bash
df -h
docker system df
```

### Clean Up Unused Resources
```bash
docker system prune -a
```

## Troubleshooting

### Services Not Starting
```bash
# Check logs
docker compose logs

# Check specific service
docker compose logs backend
```

### Port Already in Use
```bash
# Find process using port
sudo lsof -i :80
sudo lsof -i :443

# Kill process or change port in .env
```

### Database Connection Issues
```bash
# Check MySQL is running
docker compose ps mysql

# Access MySQL shell
docker compose exec mysql mysql -u root -p
```

## Security Recommendations

1. **Change default passwords** in `.env` file
2. **Use strong JWT secret** (min 32 characters)
3. **Enable firewall** and only allow necessary ports
4. **Use HTTPS** in production with valid SSL certificates
5. **Regular backups** of database
6. **Keep Docker images updated**: `docker compose pull && docker compose up -d`
7. **Monitor logs** for suspicious activity
8. **Limit SSH access** to specific IP addresses

## Production Checklist

- [ ] Environment variables configured with production values
- [ ] Strong passwords for database and JWT
- [ ] SSL certificates installed and HTTPS enabled
- [ ] Firewall configured
- [ ] Domain DNS configured
- [ ] Database backup strategy in place
- [ ] Monitoring setup (optional: Prometheus, Grafana)
- [ ] Log rotation configured
- [ ] Auto-renewal for SSL certificates
- [ ] Regular security updates scheduled
