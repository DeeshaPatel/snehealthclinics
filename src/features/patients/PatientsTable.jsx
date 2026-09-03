import {
    Edit3,
    Trash2,
    Eye
} from "lucide-react";


export default function PatientTable({
    patients,
    loading,
    onEdit,
    onDelete,
    onView
}) {


    if (loading) {

        return (

            <div className="patients-table-card">

                <div className="table-loading">

                    Loading patients...

                </div>

            </div>

        );

    }


    return (

        <div className="patients-table-card">

            <div className="patients-table-wrapper">

                <table className="patients-table">

                    <thead>

                        <tr>

                            <th>
                                Patient
                            </th>

                            <th>
                                Date of Birth
                            </th>

                            <th>
                                Phone
                            </th>

                            <th>
                                Health Card
                            </th>

                            <th>
                                Added
                            </th>

                            <th>
                                Actions
                            </th>

                        </tr>

                    </thead>


                    <tbody>

                        {patients.length === 0 ? (

                            <tr>

                                <td
                                    colSpan="6"
                                    className="empty-table"
                                >

                                    No patients found.

                                </td>

                            </tr>

                        ) : (

                            patients.map(
                                (patient) => (

                                    <tr
                                        key={
                                            patient.id
                                        }
                                    >

                                        {/* Patient */}

                                        <td>

                                            <div className="patient-cell">

                                                <div className="patient-avatar">

                                                    {patient.first_name
                                                        .charAt(0)}

                                                    {patient.last_name
                                                        .charAt(0)}

                                                </div>


                                                <div>

                                                    <strong
                                                        className="clickable-patient-name"
                                                        onClick={() => onView(patient)}
                                                    >
                                                        {patient.first_name} {patient.last_name}
                                                    </strong>
                                                    <span>
                                                        Patient #{patient.id}
                                                    </span>

                                                </div>

                                            </div>

                                        </td>


                                        {/* DOB */}

                                        <td>

                                            {patient.date_of_birth
                                                ? new Date(
                                                    patient.date_of_birth
                                                ).toLocaleDateString(
                                                    "en-US"
                                                )
                                                : "—"}

                                        </td>


                                        {/* Phone */}

                                        <td>

                                            {
                                                patient.phone ||
                                                "—"
                                            }

                                        </td>


                                        {/* Health Card */}

                                        <td>

                                            {
                                                patient.health_card ||
                                                "—"
                                            }

                                        </td>


                                        {/* Created */}

                                        <td>

                                            {new Date(
                                                patient.created_at
                                            ).toLocaleDateString(
                                                "en-US"
                                            )}

                                        </td>


                                        {/* Actions */}

                                        <td>

                                            <div className="table-actions">

                                                <button
                                                    title="View patient"
                                                    className="icon-button"
                                                    onClick={() => onView(patient)}
                                                >

                                                    <Eye
                                                        size={16}
                                                    />

                                                </button>


                                                <button
                                                    title="Edit patient"
                                                    className="icon-button"
                                                    onClick={() =>
                                                        onEdit(
                                                            patient
                                                        )
                                                    }
                                                >

                                                    <Edit3
                                                        size={16}
                                                    />

                                                </button>


                                                <button
                                                    title="Delete patient"
                                                    className="icon-button danger"
                                                    onClick={() =>
                                                        onDelete(
                                                            patient
                                                        )
                                                    }
                                                >

                                                    <Trash2
                                                        size={16}
                                                    />

                                                </button>

                                            </div>

                                        </td>

                                    </tr>

                                )
                            )

                        )}

                    </tbody>

                </table>

            </div>

        </div>

    );

}