import pool from "../config/database.js";


export const createAppointment = async(data)=>{


const result =
await pool.query(

`
INSERT INTO appointments

(
patient_id,
provider_id,
service_id,
appointment_date,
appointment_time,
reason
)

VALUES($1,$2,$3,$4,$5,$6)

RETURNING *

`,

[
data.patient_id,
data.provider_id,
data.service_id,
data.date,
data.time,
data.reason
]

);


return result.rows[0];


};



export const getAppointments = async()=>{


const result =
await pool.query(

`
SELECT

a.*,

p.first_name,
p.last_name,

pr.first_name AS provider_first,
pr.last_name AS provider_last,

s.name AS service


FROM appointments a


JOIN patients p

ON a.patient_id=p.id


JOIN providers pr

ON a.provider_id=pr.id


JOIN services s

ON a.service_id=s.id

`

);


return result.rows;


};

export const checkAvailability =
async(provider,date,time)=>{


const result =
await pool.query(

`

SELECT *

FROM appointments

WHERE provider_id=$1

AND appointment_date=$2

AND appointment_time=$3

`,

[
provider,
date,
time
]

);


return result.rows.length===0;


};