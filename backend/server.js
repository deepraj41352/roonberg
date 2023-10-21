import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import userRouter from './routers/userRouter.js';
import swaggerJSDoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import projectRouter from './routers/projectRouter.js';
import categoryRouter from './routers/categoryRouter.js';
import conversationRouter from './routers/conversationRouter.js';
import MessageRouter from './routers/MessageRoute.js';
import cron from 'node-cron';
import Imap from 'node-imap';
import nodemailer from 'nodemailer';
import EmailParser from 'email-reply-parser';

dotenv.config();
mongoose
  .connect(process.env.MONGODB_URI, {
    useUnifiedTopology: true,
    useNewUrlParser: true,
    autoIndex: true, // Make this also true
  })
  .then(() => {
    console.log('Connected to the database');
  })
  .catch((err) => {
    console.error(err.message);
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
        url:
          process.env.NODE_ENV !== 'production'
            ? 'http://localhost:5001'
            : 'https://roonberg.onrender.com',
      },
    ],
    schemes: ['https', 'http'],
  },
  apis: ['./server.js', './routers/userRouter.js'],
};

const swaggerSpec = swaggerJSDoc(options);

app.use('/api/doc', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/api', (req, res) => {
  res.send('Welcome to Roonberg World');
});

app.use('/api/user', userRouter);
app.use('/api/project', projectRouter);
app.use('/api/category', categoryRouter);
app.use('/api/conversation', conversationRouter);
app.use('/api/message', MessageRouter);

async function callMailSenderAPI() {
  try {
    const imapConfig = {
      user: "roonberg2023@gmail.com",
      password: "oxvl ruhy hgzd pugc",
      host: "imap.gmail.com",
      port: 993,
      tls: true,
    };
    // const imapConfig = {
    //   user: 'read@login.roonberg.com',
    //   password: 'pass@$123',
    //   host: 'login.roonberg.com',
    //   port: 143,
    //   tls: false, // Use TLS if required
    // };
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS_KEY,
      },
    });

    const imap = new Imap(imapConfig);
    // // Function to send an email
    // const mailOptions = {
    //   from: 'roonberg2023@gmail.com',
    //   to: 'priynsujn01@gmail.com', // Replace with the recipient's email address
    //   subject: 'Reset Password', // Specify the email subject
    //   text: 'Your reset password link: https://example.com/reset-password', // Specify the email text
    // };
    
    // // Send the email
    // transporter.sendMail(mailOptions, (error, info) => {
    //   if (error) {
    //     console.error('Error sending email:', error);
    //   } else {
    //     console.log('Email sent: ' + info.response);
    //   }
    // });

    imap.once('ready', () => {
      imap.openBox('INBOX', false, (err, mailbox) => {
        if (err) throw err;

        imap.search(['UNSEEN'], (err, results) => {
          if (err) throw err;

          results.forEach((emailNumber) => {
            const emailMessage = imap.fetch(emailNumber, { bodies: '' });
            emailMessage.on('message', (msg) => {
              msg.on('body', (stream) => {
                let message = '';
                stream.on('data', (chunk) => {
                  message += chunk.toString('utf8');
                });
                stream.once('end', () => {
                  const emailMessage = message;
                  const from = emailMessage.match(/^From: (.+)/m);
                  const to = emailMessage.match(/^To: (.+)/m);
                  const subject = emailMessage.match(/^Subject: (.+)/m);
                  const textMatch = emailMessage.match(/Content-Type: text\/plain; charset="UTF-8"\r\n\r\n([\s\S]*)/);
                  const text = textMatch ? textMatch[1] : '';
                  console.log('From:', from ? from[1] : '');
                  console.log('To:', to ? to[1] : '');
                  console.log('Subject:', subject ? subject[1] : '');
                  console.log('Text:', text);
                  // Your processing logic here
                
                  // Example: Send an email reply
                  // sendEmail(from ? from[1] : '', 'Re: ' + (subject ? subject[1] : ''), 'Your reply message goes here');
                
                  // Mark the email as seen
                  imap.addFlags(emailNumber, ['\\Seen'], (err) => {
                    if (err) console.error('Seen_error',err);
                  });
                });
              });
            });
          });

          // Close the connection
          imap.end();
        });
      });
    });

    imap.once('error', (err) => {
      console.error('IMAP Error:', err);
    });

    imap.connect();
  } catch (error) {
    console.error('Error making API call:', error);
  }
}

cron.schedule('* * * * *', () => {
  console.log('This task will run every minute');
  callMailSenderAPI();
});

const _dirname = path.resolve();
app.use(express.static(path.join(_dirname, 'frontend/build')));
app.get('*', (req, res) =>
  res.sendFile(path.join(_dirname, 'frontend/build/index.html'))

);

app.use((err, req, res, next) => {
  console.error(err.message);
  res.status(500).send({ message: err.message });
});

const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`Server is running on port: ${port}`);
});
