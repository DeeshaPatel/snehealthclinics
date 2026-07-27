import Card from "../../shared/components/Card";


export default function ServiceDetails({

service

}){


if(!service){

return null;

}


return (

<Card className="service-details">


<h2>

{service.title}

</h2>


<p>

{service.description}

</p>



<h3>

Services Include:

</h3>


<ul>

{
service.details.map(item=>(

<li key={item}>

✓ {item}

</li>

))
}


</ul>


</Card>

)

}