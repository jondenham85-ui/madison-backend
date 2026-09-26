import fs from 'fs';
import { Express, Request, Response, NextFunction } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

interface AuthedRequest extends Request {
  user?: {
    id: number;
    email: string;
    role: string;
  };
}

function requireAuth(req: AuthedRequest, res: Response, next: NextFunction) {
  if (!req.user) {
    return res.status(401).json({ error: 'Authentication required' });
  }
  next();
}

function requireOperator(req: AuthedRequest, res: Response, next: NextFunction) {
  if (!req.user || (req.user.role !== 'operator' && req.user.role !== 'admin')) {
    return res.status(403).json({ error: 'Operator access required' });
  }
  next();
}

export function registerOperatorRoutes(app: Express) {
  // CEO code execution
  app.post(
    '/operator/execute',
    requireAuth,
    requireOperator,
    async (req: AuthedRequest, res: Response) => {
      const { code } = req.body;

      try {
        const result = await eval(code);
        res.json({ success: true, result });
      } catch (err: any) {
        res.status(400).json({ success: false, error: err.toString() });
      }
    }
  );

  // File read
  app.post(
    '/operator/file/read',
    requireAuth,
    requireOperator,
    (req: AuthedRequest, res: Response) => {
      const { path } = req.body;
      try {
        const content = fs.readFileSync(path, 'utf8');
        res.json({ success: true, content });
      } catch (err: any) {
        res.status(400).json({ success: false, error: err.toString() });
      }
    }
  );

  // File write
  app.post(
    '/operator/file/write',
    requireAuth,
    requireOperator,
    (req: AuthedRequest, res: Response) => {
      const { path, content } = req.body;
      try {
        fs.writeFileSync(path, content);
        res.json({ success: true });
      } catch (err: any) {
        res.status(400).json({ success: false, error: err.toString() });
      }
    }
  );

  // File patch
  app.post(
    '/operator/file/patch',
    requireAuth,
    requireOperator,
    (req: AuthedRequest, res: Response) => {
      const { path, patch } = req.body; // { target: string, replace: string }

      try {
        let content = fs.readFileSync(path, 'utf8');
        content = content.replace(patch.target, patch.replace);
        fs.writeFileSync(path, content);
        res.json({ success: true });
      } catch (err: any) {
        res.status(400).json({ success: false, error: err.toString() });
      }
    }
  );

  // Deployment trigger (stub)
  app.post(
    '/operator/deploy',
    requireAuth,
    requireOperator,
    async (req: AuthedRequest, res: Response) => {
      const { service } = req.body;

      res.json({ success: true, message: `Deployment triggered for ${service}` });
    }
  );

  // Task engine (to wire to AI later)
  app.post(
    '/operator/task',
    requireAuth,
    requireOperator,
    async (req: AuthedRequest, res: Response) => {
      const { task } = req.body;

      const result = {
        received: task,
        status: 'pending-implementation',
      };

      res.json({ success: true, result });
    }
  );
}
