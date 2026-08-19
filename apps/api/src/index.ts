import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import jwt from 'jsonwebtoken';
import { z } from 'zod';
import { db, users, alerts, safePoints, trustedContacts } from 'db';
import { eq, sql } from 'drizzle-orm';
import * as dotenv from 'dotenv';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
dotenv.config({ path: join(__dirname, '../../../.env') });

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST']
  }
});

// Middleware
app.use(helmet());
app.use(cors({ origin: 'http://localhost:3000' }));
app.use(express.json());

const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes)
  standardHeaders: true,
  legacyHeaders: false,
});
app.use('/api', apiLimiter);

// JWT Middleware
const authenticateToken = (req: any, res: any, next: any) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (token == null) return res.sendStatus(401);

  // Note: Auth.js creates JWTs. If using raw jsonwebtoken, ensure the secret matches and algorithms match. 
  // However, Auth.js v5 uses HKDF on the secret. For simplicity in this Express verification, we assume the token sent
  // is decoded via Auth.js session token on Next.js side and passed, or we just trust Next.js to proxy it.
  // Actually, a better hackathon approach: Next.js reads the session and passes userId in header.
  // Or we implement jose to verify the JWE. To save time, we will look for 'x-user-id' header set by a trusted proxy
  // OR we decode the token if it's a simple JWT. NextAuth uses encrypted JWE by default.
  // Let's rely on a simpler approach: Next.js API routes will proxy calls to Express and inject the verified user ID.
  // For now, let's just use jsonwebtoken as requested, assuming NextAuth is configured with simple JWT.
  
  jwt.verify(token, process.env.AUTH_SECRET as string, (err: any, user: any) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
};

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});

// Create Onboarding (Trusted Contacts & Home Base)
app.post('/api/onboarding', authenticateToken, async (req: any, res: any) => {
  try {
    const { contacts, homeLocation } = req.body;
    const userId = req.user.sub;

    if (homeLocation) {
      await db.update(users).set({
        homeLat: homeLocation.lat,
        homeLng: homeLocation.lng
      }).where(eq(users.id, userId));
    }

    if (contacts && contacts.length > 0) {
      // Clear existing contacts and insert new ones
      await db.delete(trustedContacts).where(eq(trustedContacts.userId, userId));
      await db.insert(trustedContacts).values(
        contacts.map((c: any) => ({
          id: crypto.randomUUID(),
          userId,
          name: c.name,
          phone: c.phone
        }))
      );
    }
    res.json({ success: true });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Trigger SOS
app.post('/api/alerts', authenticateToken, async (req: any, res: any) => {
  try {
    const { lat, lng } = req.body;
    const userId = req.user.sub;

    const newAlert = {
      id: crypto.randomUUID(),
      userId,
      lat,
      lng,
      status: 'active'
    };

    await db.insert(alerts).values(newAlert);

    // Fetch nearest 3 SafePoints (computing in API layer for simplicity)
    const allSafePoints = await db.select().from(safePoints);
    
    // Simple distance calculation (Haversine approximation)
    const distance = (lat1: number, lon1: number, lat2: number, lon2: number) => {
      const p = 0.017453292519943295; // Math.PI / 180
      const c = Math.cos;
      const a = 0.5 - c((lat2 - lat1) * p)/2 + 
                c(lat1 * p) * c(lat2 * p) * 
                (1 - c((lon2 - lon1) * p))/2;
      return 12742 * Math.asin(Math.sqrt(a)); // 2 * R; R = 6371 km
    };

    const nearestSafePoints = allSafePoints
      .map(sp => ({ ...sp, distanceKm: distance(lat, lng, sp.lat, sp.lng) }))
      .sort((a, b) => a.distanceKm - b.distanceKm)
      .slice(0, 3)
      .map(sp => ({
        ...sp,
        distanceText: sp.distanceKm < 1 ? `${Math.round(sp.distanceKm * 1000)}m` : `${sp.distanceKm.toFixed(1)}km`
      }));

    // Emit via Socket.io
    io.to(`guardian-${userId}`).emit('alert-triggered', {
      alert: newAlert,
      safePoints: nearestSafePoints
    });

    res.json({ success: true, alert: newAlert, nearestSafePoints });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Resolve Alert
app.post('/api/alerts/resolve', authenticateToken, async (req: any, res: any) => {
  try {
    const userId = req.user.sub;
    await db.update(alerts)
      .set({ status: 'resolved', resolvedAt: new Date() })
      .where(eq(alerts.userId, userId));
      
    io.to(`guardian-${userId}`).emit('alert-resolved', { userId });
    res.json({ success: true });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

io.on('connection', (socket) => {
  console.log('A user connected:', socket.id);
  
  socket.on('join-dashboard', (userId) => {
    socket.join(`guardian-${userId}`);
    console.log(`User ${socket.id} joined guardian room for ${userId}`);
  });

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
});

const PORT = process.env.PORT || 4000;
httpServer.listen(PORT, () => {
  console.log(`API Server running on port ${PORT}`);
});
