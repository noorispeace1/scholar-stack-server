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
const port = Number(process.env.PORT) || 5000;
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
        const id = req.params.id;
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
if (require.main === module) {
    app.listen(port, () => {
        console.log(`Example app listening on port ${port}`);
    });
}
exports.default = app;
