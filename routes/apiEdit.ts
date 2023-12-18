import express from 'express';
import { ErrorInfo } from '../errors/errorhandler';
import { PrismaClient } from '@prisma/client';

const prisma : PrismaClient = new PrismaClient();

const apiEditRouter : express.Router = express.Router();

apiEditRouter.use(express.json());

apiEditRouter.delete("/projects/:id", async (req : express.Request, res : express.Response, next : express.NextFunction) => {

  if (await prisma.project.count({
        where : {
             id : Number(req.params.id)
         }
     }))  {
     try {

         await prisma.project.delete({
             where : {
                 id : Number(req.params.id)
             }
         });

         res.json(await prisma.project.findMany({
             where : {
                 developerId : Number(res.locals.user.id)
             }
         }));

     } catch (e : any) {
         next(new ErrorInfo())
     }
 } else {
     next(new ErrorInfo(400, "Faulty id"));
 }

});

apiEditRouter.put("/projects/:id", async (req : express.Request, res : express.Response, next : express.NextFunction) => {
  
  const { headline, description, techUsed1, techUsed2, techUsed3, techUsed4, techUsed5, techUsed6, repoUrl } = req.body;

  if (await prisma.project.count({
      where : {
          id : Number(req.params.id)
      }
      })) {
      
        try {

          await prisma.project.update({
            where : {
                id : Number(req.params.id)
            },
            data: {
              headline,
              description,
              techUsed1,
              techUsed2,
              techUsed3,
              techUsed4,
              techUsed5,
              techUsed6,
              repoUrl,
              developer: {
                connect: {
                  id: Number(res.locals.user.id),
                },
              },
            },
            
        });

        res.json(await prisma.project.findMany({
            where : {
                developerId : Number(res.locals.user.id)
            }
        }));

        } catch (e: any) {
          next(new ErrorInfo())
        }

      } else {
        next(new ErrorInfo(400, "Faulty id"))
      }     

    });

apiEditRouter.post("/", async (req: express.Request, res: express.Response, next: express.NextFunction) => {
  
  try {

    const { headline, description, techUsed1, techUsed2, techUsed3, techUsed4, techUsed5, techUsed6, repoUrl } = req.body;

    const userId = res.locals.user.id;

    const developer = await prisma.developer.findUnique({
    where: { userId },
    });

    const newProject = await prisma.project.create({
      data: {
        headline,
        description,
        techUsed1,
        techUsed2,
        techUsed3,
        techUsed4,
        techUsed5,
        techUsed6,
        repoUrl,
        developer: {
          connect: {
            id: developer?.id,
          },
        },
      },
    });

    res.json(await prisma.project.findMany({
      where : {
          developerId : Number(res.locals.user.id)
      }
    }));

  } catch (e: any) {
  
    next(new ErrorInfo());
  }
});

apiEditRouter.put("/:id", async (req: express.Request, res: express.Response, next: express.NextFunction) => {
  
  try {

    const { description, githubUrl } = req.body;

    const userId = res.locals.user.id;

    const updatedDeveloper = await prisma.developer.update({
      where: {
        id: userId,
      },
      data: {
        githubUrl,
        description,
      },
    });

    res.json(await prisma.developer.findUnique({
      where : { userId }
    }));

  } catch (e: any) {
    console.error('Prisma error:', e);
    next(new ErrorInfo(500, 'Internal server error'));
  }
});
  
  

export default apiEditRouter;