# Pull repo from GitHub
git pull --force

# Install dependencies
npm install

# Generate Prisma schema
npx prisma generate

# Build TypeScript
npm run build

# Flush PM2 logs
pm2 flush

# Restart PM2 app
pm2 restart all

# Show logs
pm2 logs
