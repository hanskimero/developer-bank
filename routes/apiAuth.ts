import express from 'express';
import { ErrorInfo } from '../errors/errorhandler';
import { Prisma, PrismaClient } from '@prisma/client';
import * as jwt from 'jsonwebtoken';
import crypto from 'crypto';

const prisma : PrismaClient = new PrismaClient();

const apiAuthRouter : express.Router = express.Router();

apiAuthRouter.use(express.json());

apiAuthRouter.post("/login", async (req : express.Request, res : express.Response, next : express.NextFunction) : Promise<void> => {

  try {
    const user = await prisma.user.findFirst({
      where: {
        username: req.body.username
      },
      include: {
        developer: true
      }
    });

    if (req.body.username === user?.username) {
      let hash = crypto.createHash("SHA256").update(req.body.password).digest("hex");

      if (hash === user?.password) {

        let token = jwt.sign({ id : user.id, username : user.username }, String(process.env.ACCESS_TOKEN_KEY));

        res.json({
          username : user.username,
          token: token,
          devId: user?.developer?.id
        });
      } else {
        next(new ErrorInfo(401, "Faulty username or password"));
      }
    } else {
      next(new ErrorInfo(401, "Faulty username or password"));
    }
  } catch {
    next(new ErrorInfo());
  }

  
});


apiAuthRouter.post("/register", async (req : express.Request, res : express.Response, next : express.NextFunction) : Promise<void> => {

  if (req.body.username && req.body.password) {

      const existingUser = await prisma.user.findFirst({
          where : {
              username : req.body.username
          }
      })

      if (existingUser) {

          next(new ErrorInfo(400, "Username already taken"))

      } else {

          try {

              let hash = crypto.createHash("SHA256").update(req.body.password).digest("hex");

              const newUser = await prisma.user.create({
                  data : {
                      username : req.body.username,
                      password : hash
                  }
              })

              const userId = newUser.id;

              await prisma.developer.create({
                  data : {
                      userId : userId,
                      firstname : req.body.firstname,
                      lastname : req.body.lastname,
                      description : req.body.description,
                      githubUrl : req.body.githubUrl
                  }
              })

              res.status(200).json({ message: "User created successfully" });

          } catch {

              next(new ErrorInfo(500, "Creating new user failed"));
          }
      }

  } else {
      next(new ErrorInfo(400, "Username and password required"));
  }
  

});


export default apiAuthRouter;