-- Enable pgcrypto for encryption utilities
CREATE EXTENSION IF NOT EXISTS "pgcrypto";
-- Enable uuid-ossp for UUID generation (Prisma uses gen_random_uuid() from pgcrypto)
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Row Level Security will be applied via Prisma migrations
-- This init script only sets up extensions needed before Prisma runs
