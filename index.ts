import express from 'express';
import path from 'path';
import errorhandler from './errors/errorhandler';
import cors from 'cors';
import dotenv from 'dotenv';
import * as jwt from 'jsonwebtoken';
import apiAuthRouter from './routes/apiAuth';
import apiEditRouter from './routes/apiEdit';
import apiDevelopersRouter from './routes/apiDevelopers';

dotenv.config();

const app : express.Application = express();

const checkToken = (req : express.Request, res : express.Response, next : express.NextFunction) => {

    try {

        let token : string = req.headers.authorization!.split(" ")[1];
    
        res.locals.user = jwt.verify(token, String(process.env.ACCESS_TOKEN_KEY));

        next();

    } catch (e: any) {
        console.error('Token verification error:', e);
        res.status(401).json({});
    }

}

app.use(cors({origin : "http://localhost:3000"}));

app.use(express.static(path.resolve(__dirname, "public")));

app.use("/api/developers", apiDevelopersRouter);

app.use("/api/auth", apiAuthRouter);

app.use("/api/edit", checkToken, apiEditRouter);

app.use(errorhandler);

app.use((req : express.Request, res : express.Response, next : express.NextFunction) => {

    if (!res.headersSent) {
        res.status(404).json({ message : "Faulty route"});
    }

    next();
    
});

app.listen(Number(process.env.PORT), () => {

    console.log(`Server running in port : ${Number(process.env.PORT)}`);    

});