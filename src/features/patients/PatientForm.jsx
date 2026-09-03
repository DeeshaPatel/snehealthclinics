import { useEffect, useState } from "react";

import {
    X,
    UserRound
} from "lucide-react";


export default function PatientForm({
    patient,
    onClose,
    onSave
}) {

    const [form, setForm] = useState({

        first_name: "",
        last_name: "",
        date_of_birth: "",
        health_card: "",
        phone: "",
        emergency_contact: "",
        medications: "",
        medical_history: ""

    });


    const [saving, setSaving] =
        useState(false);


    const [error, setError] =
        useState("");


    useEffect(() => {

        if (patient) {

            setForm({

                first_name:
                    patient.first_name || "",

                last_name:
                    patient.last_name || "",

                date_of_birth:
                    patient.date_of_birth
                        ? patient.date_of_birth
                            .substring(0, 10)
                        : "",

                health_card:
                    patient.health_card || "",

                phone:
                    patient.phone || "",

                emergency_contact:
                    patient.emergency_contact || "",

                medications:
                    patient.medications || "",

                medical_history:
                    patient.medical_history || ""

            });

        }

    }, [patient]);


    const handleChange = (
        event
    ) => {

        const {
            name,
            value
        } = event.target;


        setForm((current) => ({

            ...current,

            [name]: value

        }));

    };


    const handleSubmit = async (
        event
    ) => {

        event.preventDefault();

        setError("");

        setSaving(true);


        try {

            await onSave(form);

        } catch (error) {

            console.error(
                error
            );

            setError(
                error.response?.data?.message ||
                "Unable to save patient."
            );

        } finally {

            setSaving(false);

        }

    };


    return (

        <div className="modal-backdrop">

            <div className="patient-modal">

                {/* HEADER */}

                <div className="modal-header">

                    <div>

                        <div className="modal-title-icon">

                            <UserRound
                                size={20}
                            />

                        </div>

                        <div>

                            <h2>

                                {patient
                                    ? "Edit Patient"
                                    : "Add Patient"}

                            </h2>

                            <p>
                                {patient
                                    ? "Update patient information"
                                    : "Create a new patient record"}
                            </p>

                        </div>

                    </div>


                    <button
                        className="modal-close"
                        onClick={onClose}
                    >

                        <X size={20} />

                    </button>

                </div>


                {/* FORM */}

                <form
                    className="patient-form"
                    onSubmit={handleSubmit}
                >

                    <div className="form-section">

                        <h3>
                            Personal Information
                        </h3>


                        <div className="form-grid">

                            <div className="form-field">

                                <label>
                                    First Name *
                                </label>

                                <input
                                    name="first_name"
                                    value={
                                        form.first_name
                                    }
                                    onChange={
                                        handleChange
                                    }
                                    required
                                />

                            </div>


                            <div className="form-field">

                                <label>
                                    Last Name *
                                </label>

                                <input
                                    name="last_name"
                                    value={
                                        form.last_name
                                    }
                                    onChange={
                                        handleChange
                                    }
                                    required
                                />

                            </div>


                            <div className="form-field">

                                <label>
                                    Date of Birth
                                </label>

                                <input
                                    type="date"
                                    name="date_of_birth"
                                    value={
                                        form.date_of_birth
                                    }
                                    onChange={
                                        handleChange
                                    }
                                />

                            </div>


                            <div className="form-field">

                                <label>
                                    Health Card
                                </label>

                                <input
                                    name="health_card"
                                    value={
                                        form.health_card
                                    }
                                    onChange={
                                        handleChange
                                    }
                                    placeholder="Health card number"
                                />

                            </div>


                            <div className="form-field">

                                <label>
                                    Phone
                                </label>

                                <input
                                    name="phone"
                                    value={
                                        form.phone
                                    }
                                    onChange={
                                        handleChange
                                    }
                                    placeholder="(555) 123-4567"
                                />

                            </div>


                            <div className="form-field">

                                <label>
                                    Emergency Contact
                                </label>

                                <input
                                    name="emergency_contact"
                                    value={
                                        form.emergency_contact
                                    }
                                    onChange={
                                        handleChange
                                    }
                                    placeholder="Name and phone"
                                />

                            </div>

                        </div>

                    </div>


                    <div className="form-section">

                        <h3>
                            Medical Information
                        </h3>


                        <div className="form-field">

                            <label>
                                Medications
                            </label>

                            <textarea
                                name="medications"
                                value={
                                    form.medications
                                }
                                onChange={
                                    handleChange
                                }
                                rows="3"
                                placeholder="Current medications..."
                            />

                        </div>


                        <div className="form-field">

                            <label>
                                Medical History
                            </label>

                            <textarea
                                name="medical_history"
                                value={
                                    form.medical_history
                                }
                                onChange={
                                    handleChange
                                }
                                rows="4"
                                placeholder="Relevant medical history..."
                            />

                        </div>

                    </div>


                    {error && (

                        <div className="form-error">
                            {error}
                        </div>

                    )}


                    {/* FOOTER */}

                    <div className="modal-footer">

                        <button
                            type="button"
                            className="secondary-button"
                            onClick={onClose}
                        >
                            Cancel
                        </button>


                        <button
                            type="submit"
                            className="primary-button"
                            disabled={saving}
                        >

                            {saving
                                ? "Saving..."
                                : patient
                                    ? "Save Changes"
                                    : "Add Patient"
                            }

                        </button>

                    </div>

                </form>

            </div>

        </div>

    );

}