import express, { Request, Response } from 'express';
import cors from 'cors';
import { MongoClient, ObjectId, ServerApiVersion } from 'mongodb';

require('dotenv').config()

const app = express();
const port: number = Number(process.env.PORT) || 5000;

app.use(cors());
app.use(express.json());

app.get('/', (req: Request, res: Response) => {
  res.send('Hello Worrrrld!');
});

const uri = process.env.MONGODB_URI as string;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});



app.post('/users/update-profile', async (req: Request, res: Response) => {
  try {
    const { email, name, image, role, location, coverPhoto, phoneNumber } = req.body;

    if (!email) {
      return res.status(400).json({ error: 'Email is required' });
    }

    const db = client.db('scholar_stack');
    const userCollection = db.collection('user');

    const result = await userCollection.updateOne(
      { email: email },
      {
        $set: {
          name,
          image,
          role,
          location,
          coverPhoto,
          phoneNumber,
          updatedAt: new Date()
        }
      }
    );

    if (result.matchedCount === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    return res.status(200).json({ success: true, message: 'Profile updated successfully' });
  } catch (error: any) {
    return res.status(500).json({ error: error.message || 'Internal Server Error' });
  }
});

app.post('/courses/add', async (req: Request, res: Response) => {
  try {
    const { title, description, category, price, image, instructor } = req.body;

    if (!title || !instructor) {
      return res.status(400).json({ error: 'Title and Instructor are required' });
    }

    const db = client.db('scholar_stack');
    const coursesCollection = db.collection('courses');

    const newCourse = {
      title,
      description,
      category,
      price: Number(price) || 0,
      image: image || '',
      instructor,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    const result = await coursesCollection.insertOne(newCourse);

    return res.status(201).json({
      success: true,
      message: 'Course created successfully',
      course: { id: result.insertedId, ...newCourse }
    });
  } catch (error: any) {
    return res.status(500).json({ error: error.message || 'Internal Server Error' });
  }
});

app.get('/courses', async (req: Request, res: Response) => {
  try {
    const db = client.db('scholar_stack');
    const coursesCollection = db.collection('courses');
    const courses = await coursesCollection.find({}).toArray();
    return res.status(200).json(courses);
  } catch (error: any) {
    return res.status(500).json({ error: error.message || 'Internal Server Error' });
  }
});

app.get('/courses/:id', async (req: Request<{id: string}>, res: Response) => {
  try {
    const id = req.params.id;
    const db = client.db('scholar_stack');
    const coursesCollection = db.collection('courses');

    let course;
    if (ObjectId.isValid(id)) {
      course = await coursesCollection.findOne({ _id: new ObjectId(id) });
    }

    if (!course) {
      return res.status(404).json({ error: 'Course not found' });
    }

    return res.status(200).json(course);
  } catch (error: any) {
    return res.status(500).json({ error: error.message || 'Internal Server Error' });
  }
});

if (require.main === module) {
  client.connect()
    .then(() => {
      console.log("Successfully connected to MongoDB!");
      app.listen(port, () => {
        console.log(`Example app listening on port ${port}`);
      });
    })
    .catch((error) => {
      console.error("Failed to connect to MongoDB:", error);
    });
}

export default app;