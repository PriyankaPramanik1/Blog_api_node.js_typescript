import dotenv from 'dotenv';
dotenv.config();
import express from 'express';
import { db } from './app/config/db';

const app = express();
const port = process.env.PORT || 3000;


app.use(express.json());

import { authRouter } from './app/router/authRoutes';
app.use('/auth', authRouter

)
import { blogRouter } from './app/router/blogRoutes';
app.use('/api', blogRouter)

db.then(() => {
    app.listen(process.env.PORT, () => console.log(`Server is running on port http://localhost:${process.env.PORT}`))
});
