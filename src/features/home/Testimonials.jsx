const reviews = [

    {
        text:
        "The staff at SNE Health Clinics made my healthcare experience comfortable and stress-free. Everyone was friendly, professional, and took the time to listen to my concerns. I truly appreciate the personalized care I received.",
        name:"John Smith"
    },

    {
        text:
        "Booking my appointment was quick and simple. The clinic team was very helpful, and the doctor provided clear explanations and guidance throughout my visit. I felt respected and well cared for.",
        name:"Emily Johnson"
    },

    {
        text:
        "I am very happy with the quality of care provided at SNE Health Clinics. The healthcare professionals are knowledgeable, compassionate, and genuinely focused on improving their patients' health and wellbeing.",
        name:"Sarah Williams"
    },

    {
        text:
        "From scheduling my appointment to the follow-up care, the entire process was smooth and convenient. The team created a welcoming environment and made sure all my questions were answered.",
        name:"Michael Brown"
    },

    {
        text:
        "SNE Health Clinics provides excellent healthcare services with a personal touch. The staff is caring, the facilities are comfortable, and I always feel confident knowing I am receiving great care.",
        name:"David Wilson"
    },

    {
        text:
        "I appreciate how much attention the team gives to each patient. They take the time to understand individual needs and provide recommendations that are practical and easy to follow.",
        name:"Lisa Anderson"
    }

];


export default function Testimonials(){


return (

<section className="testimonials-section">


<div className="section-header">

<h2>
Patient Testimonials
</h2>

<p>
Hear what our patients say about their experience with SNE Health Clinics.
</p>

</div>



<div className="testimonials-grid">


{
reviews.map(review=>(


<div 
className="testimonial-card"
key={review.name}
>


<p className="testimonial-text">

"{review.text}"

</p>


<h4>

- {review.name}

</h4>


</div>


))
}


</div>


</section>

)

}