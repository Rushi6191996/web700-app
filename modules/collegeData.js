const Sequelize = require('sequelize');

// Database connection details
const database = decodeURIComponent('Seneca%20DB%20Instance');
const user = decodeURIComponent('Seneca%20DB%20Instance_owner');
const password = 'KfB2HvSjWdo8';
const host = 'ep-orange-wildflower-a5kmb5zy.us-east-2.aws.neon.tech';

// Initialize Sequelize
const sequelize = new Sequelize(database, user, password, {
    host: host,
    dialect: 'postgres',
    port: 5432,
    dialectOptions: {
        ssl: {
            require: true,
            rejectUnauthorized: false,
        },
    },
    query: { raw: true },
});

// Define Student Model
const Student = sequelize.define('Student', {
    studentNum: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    firstName: Sequelize.STRING,
    lastName: Sequelize.STRING,
    email: Sequelize.STRING,
    addressStreet: Sequelize.STRING,
    addressCity: Sequelize.STRING,
    addressProvince: Sequelize.STRING,
    TA: Sequelize.BOOLEAN,
    status: Sequelize.STRING,
});

// Define Course Model
const Course = sequelize.define('Course', {
    courseId: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    courseCode: Sequelize.STRING,
    courseDescription: Sequelize.STRING,
});

// Establish Relationship
Course.hasMany(Student, { foreignKey: 'course' });

// Initialize the database
function initialize() {
    return new Promise((resolve, reject) => {
        sequelize.sync()
            .then(() => {
                console.log("Database synchronized successfully.");
                resolve();
            })
            .catch((err) => {
                console.error("Unable to sync the database:", err);
                reject("Unable to sync the database: " + err);
            });
    });
}

// Retrieve all students
function getAllStudents() {
    return new Promise((resolve, reject) => {
        Student.findAll()
            .then((data) => resolve(data))
            .catch(() => reject("No results returned"));
    });
}

// Retrieve all TAs
function getTAs() {
    return new Promise((resolve, reject) => {
        Student.findAll({ where: { TA: true } })
            .then((data) => resolve(data))
            .catch(() => reject("No results returned"));
    });
}

// Retrieve all courses
function getCourses() {
    return new Promise((resolve, reject) => {
        Course.findAll()
            .then((data) => resolve(data))
            .catch(() => reject("No results returned"));
    });
}

// Retrieve students by course
function getStudentsByCourse(course) {
    return new Promise((resolve, reject) => {
        Student.findAll({ where: { course: course } })
            .then((data) => resolve(data))
            .catch(() => reject("No results returned"));
    });
}

// Retrieve a student by student number
function getStudentByNum(num) {
    return new Promise((resolve, reject) => {
        Student.findOne({ where: { studentNum: num } })
            .then((data) => {
                if (data) resolve(data);
                else reject("No results returned");
            })
            .catch(() => reject("No results returned"));
    });
}

// Add a new student
function addStudent(studentData) {
    studentData.TA = studentData.TA ? true : false;
    for (let key in studentData) {
        if (studentData[key] === "") studentData[key] = null;
    }

    return new Promise((resolve, reject) => {
        Student.create(studentData)
            .then(() => resolve())
            .catch(() => reject("Unable to create student"));
    });
}

// Update a student's data
function updateStudent(studentData) {
    studentData.TA = studentData.TA ? true : false;
    for (let key in studentData) {
        if (studentData[key] === "") studentData[key] = null;
    }

    return new Promise((resolve, reject) => {
        Student.update(studentData, { where: { studentNum: studentData.studentNum } })
            .then(() => resolve())
            .catch(() => reject("Unable to update student"));
    });
}

// Add a new course
function addCourse(courseData) {
    for (let key in courseData) {
        if (courseData[key] === "") courseData[key] = null;
    }

    return new Promise((resolve, reject) => {
        Course.create(courseData)
            .then(() => resolve())
            .catch(() => reject("Unable to create course"));
    });
}

// Update a course
function updateCourse(courseData) {
    for (let key in courseData) {
        if (courseData[key] === "") courseData[key] = null;
    }

    return new Promise((resolve, reject) => {
        Course.update(courseData, { where: { courseId: courseData.courseId } })
            .then(() => resolve())
            .catch(() => reject("Unable to update course"));
    });
}

// Delete a course by ID
function deleteCourseById(id) {
    return new Promise((resolve, reject) => {
        Course.destroy({ where: { courseId: id } })
            .then(() => resolve())
            .catch(() => reject("Unable to delete course"));
    });
}

// Delete a student by student number
function deleteStudentByNum(num) {
    return new Promise((resolve, reject) => {
        Student.destroy({ where: { studentNum: num } })
            .then(() => resolve())
            .catch(() => reject("Unable to delete student"));
    });
}

// Export functions for server.js
module.exports = {
    initialize,
    getAllStudents,
    getTAs,
    getCourses,
    getStudentsByCourse,
    getStudentByNum,
    addStudent,
    updateStudent,
    addCourse,
    updateCourse,
    deleteCourseById,
    deleteStudentByNum,
};
