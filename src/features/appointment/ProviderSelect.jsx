import {useEffect,useState} from "react";

import {
getProviders
}
from "../../api/providerApi";



export default function ProviderSelect({

value,

onChange

}){


const [providers,setProviders]=useState([]);



useEffect(()=>{


loadProviders();


},[]);



const loadProviders=async()=>{


const data=await getProviders();


setProviders(data);


};



return (

<div>


<label>
Select Provider
</label>



<select

value={value}

onChange={(e)=>
onChange(e.target.value)
}

>


<option>
Choose Provider
</option>



{
providers.map(provider=>(


<option

key={provider.id}

value={provider.id}

>

{provider.first_name}

{" "}

{provider.last_name}


</option>


))
}


</select>


</div>

)

}