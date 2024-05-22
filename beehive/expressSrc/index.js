const express = require('express');
const mongoose = require('mongoose');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const messageRoutes = require('./routes/message');
const passport = require('passport');
const { GridFsStorage } = require('multer-gridfs-storage')
const MongoClient = require('mongodb').MongoClient;
const WebSocket = require('ws');
const jwt = require('jsonwebtoken');
const fetch = require('node-fetch');
const Message = require('./database/schemas/messagedb');

require('./strategies/local');

require('./strategies/discord');

// Import the cors middleware
const cors = require('cors');

//routes
const cookie = require('cookie');
const cookieParser = require('cookie-parser');
const multer = require('multer');
const groceriesRoute = require('./routes/groceries');
const marketsRoute = require('./routes/markets');
const authRoute = require('./routes/auth');
const user = require('./database/schemas/user');
const postRoute = require('./routes/post');
const jobRoute = require('./routes/jobs');
const friendsRoute = require('./routes/friends');

require('./database/indexdb');

const app = express();
const PORT = 3001;

// Add the cors middleware here
const corsOptions = {
  origin: 'http://localhost:3000', // replace with your React application's origin
  credentials: true,
};

app.use(cors(corsOptions));

app.use(express.json());
app.use(express.urlencoded());
app.use(cookieParser());

const sessionStore = MongoStore.create({
  mongoUrl: 'mongodb://127.0.0.1:27017/?directConnection=true&serverSelectionTimeoutMS=2000&appName=monosh+2.0.1',
});

// mockReq = { 
//   file: mockFile, 
//   headers: { 'content-length': '123' } // Add this line
// };

app.use(session({
  secret: 'sahshahashadas', 
  resave: false, 
  saveUninitialized: false,
  cookie: { secure: process.env.NODE_ENV === 'production' },
  store: sessionStore, // Use the session store
}));


app.use((req, res, next) => {
    console.log(`${req.method}:${req.url}`);
    next();
});

app.use(passport.initialize());
app.use(passport.session());

app.use('/api/v1/groceries', groceriesRoute);
app.use('/api/v1/markets', marketsRoute);
app.use('/api/v1/auth', authRoute);
app.use('/api/v1/messages', messageRoutes);
app.use('/api/v1/post', postRoute);
app.use('/api/v1/jobs', jobRoute);
app.use('/api/v1/friends', friendsRoute);

  // Endpoint to update the username
  app.put('/update-username', (req, res) => {
    if (req.isAuthenticated()) {
      const { username } = req.body;
      // Update the user's username in the database
      req.user.username = username; // Update the username in the user session
      res.status(200).json({ username });
    } else {
      res.status(401).json({ message: 'Authentication required' });
    }
  });

  let gfs;

  const conn = mongoose.createConnection('mongodb://127.0.0.1:27017/?directConnection=true&serverSelectionTimeoutMS=2000&appName=monosh+2.0.1');

  conn.once('open', () => {
    // Init stream
    gfs = new mongoose.mongo.GridFSBucket(conn.db, {
      bucketName: 'uploads'
    });
    console.log('gfs initalized:', gfs);
  });

  const storage = new GridFsStorage({
    url: 'mongodb://127.0.0.1:27017/?directConnection=true&serverSelectionTimeoutMS=2000&appName=monosh+2.0.1',
    file: (req, file) => {
      return new Promise((resolve, reject) => {
        const filename = file.originalname;
        const userId = req.session.userId;
        const username = req.session.username;
        console.log('Received userId:', userId);
        const fileInfo = {
          filename: filename,
          bucketName: 'uploads',
          metadata: {
            userId: userId,
            username: username,
          },
        };
        resolve(fileInfo);
      });
    }
  });
  
  const upload = multer({ storage });
  
  app.post('/upload-image', upload.single('image'), (req, res) => {
    if (req.file) {
      res.status(200).json({ message: 'Image uploaded successfully', imagePath: req.file.path, userId: req.file.metadata.userId, username: req.file.metadata.username });
    } else {
      res.status(400).json({ message: 'No image uploaded' });
    }
  });
  
  app.get('/image/:filename', (req, res) => {
    console.log('filename:', req.params.filename); // Log the filename
  
    gfs.find({ filename: req.params.filename }).toArray((err, files) => {
      if (err) {
        console.error('Error finding file:', err);
        return res.status(500).json({ error: 'Error finding file' });
      }
  
      console.log('files:', files); // Log the files
  
      if (!files || files.length === 0) {
        return res.status(404).json({
          err: 'No file exists'
        });
      }
  
      const file = files[0];
      console.log('file:', file); // Log the file
  
      if (file.contentType === 'image/jpeg' || file.contentType === 'image/png') {
        res.setHeader('content-type', file.contentType); // Set the correct content type
  
        // Create a read stream with the file's _id
        console.log('Creating read stream for file:', file.filename);
        const readStream = gfs.createReadStream({ _id: file._id });
  
        readStream.on('error', (err) => {
          console.error('Error reading file:', err);
          res.status(500).json({ error: 'Error reading file' });
        });
  
        readStream.pipe(res);
      } else {
        res.status(404).json({
          err: 'Not an image'
        });
      }
    });
  });

  // This helper function converts a read stream to a buffer
  function streamToBuffer(readStream) {
    return new Promise((resolve, reject) => {
      const chunks = [];
      readStream.on('data', chunk => chunks.push(chunk));
      readStream.on('end', () => resolve(Buffer.concat(chunks)));
      readStream.on('error', reject);
    });
  }
  
  app.get('/get-image-filenames', async (req, res) => {
    try {
      const client = await MongoClient.connect('mongodb://127.0.0.1:27017/?directConnection=true&serverSelectionTimeoutMS=2000&appName=monosh+2.0.1');
      const db = client.db('test');
      const collection = db.collection('uploads.files');
    
      const { userId } = req.params;
      const files = await collection.find().toArray();
      const images = await Promise.all(files.map(async file => {
        const readStream = gfs.openDownloadStream(file._id);
        const buffer = await streamToBuffer(readStream);
        const base64 = buffer.toString('base64');
        const metadata = file.metadata || {}; 
        return {
          userId: metadata.userId,
          username: metadata.username || 'Unknown', 
          filename: file.filename,
          data: base64,
          contentType: file.contentType,
        };
      }));
  
      res.status(200).json({ images });
    } catch (error) {
      console.error('Error fetching image filenames:', error.message);
      res.status(500).json({ message: 'Error fetching image filenames' });
    }
});

  app.get('/user-images/:userId', async (req, res) => {
    try {
      const client = await MongoClient.connect('mongodb://127.0.0.1:27017/?directConnection=true&serverSelectionTimeoutMS=2000&appName=monosh+2.0.1');
      const db = client.db('test');
      const collection = db.collection('uploads.files');

      // Extract userId from route parameters
      const { userId } = req.params;

      // Modify the find query to match the userId in the metadata field
      const files = await collection.find({ 'metadata.userId': userId }).toArray();

      const images = await Promise.all(files.map(async file => {
        const readStream = gfs.openDownloadStream(file._id);
        const buffer = await streamToBuffer(readStream);
        const base64 = buffer.toString('base64');
        return {
          filename: file.filename,
          data: base64,
          contentType: file.contentType,
        };
      }));

      res.status(200).json({ images });
    } catch (error) {
      console.error('Error in route handler:', error.message);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  });
    
  app.get('/gfs-status', (req, res) => {
    if (gfs) {
      res.status(200).json({ status: 'ready' });
    } else {
      res.status(200).json({ status: 'initializing' });
    }
  });

  app.get('/images', async (req, res) => {
    try {
      const client = await MongoClient.connect('mongodb://127.0.0.1:27017/?directConnection=true&serverSelectionTimeoutMS=2000&appName=monosh+2.0.1');
      const db = client.db('test');
      const collection = db.collection('uploads.files');
  
      const files = await collection.find().toArray();
      const filenames = files.map(file => file.filename);
  
      res.status(200).json({ filenames });
    } catch (error) {
      console.error('Error fetching image filenames:', error.message);
      res.status(500).json({ message: 'Error fetching image filenames' });
    }
  });

  app.get('/messages/:userId', async (req, res) => {
    const { userId } = req.params;
    console.log('this is working...');
    // Fetch all messages where the sender or recipient is the given user ID
    const messages = await Message.find({
      $or: [
        { sender: userId },
        { recipient: userId }
      ]
    }).sort({ createdAt: 1 }).exec();
    res.send(JSON.stringify(messages));
  });

  
const server = app.listen(PORT, () => console.log('Running Express Server on Port', PORT, '!'));
server.setTimeout(5000);

const connections = new Map();
const wss = new WebSocket.Server({ server });

const onlineUsers = new Set();

wss.on('connection', (ws, req) => {
  const cookies = cookie.parse(req.headers.cookie);
  const sid = cookieParser.signedCookie(cookies['connect.sid'], 'sahshahashadas');
  
  sessionStore.load(sid, (error, session) => {
    if (error) {
      // Handle error
      console.log(error);
    } else if (session) {
      console.log('Session userid:', session.userId);
      console.log('Session username:', session.username);
      const user = {userId: session.userId, username: session.username};
      onlineUsers.add(user);
      ws.user = user;
      
      //Sending user info to client
      ws.send(JSON.stringify({
        type: 'userInfo',
        user: ws.user
      }));
    }
  });

  ws.on('message', async (message) => {
    const messageData = JSON.parse(message.toString());
    const {recipient, text} = messageData;
    if (recipient && text) {
      const messageDoc = await Message.create({
        sender: ws.user.userId,
        recipient,
        text,
      });
      [...wss.clients].filter(c => c.user && c.user.userId === recipient)
      .forEach(c => c.send(JSON.stringify({type: 'chatMessage', 
      text,
      sender: ws.user.userId,
      recipient, 
      _id:messageDoc._id,})));
    }
  });

  ws.on('close', () => {
    // Remove the user from the list of online users when they disconnect
    onlineUsers.delete(ws.user);
  });

  console.log([...onlineUsers].map(user => user.username));
  ws.send(JSON.stringify({
    type: 'onlineUsers',
    users: [...onlineUsers]
  }));
});
