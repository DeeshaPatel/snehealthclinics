import axios from "axios";


const API = axios.create({

baseURL:"/internal/api",

headers:{

"Content-Type":"application/json"

}

});



export default API;