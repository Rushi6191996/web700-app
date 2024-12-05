const fs = require('fs');

class Data {
    constructor(students, courses) {
        this.students = students;
        this.courses = courses;
    }
}

let dataCollection = null;

function initialize() {
    return new Promise((resolve, reject) => {
        // Reading the students.json file
        fs.readFile('./data/students.json', 'utf8', (err, studentsData) => {
            if (err) {
                reject("unable to read students.json");
                return;
            }
            // Reading the courses.json file
            fs.readFile('./data/courses.json', 'utf8', (err, coursesData) => {
                if (err) {
                    reject("unable to read courses.json");
                    return;
                }
                // Parsing the JSON data
                let students = JSON.parse(studentsData);
                let courses = JSON.parse(coursesData);
                dataCollection = new Data(students, courses);
                resolve();
            });
        });
    });
}

function getAllStudents() {
    return new Promise((resolve, reject) => {
        if (dataCollection.students.length > 0) {
            resolve(dataCollection.students);
        } else {
            reject("no results returned");
        }
    });
}

function getTAs() {
    return new Promise((resolve, reject) => {
        const TAs = dataCollection.students.filter(student => student.TA);
        if (TAs.length > 0) {
            resolve(TAs);
        } else {
            reject("no results returned");
        }
    });
}

function getCourses() {
    return new Promise((resolve, reject) => {
        if (dataCollection.courses.length > 0) {
            resolve(dataCollection.courses);
        } else {
            reject("no results returned");
        }
    });
}

function getStudentsByCourse(course) {
    return new Promise((resolve, reject) => {
        let filteredStudents = dataCollection.students.filter(student => student.course == course);
        if (filteredStudents.length > 0) {
            resolve(filteredStudents);
        } else {
            reject("no results returned");
        }
    });
}

function getStudentByNum(num) {
    return new Promise((resolve, reject) => {
        let foundStudent = dataCollection.students.find(student => student.studentNum == num);
        if (foundStudent) {
            resolve(foundStudent);
        } else {
            reject("no results returned");
        }
    });
}

function addStudent(studentData) {
    return new Promise((resolve, reject) => {
        // Set TA property to false if undefined, otherwise true
        studentData.TA = studentData.TA ? true : false;

        // Set studentNum to be the next available number
        studentData.studentNum = dataCollection.students.length + 1;

        // Add the studentData to the students array
        dataCollection.students.push(studentData);

        // Resolve the promise
        resolve();
    })};

// Exporting functions so they can be used in server.js
module.exports = {
    initialize,
    getAllStudents,
    getTAs,
    getCourses,
    getStudentsByCourse,
    getStudentByNum,
    addStudent
};
