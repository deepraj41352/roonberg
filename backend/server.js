import express from 'express';

import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import userRouter from './routers/userRouter.js';
import swaggerJSDoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';

dotenv.config();
mongoose
  .connect(process.env.MONGODB_URI, {
    useUnifiedTopology: true,
    useNewUrlParser: true,

    autoIndex: true, //make this also true
  })
  .then(() => {
    console.log('connected to db');
  })
  .catch((err) => {
    console.log(err.message);
  });

const app = express();
const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'RoonBerg',
      version: '1.0.6',
    },
    contact: {
      email: 'deepraj41352@gmail.com',
    },
    servers: [
      {
        url: 'http://localhost:5000',
      },
    ],
    schemes: ['https', 'http'],
  },
  apis: ['./server.js', './routers/userRouter.js'],
};

const swaggerSpec = swaggerJSDoc(options);
app.use('/api', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/test', (req, res) => {
  res.send('Hello');
});

app.use('/api/user', userRouter);

const _dirname = path.resolve();
app.use(express.static(path.join(_dirname, 'frontend/build')));
app.get('*', (req, res) =>
  res.sendFile(path.join(_dirname, 'frontend/build/index.htlm'))
);

app.use((err, req, res, next) => {
  console.log(err.message);
  res.status(500).send({ message: err.message });
});

const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`server is running on port : ${port}`);
});
