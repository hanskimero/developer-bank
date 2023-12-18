import express from 'express';
import { ErrorInfo } from '../errors/errorhandler';
import { Prisma, PrismaClient } from '@prisma/client';

const prisma : PrismaClient = new PrismaClient();

const apiDevelopersRouter : express.Router = express.Router();

apiDevelopersRouter.use(express.json());

apiDevelopersRouter.get("/", async (req : express.Request, res : express.Response, next : express.NextFunction) => {

    try {
        const developers = await prisma.developer.findMany();

        res.json({ developers });
    
    } catch (e : any) {
        next(new ErrorInfo());
    }

});

apiDevelopersRouter.get("/:id", async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    
    try {

      const developerId = Number(req.params.id);
  
      const developer = await prisma.developer.findUnique({
        where: {
          id: developerId,
        },
        include: {
          projects: true,
        },
      });
  
      if (developer) {
        res.json(developer);
      } else {
        next(new ErrorInfo(400, "Faulty id"));
      }
  
    } catch (e: any) {
      next(new ErrorInfo());
    }
  });

  

export default apiDevelopersRouter;