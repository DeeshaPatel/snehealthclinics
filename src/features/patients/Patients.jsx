import { useEffect, useMemo, useState } from "react";

import {
    Plus,
    Search,
    RefreshCw
} from "lucide-react";

import {
    getPatients,
    createPatient,
    updatePatient,
    deletePatient,
    getPatientHistory
} from "../../api/patientApi";

import PatientTable from "./PatientsTable";
import PatientForm from "./PatientForm";
import PatientHistoryModal from "./PatientHistoryModal";

import "./patients.css";


export default function Patients() {

    const [patients, setPatients] = useState([]);

    const [loading, setLoading] = useState(true);

    const [error, setError] = useState("");

    const [search, setSearch] = useState("");

    const [showForm, setShowForm] = useState(false);

    const [selectedPatient, setSelectedPatient] = useState(null);

    const [patientHistory, setPatientHistory] = useState([]);

    const [showHistory, setShowHistory] = useState(false);

    const [historyLoading, setHistoryLoading] = useState(false);

    const [editingPatient, setEditingPatient] =
        useState(null);


    /*
    LOAD PATIENTS
    */

    const loadPatients = async () => {

        try {

            setLoading(true);

            setError("");

            const data = await getPatients();

            setPatients(data);

        } catch (error) {

            console.error(
                "Patients loading error:",
                error
            );

            setError(
                "Unable to load patients."
            );

        } finally {

            setLoading(false);

        }

    };


    useEffect(() => {

        loadPatients();

    }, []);


    /*
        SEARCH
    */

    const filteredPatients = useMemo(() => {

        const value =
            search
                .toLowerCase()
                .trim();


        if (!value) {

            return patients;

        }


        return patients.filter((patient) => {

            const fullName =
                `${patient.first_name} ${patient.last_name}`
                    .toLowerCase();


            return (
                fullName.includes(value) ||
                patient.phone
                    ?.toLowerCase()
                    .includes(value) ||
                patient.health_card
                    ?.toLowerCase()
                    .includes(value)
            );

        });

    }, [patients, search]);


    /*
        ADD PATIENT
    */

    const handleAddPatient = () => {

        setEditingPatient(null);

        setShowForm(true);

    };


    /*
        EDIT PATIENT
    */

    const handleEditPatient = (patient) => {

        setEditingPatient(patient);

        setShowForm(true);

    };


    /*
        SAVE PATIENT
    */

    const handleSavePatient = async (formData) => {

        try {

            if (editingPatient) {

                const updated =
                    await updatePatient(
                        editingPatient.id,
                        formData
                    );


                setPatients((current) =>
                    current.map((patient) =>
                        patient.id === updated.id
                            ? updated
                            : patient
                    )
                );

            } else {

                const created =
                    await createPatient(
                        formData
                    );


                setPatients((current) => [
                    created,
                    ...current
                ]);

            }


            setShowForm(false);

            setEditingPatient(null);

        } catch (error) {

            console.error(
                "Save patient error:",
                error
            );

            throw error;

        }

    };


    /*
        DELETE PATIENT
    */

    const handleDeletePatient = async (
        patient
    ) => {

        const confirmed =
            window.confirm(
                `Delete ${patient.first_name} ${patient.last_name}?`
            );


        if (!confirmed) {

            return;

        }


        try {

            await deletePatient(
                patient.id
            );


            setPatients((current) =>
                current.filter(
                    (item) =>
                        item.id !== patient.id
                )
            );

        } catch (error) {

            console.error(
                "Delete patient error:",
                error
            );

            alert(
                "Unable to delete patient."
            );

        }

    };

    /*
    VIEW PATIENT HISTORY
    */

    const handleViewPatient = async (patient) => {

        try {

            setSelectedPatient(patient);

            setShowHistory(true);

            setHistoryLoading(true);

            const history =
                await getPatientHistory(patient.id);

            setPatientHistory(history);

        } catch (error) {

            console.error(
                "Patient history error:",
                error
            );

            setPatientHistory([]);

        } finally {

            setHistoryLoading(false);

        }

    };


    return (

        <div className="patients-page">

            {/* HEADER */}

            <div className="patients-header">

                <div>

                    <h1>
                        Patients
                    </h1>

                    <p>
                        Manage patient information and records.
                    </p>

                </div>


                <button
                    className="primary-button"
                    onClick={handleAddPatient}
                >

                    <Plus size={18} />

                    Add Patient

                </button>

            </div>


            {/* TOOLBAR */}

            <div className="patients-toolbar">

                <div className="patient-search">

                    <Search size={18} />

                    <input
                        type="text"
                        placeholder="Search patients..."
                        value={search}
                        onChange={(event) =>
                            setSearch(
                                event.target.value
                            )
                        }
                    />

                </div>


                <button
                    className="refresh-button"
                    onClick={loadPatients}
                    title="Refresh"
                >

                    <RefreshCw
                        size={18}
                    />

                </button>

            </div>


            {/* ERROR */}

            {error && (

                <div className="patients-error">

                    {error}

                </div>

            )}


            {/* TABLE */}

            <PatientTable

                patients={
                    filteredPatients
                }

                loading={loading}

                onEdit={
                    handleEditPatient
                }

                onDelete={
                    handleDeletePatient
                }

                onView={handleViewPatient}

            />


            {/* FORM */}

            {showForm && (

                <PatientForm

                    patient={
                        editingPatient
                    }

                    onClose={() => {

                        setShowForm(false);

                        setEditingPatient(null);

                    }}

                    onSave={
                        handleSavePatient
                    }

                />

            )}

            {showHistory && selectedPatient && (

                <PatientHistoryModal

                    patient={selectedPatient}

                    history={patientHistory}

                    loading={historyLoading}

                    onClose={() => {

                        setShowHistory(false);

                        setSelectedPatient(null);

                        setPatientHistory([]);

                    }}

                />

            )}

        </div>

    );

}