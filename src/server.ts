import express from "express";
import Database from "better-sqlite3";
import cors from "cors";

const db = Database("./db/data.db", { verbose: console.log });
const app = express();

app.use(cors());
app.use(express.json());

const port = 4444;



const getApplicantsForInterviewer = db.prepare(`
SELECT applicants.* FROM applicants
JOIN interviews ON applicants.id = interviews.applicantId
WHERE interviews.interviewerId = @interviewerId;
`);

const getInterviewerForApplicants = db.prepare(`
SELECT  interviewers.* FROM  interviewers
JOIN interviews ON interviewers.id = interviews.interviewerId
WHERE interviews.applicantId = @applicantId;
`);

const interviewers = db.prepare(`
 SELECT * FROM interviewers 
`);

const interviewer = db.prepare(`
 SELECT * FROM interviewers WHERE id=@id
`);

const applicants = db.prepare(`
 SELECT * FROM applicants 
`);

const applicant = db.prepare(`
 SELECT * FROM applicants WHERE id=@id
`);

const createApplicant = db.prepare(`
INSERT INTO applicants(name,email) VALUES (@name,@email)
`);

const deleteApplicant = db.prepare(`
DELETE FROM applicants WHERE id=@id
`);

const company=db.prepare(`
SELECT * FROM companies WHERE id=@id
`)

const getCompanies=db.prepare(`
SELECT * FROM companies 
`)

const createCompany = db.prepare(`
INSERT INTO companies  (name,city) VALUES (@name,@city)
`);

const employers=db.prepare(`
SELECT * FROM employees 
`)

const employer=db.prepare(`
SELECT * FROM employees WHERE name=@name
`)
const createEmploye=db.prepare(`
INSERT INTO employees(name,email,position,companyId) VALUES(@name,@email,@position,@companyId)
`)

const getinterviews=db.prepare(`
SELECT * FROM interviews 
`)
const getinterview=db.prepare(`
SELECT * FROM interviews WHERE id=@id
`)

const updateInterview = db.prepare(`
UPDATE interviews
SET interviewerId=@interviewerId, applicantId=@applicantId,companyId=@companyId, result=@result	
WHERE id=@id;
`);

const cerateInterview = db.prepare(`
  INSERT INTO interviews(interviewerId,applicantId,companyId,result)VALUES(@interviewerId,@applicantId,@companyId,@result)
  `);

const createInterviewer = db.prepare(`
INSERT INTO interviewers(name,email,companyId) VALUES (@name,@email,@companyId)
`);


app.get("/applicants", (req, res) => {
    const allApplicants = applicants.all();
    for (let applicant of allApplicants) {
      const applicantInterviewer = getInterviewerForApplicants.all({
        applicantId: applicant.id,
      });
      applicant.interviewer = applicantInterviewer;
    }
    res.send(allApplicants);
  });

app.get("/applicants/:id", (req, res) => {
    const singleApplicant = applicant.get(req.params);
    if (singleApplicant) {
      const applicantInterviewer = getInterviewerForApplicants.all({
        applicantId: req.params.id,
      });
      singleApplicant.interviewer = applicantInterviewer;
      res.send(singleApplicant);
    } else res.status(404).send({ error: "Applicant not found" });
  });

app.get("/interviewers", (req, res) => {
    const allInterviewers = interviewers.all();
    for (let interviewer of allInterviewers) {
      const interviewerApplicants = getApplicantsForInterviewer.all({
        interviewerId: interviewer.id,
      });
      interviewer.applicants = interviewerApplicants;
    }
    res.send(allInterviewers);
  });
  
app.get("/interviewers/:id", (req, res) => {
    const singleInterviewer = interviewer.get(req.params);
    if (singleInterviewer) {
      const interviewerApplicants = getApplicantsForInterviewer.all({
        interviewerId: req.params.id,
      });
      singleInterviewer.applicants = interviewerApplicants;
      res.send(singleInterviewer);
    } else res.status(404).send({ error: "Interviewer not found" });
  });
 
app.post("/applicants", (req, res) => {
  let errors: String[] = [];
  if (typeof req.body.name !== "string")
    errors.push(`Name not provided or not a string`);
  if (typeof req.body.email !== "string")
    errors.push(`Email not provided or not a string`);

  if (errors.length === 0) {
    const info = createApplicant.run(req.body);
    const newApplicant = applicant.get({ id: info.lastInsertRowid });
    const applicantInterviewer = getInterviewerForApplicants.all({
      applicantId: info.lastInsertRowid,
    });
    newApplicant.interviewer = applicantInterviewer;
    res.send(newApplicant);
  } else res.status(400).send(errors);
});

app.post("/interviewers", (req, res) => {
  let errors: String[] = [];
  if (typeof req.body.name !== "string")
    errors.push(`Name not provided or not a string`);
  if (typeof req.body.email !== "string")
    errors.push(`Email not provided or not a string`);
    if (typeof req.body.companyId !== "number")
    errors.push(`Compnay Id  not provided or not a string`);

  if (errors.length === 0) {
    const findCompany=company.get({id:req.body.companyId})
    const findEmpolyer=employer.get({name:req.body.name})
    if(findEmpolyer){
        if(findCompany){
            const info = createInterviewer.run(req.body);
            const newInterviewer = interviewer.get({ id: info.lastInsertRowid });
            const interviewerApplicants = getApplicantsForInterviewer.all({
              interviewerId: info.lastInsertRowid,
            });
            newInterviewer.applicants = interviewerApplicants;
            res.send(newInterviewer);
        }
        else res.status(404).send({error:"Company not found"})
    }
    else res.status(404).send({error:"This person is not employed in any company"})
    
  } else res.status(400).send(errors);
});

app.get("/interviews",(req,res)=>{
    const interviews=getinterviews.all()
    res.send(interviews)
})

app.get("/interviews/:id",(req,res)=>{
    const interview=getinterview.get(req.params)
    if(interview) res.send(interview)
    else res.status(404).send({error:"Interview not found"})
})

app.post("/interviews", (req, res) => {
  let errors: String[] = [];
  if (typeof req.body.applicantId !== "number")
    errors.push(`Applicant ID not provided or not a number`);
  if (typeof req.body.interviewerId !== "number")
    errors.push(`Interviewer ID not provided or not a number`);
    if (typeof req.body.companyId !== "number")
    errors.push(`Company ID not provided or not a number`);
    if (typeof req.body.result !== "number")
    errors.push(`Result not provided or not a number`);

  if (errors.length === 0) {
    const findApplicant = applicant.get({ id: req.body.applicantId });
    const findInterviewer = interviewer.get({ id: req.body.interviewerId });
    if (findApplicant !== undefined) {
      if (findInterviewer !== undefined) {
        cerateInterview.run(req.body);
        const respons = {
          applicant: findApplicant,
          interviewer: findInterviewer,
        };
        res.send(respons);
      } else
        res.status(404).send({
          error:
            "Interviewer does not exists. The applicant was successfully found ",
        });
    } else res.status(404).send({ error: "Applicant does not exists " });
  } else res.status(400).send(errors);
});


app.get("/companies",(req,res)=>{
    const companies=getCompanies.all()
    res.send(companies)
})

app.post("/companies",(req,res)=>{
    let errors: String[] = [];
  if (typeof req.body.name !== "string")
    errors.push(`Name not provided or not a string`);
  if (typeof req.body.city !== "string")
    errors.push(`City not provided or not a string`);

  if (errors.length === 0) {
    const info = createCompany.run(req.body);
    const newCompany = company.get({ id: info.lastInsertRowid });
    res.send(newCompany);
  } else res.status(400).send(errors);

})

app.delete("/applicants/:id", (req, res) => {
  const info = deleteApplicant.run(req.params);
  if (info.changes) res.send({ messsage: "Applicant deleted succesfuly" });
  else res.status(404).send({ error: "Applicant not found" });
});

app.get("/employees",(req,res)=>{
    const allemployers=employers.all()
    res.send(allemployers)
})

app.patch("/interviews/:id", (req, res) => {
  const findInterview = getinterview.get(req.params);
  if (findInterview) {
    const findApplicant=applicant.get({id: findInterview.applicantId})
     const updatedInterview = { ...findInterview, ...req.body };
        if(req.body.result===1){
            app.post("/employees",(req,res)=>{
             const newemployer={...findApplicant,"position":"Frontend developer","companyId":findInterview.companyId}
             createEmploye.run(newemployer)
             res.send(newemployer)
            })
        }
        else{
            updateInterview.run(updatedInterview);
            res.send(updatedInterview);
        }

    
  } else res.status(404).send({ error: "Interview not found" });
});


app.listen(port, () => {
    console.log(`Server is running on: http://localhost:${port}/applicants`);
  });
  