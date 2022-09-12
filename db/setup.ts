import Database from "better-sqlite3";

const db = Database("./db/data.db", { verbose: console.log });


const applicants = [
    {
      name: "Luke Ryan",
      email: "luke@gmail.com",
    },
    {
      name: "Abdul Ryan",
      email: "abdul@gmail.com",
    },
    {
      name: "Eric Phillips",
      email: "eric@gmail.com",
    },
    {
      name: "Marco Phillips",
      email: "marco@gmail.com",
    },
    {
      name: "Oskar Phillips",
      email: "oskar@gmail.com",
    },
  ];
  
  const interviewers = [
    {
      name: "Thomas Black",
      email: "thomas@gmail.com",
      companyId:1
    },
    {
      name: "Bryan Powell",
      email: "brayan@gmail.com",
      companyId:3
    },
    {
      name: "Saif Powell",
      email: "saif@gmail.com",
      companyId:2
    },
  ];
  
  const interviews = [
    {
      applicantId: 1,
      interviewerId: 1,
      result:0,
      companyId:1
    },
    {
      applicantId: 3,
      interviewerId: 1,
      result:0,
      companyId:1
    },
    {
      applicantId: 2,
      interviewerId: 2,
      result:0,
      companyId:2
    },
    {
      applicantId: 4,
      interviewerId: 2,
      result:0,
      companyId:2
    },
    {
      applicantId: 5,
      interviewerId: 3,
      result:0,
      companyId:3
    },
  ];

  const companies=[
    {
        name:"Aline",
        city:"Berlin"
    },
    {
        name:"Acast",
        city:"London"
    },
    {
        name:"Aset",
        city:"London"
    },
  ]

  const employees=[
    {
        name:"Thomas Black",
        email:"thomas@gmail.com",
        position:"Frontend developer",
        companyId:1,
    },
    {
        name:"Bryan Powell",
        email:"brayan@gmail.com",
        position:"Frontend developer",
        companyId:3,
    },
    {
        name: "Saif Powell",
        email: "saif@gmail.com",
        position:"Frontend developer",
        companyId:2,
      },
    {
        name: "James Doe",
        email: "james@gmail.com",
        position:"Backend developer",
        companyId:2,
      },
    {
        name: "John Poe",
        email: "john@gmail.com",
        position:"Frontend developer",
        companyId:3,
      },
    {
        name: "Elena Cruz",
        email: "elena@gmail.com",
        position:"Frontend developer",
        companyId:1,
      }
  ]
db.exec(`
CREATE TABLE applicants (
    id integer PRIMARY KEY,
    name text,
    email text
  );
  
  
  CREATE TABLE interviewers (
    id integer PRIMARY KEY,
    name text,
    email text,
    companyId integer,
    FOREIGN KEY (companyId) REFERENCES companies (id)
  );
  
  
  CREATE TABLE interviews (
    id integer PRIMARY KEY,
    interviewerId integer,
    applicantId integer,
    companyId integer,
    result integer,
    FOREIGN KEY (applicantId) REFERENCES applicants (id),
    FOREIGN KEY (interviewerId) REFERENCES interviewers (id),
    FOREIGN KEY (companyId) REFERENCES companies (id)
  );
  
  
  CREATE TABLE companies (
    id integer PRIMARY KEY,
    name text,
    city text
  );
  
  
  CREATE TABLE employees (
    id integer PRIMARY KEY,
    name text,
    email text,
    position text,
    companyId integer,
    FOREIGN KEY (companyid) REFERENCES companies (id)
  );
  
`)
const createApplicant = db.prepare(`
INSERT INTO applicants (name,email) VALUES (@name,@email)
`);

for (let applicant of applicants) createApplicant.run(applicant);

const createCompany = db.prepare(`
INSERT INTO companies  (name,city) VALUES (@name,@city)
`);

for (let company of companies) createCompany.run(company);

const createInterviewer = db.prepare(`
INSERT INTO interviewers (name,email,companyId) VALUES (@name,@email,@companyId)
`);


for (let interviewer of interviewers) createInterviewer.run(interviewer);

const createInterview = db.prepare(`
INSERT INTO interviews (interviewerId,applicantId,companyId,result) VALUES (@interviewerId,@applicantId,@companyId,@result)
`);

for (let interview of interviews) createInterview.run(interview);

const createEmploye = db.prepare(`
INSERT INTO employees  (name,email,position,companyId) VALUES (@name,@email,@position,@companyId)
`);

for (let employe of employees) createEmploye.run(employe);





