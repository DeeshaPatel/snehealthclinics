import { Link } from "react-router-dom";
import {
    Stethoscope,
    HeartPulse,
    ShieldCheck,
    CalendarCheck
} from "lucide-react";

const team = [
    {
        name: "Dr. Airhumwunde, Osamagbe Walter",
        role: "Medical Director",
        credentials: "Family Physician",
        description:
            "Dr. Osamagbe Walter Airhumwunde leads SNE Health Clinic with a commitment to providing compassionate, accessible, and patient-centered healthcare for individuals and families.",
        specialties: [
            "Family Medicine",
            "Preventive Care",
            "Walk-in Clinic Services"
        ]
    },
    {
        name: "Dr. Pir Shah",
        role: "Family Physician",
        credentials: "Family Physician",
        description:
            "Dr. Pir Shah provides compassionate and patient-centered care to individuals and families. He speaks English, Punjabi, Urdu, and Hindi, helping patients feel comfortable and understood throughout their care.",
        specialties: [
            "Family Medicine"
        ]
    }
];

export default function Team() {
    return (
        <section className="team">

            <div className="section-heading">

                <h2>
                    Meet Our Medical Team
                </h2>

                <p>
                    Experienced healthcare professionals dedicated to your wellness.
                </p>

            </div>

            <div className="doctor-profiles">

                {team.map((doctor) => (

                    <div
                        className="doctor-profile"
                        key={doctor.name}
                    >

                        {/* Avatar */}
                        <div className="doctor-avatar">

                            <span>
                                Dr
                            </span>

                        </div>

                        <div className="doctor-info">

                            <h3>
                                {doctor.name}
                            </h3>

                            <h4>
                                {doctor.role}
                            </h4>

                            <p className="credentials">
                                {doctor.credentials}
                            </p>

                            <p className="doctor-description">
                                {doctor.description}
                            </p>

                            <div className="specialties">

                                {doctor.specialties.map((item) => (

                                    <div
                                        key={item}
                                        className="specialty"
                                    >

                                        <Stethoscope size={18} />

                                        {item}

                                    </div>

                                ))}

                            </div>

                            <div className="doctor-highlights">

                                <div>
                                    <HeartPulse />

                                    <span>
                                        Patient-Centered Care
                                    </span>
                                </div>

                                <div>
                                    <ShieldCheck />

                                    <span>
                                        Trusted Healthcare
                                    </span>
                                </div>

                                <div>
                                    <CalendarCheck />

                                    <span>
                                        Accepting Patients
                                    </span>
                                </div>

                            </div>
                            
                            <a
                                href="https://patient.medeohealth.com/booking/sne-health-clinics"
                                className="doctor-button"
                            >
                                Book Appointment
                            </a>
                        </div>

                    </div>

                ))}

            </div>

        </section>
    );
}