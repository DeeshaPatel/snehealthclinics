export default function WhyChooseUs(){

    const reasons = [
        {
            title:"Experienced Healthcare Team",
            description:
            "Our dedicated healthcare professionals provide personalized and compassionate care."
        },
        {
            title:"Patient-Centered Care",
            description:
            "We focus on understanding each patient's needs and creating the right care plan."
        },
        {
            title:"Modern Healthcare Approach",
            description:
            "We use modern practices and technology to deliver efficient healthcare services."
        },
        {
            title:"Easy Appointment Scheduling",
            description:
            "Book appointments quickly through our convenient online appointment system."
        }
    ];
    
    
    return (
    
    <section className="why-section">
    
    
    <div className="section-header">
    
    <h2>
    Why Choose SNE Health Clinics?
    </h2>
    
    <p>
    Providing trusted healthcare services with compassion and excellence.
    </p>
    
    </div>
    
    
    
    <div className="why-grid">
    
    
    {
    reasons.map((item,index)=>(
    
    <div 
    className="why-card"
    key={index}
    >
    
    
    <div className="why-icon">
    ✓
    </div>
    
    
    <h3>
    {item.title}
    </h3>
    
    
    <p>
    {item.description}
    </p>
    
    
    </div>
    
    ))
    
    }
    
    
    </div>
    
    
    </section>
    
    );
    
    }