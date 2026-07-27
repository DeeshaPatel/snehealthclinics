import pool from "../config/database.js";


export const findPatient = async(phone)=>{


const result =
await pool.query(

`
SELECT *
FROM patients
WHERE phone=$1
`,
[phone]

);


return result.rows[0];

};




export const createPatient = async(data)=>{


const result =
await pool.query(

`

INSERT INTO patients

(
first_name,
last_name,
dob,
phone,
email,
emergency_contact,
medications,
medical_history
)

VALUES
($1,$2,$3,$4,$5,$6,$7,$8)

RETURNING *

`,

[

data.firstName,

data.lastName,

data.dob,

data.phone,

data.email,

data.emergencyContact,

data.medications,

data.medicalHistory

]

);


return result.rows[0];


};