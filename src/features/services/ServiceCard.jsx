import Card from "../../shared/components/Card";
import Button from "../../shared/components/Button";


export default function ServiceCard({

service,
onSelect

}){


return (

<Card className="service-card">


<div className="service-icon">

{service.icon}

</div>


<h3>

{service.title}

</h3>


<p>

{service.description}

</p>



<Button

onClick={()=>onSelect(service)}

>

Learn More

</Button>


</Card>

)

}