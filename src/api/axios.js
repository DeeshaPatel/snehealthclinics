import axios from "axios";


const API = axios.create({

baseURL:"https://api.backend.snehealth.ca/api",

headers:{

"Content-Type":"application/json"

}

});



export default API;