"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const mongodb_1 = require("mongodb");
require('dotenv').config();
const app = (0, express_1.default)();
const port = 5000;
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.get('/', (req, res) => {
    res.send('Hello Worrrrld!');
});
const uri = process.env.MONGODB_URI;
// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new mongodb_1.MongoClient(uri, {
    serverApi: {
        version: mongodb_1.ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});
async function run() {
    try {
        // Connect the client to the server	(optional starting in v4.7)
        await client.connect();
        // Send a ping to confirm a successful connection
        await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
        // Seed database with mock courses if empty
        const db = client.db("scholar_stack");
        const coursesCollection = db.collection("courses");
        const count = await coursesCollection.countDocuments();
        if (count === 0) {
            const mockCourses = [
                {
                    title: "Complete Web Development Bootcamp 2026",
                    instructor: "Dr. Angela Yu",
                    description: "Learn web development by building 100 projects in 100 days. Covers HTML, CSS, Javascript, React, Node, and more.",
                    price: 89.99,
                    category: "Development",
                    image: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?q=80&w=600&auto=format&fit=crop",
                    rating: 4.8,
                    reviewCount: 4523,
                    duration: "65 hours",
                    studentsCount: 125000,
                    createdAt: new Date(),
                    updatedAt: new Date()
                },
                {
                    title: "Advanced UI/UX Design Masterclass",
                    instructor: "Gary Simon",
                    description: "Master Figma, user research, wireframing, and prototyping. Build a portfolio that gets you hired.",
                    price: 69.99,
                    category: "Design",
                    image: "https://images.unsplash.com/photo-1561070791-2526d30994b5?q=80&w=600&auto=format&fit=crop",
                    rating: 4.9,
                    reviewCount: 2150,
                    duration: "24 hours",
                    studentsCount: 45000,
                    createdAt: new Date(),
                    updatedAt: new Date()
                },
                {
                    title: "Data Science and Machine Learning",
                    instructor: "Jose Portilla",
                    description: "Learn Python, Pandas, NumPy, Scikit-Learn, and TensorFlow to build real-world AI applications.",
                    price: 94.99,
                    category: "Data Science",
                    image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=600&auto=format&fit=crop",
                    rating: 4.7,
                    reviewCount: 8900,
                    duration: "42 hours",
                    studentsCount: 210000,
                    createdAt: new Date(),
                    updatedAt: new Date()
                },
                {
                    title: "Digital Marketing Complete Course",
                    instructor: "Seth Godin",
                    description: "SEO, Social Media Marketing, Copywriting, Email Marketing, and Analytics in one comprehensive bundle.",
                    price: 54.99,
                    category: "Business",
                    image: "https://images.unsplash.com/photo-1432888498266-38ffec3eaf0a?q=80&w=600&auto=format&fit=crop",
                    rating: 4.6,
                    reviewCount: 3200,
                    duration: "18 hours",
                    studentsCount: 85000,
                    createdAt: new Date(),
                    updatedAt: new Date()
                },
                {
                    title: "Next.js 15 Premium Course",
                    instructor: "Hitesh Choudhary",
                    description: "Learn Next.js 15 App Router, Server Actions, Server Components, Route Handlers, and Authentication.",
                    price: 79.99,
                    category: "Development",
                    image: "https://images.unsplash.com/photo-1618401471353-b98aedd07871?q=80&w=600&auto=format&fit=crop",
                    rating: 4.8,
                    reviewCount: 1540,
                    duration: "30 hours",
                    studentsCount: 28000,
                    createdAt: new Date(),
                    updatedAt: new Date()
                },
                {
                    title: "Graphic Design Masterclass",
                    instructor: "Lindsay Marsh",
                    description: "Learn Photoshop, Illustrator, and InDesign. Discover graphic design theory, branding, and logo design.",
                    price: 49.99,
                    category: "Design",
                    image: "https://images.unsplash.com/photo-1626785774573-4b799315345d?q=80&w=600&auto=format&fit=crop",
                    rating: 4.7,
                    reviewCount: 950,
                    duration: "28 hours",
                    studentsCount: 12000,
                    createdAt: new Date(),
                    updatedAt: new Date()
                },
                {
                    title: "Python for Artificial Intelligence",
                    instructor: "Andrej Karpathy",
                    description: "Deep dive into neural networks, PyTorch, backpropagation, and build your own GPT from scratch.",
                    price: 119.99,
                    category: "Data Science",
                    image: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?q=80&w=600&auto=format&fit=crop",
                    rating: 4.9,
                    reviewCount: 18900,
                    duration: "55 hours",
                    studentsCount: 95000,
                    createdAt: new Date(),
                    updatedAt: new Date()
                },
                {
                    title: "Financial Analysis & Modeling",
                    instructor: "Bill Gates",
                    description: "Learn Excel, accounting, financial statements, forecasting, and investment analysis with case studies.",
                    price: 64.99,
                    category: "Business",
                    image: "https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?q=80&w=600&auto=format&fit=crop",
                    rating: 4.5,
                    reviewCount: 1100,
                    duration: "20 hours",
                    studentsCount: 9800,
                    createdAt: new Date(),
                    updatedAt: new Date()
                }
            ];
            await coursesCollection.insertMany(mockCourses);
            console.log("Database seeded with 8 mock courses successfully.");
        }
    }
    finally {
        // Ensures that the client will close when you finish/error
        // await client.close();
    }
}
run().catch(console.dir);
app.post('/users/update-profile', async (req, res) => {
    try {
        const { email, name, image, role, location, coverPhoto, phoneNumber } = req.body;
        if (!email) {
            return res.status(400).json({ error: 'Email is required' });
        }
        const db = client.db('scholar_stack');
        const userCollection = db.collection('user');
        const result = await userCollection.updateOne({ email: email }, {
            $set: {
                name,
                image,
                role,
                location,
                coverPhoto,
                phoneNumber,
                updatedAt: new Date()
            }
        });
        if (result.matchedCount === 0) {
            return res.status(404).json({ error: 'User not found' });
        }
        return res.status(200).json({ success: true, message: 'Profile updated successfully' });
    }
    catch (error) {
        return res.status(500).json({ error: error.message || 'Internal Server Error' });
    }
});
app.post('/courses/add', async (req, res) => {
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
    }
    catch (error) {
        return res.status(500).json({ error: error.message || 'Internal Server Error' });
    }
});
app.get('/courses', async (req, res) => {
    try {
        const db = client.db('scholar_stack');
        const coursesCollection = db.collection('courses');
        const courses = await coursesCollection.find({}).toArray();
        return res.status(200).json(courses);
    }
    catch (error) {
        return res.status(500).json({ error: error.message || 'Internal Server Error' });
    }
});
app.get('/courses/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const db = client.db('scholar_stack');
        const coursesCollection = db.collection('courses');
        let course;
        if (mongodb_1.ObjectId.isValid(id)) {
            course = await coursesCollection.findOne({ _id: new mongodb_1.ObjectId(id) });
        }
        if (!course) {
            return res.status(404).json({ error: 'Course not found' });
        }
        return res.status(200).json(course);
    }
    catch (error) {
        return res.status(500).json({ error: error.message || 'Internal Server Error' });
    }
});
app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
});
