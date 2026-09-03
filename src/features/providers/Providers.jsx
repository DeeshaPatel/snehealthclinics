import { useEffect, useState } from "react";

import {
    Search,
    Stethoscope,
    Mail,
    Phone,
    RefreshCw,
    Plus,
    X,
    Trash2
} from "lucide-react";

import {
    getProviders,
    createProvider,
    deleteProvider
} from "../../api/providerApi";

import "./providers.css";


export default function Providers() {

    const [providers, setProviders] = useState([]);

    const [loading, setLoading] = useState(true);

    const [error, setError] = useState("");

    const [search, setSearch] = useState("");

    const [showDeleteModal, setShowDeleteModal] =
        useState(false);

    const [providerToDelete, setProviderToDelete] =
        useState(null);

    const [deleting, setDeleting] =
        useState(false);

    const [showAddModal, setShowAddModal] =
        useState(false);

    const [saving, setSaving] =
        useState(false);

    const [formError, setFormError] =
        useState("");


    const [formData, setFormData] = useState({

        first_name: "",
        last_name: "",
        specialty: "",
        email: "",
        phone: ""

    });


    // ==========================================
    // FETCH PROVIDERS
    // ==========================================

    const fetchProviders = async () => {

        try {

            setLoading(true);

            setError("");

            const data = await getProviders();

            setProviders(data);

        } catch (err) {

            console.error(
                "Error fetching providers:",
                err
            );

            setError(
                "Unable to load providers."
            );

        } finally {

            setLoading(false);

        }

    };


    useEffect(() => {

        fetchProviders();

    }, []);


    // ==========================================
    // SEARCH
    // ==========================================

    const filteredProviders =
        providers.filter((provider) => {

            const searchValue =
                search.toLowerCase();

            return (

                provider.first_name
                    ?.toLowerCase()
                    .includes(searchValue)

                ||

                provider.last_name
                    ?.toLowerCase()
                    .includes(searchValue)

                ||

                provider.specialty
                    ?.toLowerCase()
                    .includes(searchValue)

                ||

                provider.email
                    ?.toLowerCase()
                    .includes(searchValue)

            );

        });


    // ==========================================
    // FORM CHANGE
    // ==========================================

    const handleFormChange = (e) => {

        const {
            name,
            value
        } = e.target;

        setFormData((previous) => ({

            ...previous,

            [name]: value

        }));

    };


    // ==========================================
    // DELETE PROVIDER
    // ==========================================
    const handleDeleteProvider = async () => {

        if (!providerToDelete) {
            return;
        }
    
    
        try {
    
            setDeleting(true);
    
    
            await deleteProvider(
                providerToDelete.id
            );
    
    
            // Remove provider immediately
            // from the current list
    
            setProviders((previous) =>
                previous.filter(
                    (provider) =>
                        provider.id !==
                        providerToDelete.id
                )
            );
    
    
            // Close confirmation popup
    
            setShowDeleteModal(false);
    
            setProviderToDelete(null);
    
    
        } catch (err) {
    
            console.error(
                "Error deleting provider:",
                err
            );
    
            setError(
                err?.response?.data?.message ||
                "Unable to delete provider."
            );
    
        } finally {
    
            setDeleting(false);
    
        }
    
    };

    // ==========================================
    // CLOSE MODAL
    // ==========================================

    const closeModal = () => {

        if (saving) {
            return;
        }

        setShowAddModal(false);

        setFormError("");

        setFormData({

            first_name: "",
            last_name: "",
            specialty: "",
            email: "",
            phone: ""

        });

    };

    // ==========================================
    // OPEN DELETE MODAL
    // ==========================================

    const openDeleteModal = (provider) => {

        setProviderToDelete(provider);
    
        setShowDeleteModal(true);
    
    };

    // ==========================================
    // ADD PROVIDER
    // ==========================================

    const handleAddProvider = async (e) => {

        e.preventDefault();

        setFormError("");


        // Basic validation

        if (
            !formData.first_name.trim() ||
            !formData.last_name.trim()
        ) {

            setFormError(
                "First name and last name are required."
            );

            return;

        }


        if (!formData.specialty.trim()) {

            setFormError(
                "Please enter the provider specialty."
            );

            return;

        }


        try {

            setSaving(true);


            await createProvider({

                first_name:
                    formData.first_name.trim(),

                last_name:
                    formData.last_name.trim(),

                specialty:
                    formData.specialty.trim(),

                email:
                    formData.email.trim(),

                phone:
                    formData.phone.trim()

            });


            // Close popup

            setShowAddModal(false);


            // Reset form

            setFormData({

                first_name: "",
                last_name: "",
                specialty: "",
                email: "",
                phone: ""

            });


            // Reload providers

            await fetchProviders();

        } catch (err) {

            console.error(
                "Error creating provider:",
                err
            );

            setFormError(
                err?.response?.data?.message ||
                "Unable to add provider. Please try again."
            );

        } finally {

            setSaving(false);

        }

    };


    return (

        <div className="providers-page">


            {/* ==========================================
                HEADER
            ========================================== */}

            <div className="providers-header">

                <div className="providers-title">

                    <div className="providers-title-icon">

                        <Stethoscope size={22} />

                    </div>

                    <div>

                        <h1>
                            Providers
                        </h1>

                        <p>
                            Manage healthcare providers
                            and their information.
                        </p>

                    </div>

                </div>


                <div className="providers-header-actions">

                    <button
                        className="refresh-provider-btn"
                        onClick={fetchProviders}
                        disabled={loading}
                    >

                        <RefreshCw
                            size={16}
                            className={
                                loading
                                    ? "spin"
                                    : ""
                            }
                        />

                        Refresh

                    </button>


                    <button
                        className="add-provider-btn"
                        onClick={() => {

                            setFormError("");

                            setShowAddModal(true);

                        }}
                    >

                        <Plus size={18} />

                        Add Provider

                    </button>

                </div>

            </div>


            {/* ==========================================
                SEARCH
            ========================================== */}

            <div className="providers-toolbar">

                <div className="provider-search">

                    <Search size={18} />

                    <input
                        type="text"
                        placeholder="Search providers, specialty, or email..."
                        value={search}
                        onChange={(e) =>
                            setSearch(e.target.value)
                        }
                    />

                </div>


                <div className="provider-count">

                    <strong>
                        {filteredProviders.length}
                    </strong>

                    {filteredProviders.length === 1
                        ? " Provider"
                        : " Providers"}

                </div>

            </div>


            {/* ==========================================
                ERROR
            ========================================== */}

            {error && (

                <div className="providers-error">

                    <span>
                        {error}
                    </span>

                    <button
                        onClick={fetchProviders}
                    >
                        Try Again
                    </button>

                </div>

            )}


            {/* ==========================================
                PROVIDERS
            ========================================== */}

            {loading ? (

                <div className="providers-loading">

                    <div className="provider-spinner"></div>

                    <p>
                        Loading providers...
                    </p>

                </div>

            ) : (

                <div className="providers-list">

                    {filteredProviders.length === 0 ? (

                        <div className="no-providers">

                            <div className="empty-provider-icon">

                                <Stethoscope size={30} />

                            </div>

                            <h3>
                                No providers found
                            </h3>

                            <p>
                                {search
                                    ? "Try changing your search."
                                    : "Add your first provider to get started."
                                }
                            </p>


                            {!search && (

                                <button
                                    className="empty-add-provider-btn"
                                    onClick={() =>
                                        setShowAddModal(true)
                                    }
                                >

                                    <Plus size={17} />

                                    Add Provider

                                </button>

                            )}

                        </div>

                    ) : (

                        filteredProviders.map(
                            (provider) => (

                                <div
                                    className="provider-row"
                                    key={provider.id}
                                >

                                    {/* LEFT */}

                                    <div className="provider-main">

                                        <div className="provider-avatar">

                                            {provider.first_name
                                                ?.charAt(0)
                                                .toUpperCase()}

                                            {provider.last_name
                                                ?.charAt(0)
                                                .toUpperCase()}

                                        </div>


                                        <div className="provider-name-section">

                                            <h2>

                                                {provider.first_name}{" "}

                                                {provider.last_name}

                                            </h2>


                                            <div className="provider-specialty">

                                                <Stethoscope size={15} />

                                                <span>

                                                    {provider.specialty ||
                                                        "Healthcare Provider"}

                                                </span>

                                            </div>

                                        </div>

                                    </div>


                                    {/* RIGHT */}

                                    <div className="provider-details">

                                        <div className="provider-detail">

                                            <Mail size={15} />

                                            <span>

                                                {provider.email ||
                                                    "No email"}

                                            </span>

                                        </div>


                                        <div className="provider-detail">

                                            <Phone size={15} />

                                            <span>

                                                {provider.phone ||
                                                    "No phone"}

                                            </span>

                                        </div>


                                        <span className="provider-id">

                                            ID #{provider.id}

                                        </span>

                                        <button
                                            type="button"
                                            className="delete-provider-btn"
                                            title="Delete provider"
                                            onClick={() =>
                                                openDeleteModal(provider)
                                            }
                                        >

                                            <Trash2 size={17} />

                                        </button>


                                    </div>

                                </div>

                            )
                        )

                    )}

                </div>

            )}


            {/* ==========================================
                ADD PROVIDER MODAL
            ========================================== */}

            {showAddModal && (

                <div
                    className="provider-modal-overlay"
                    onMouseDown={(e) => {

                        if (
                            e.target ===
                            e.currentTarget
                        ) {
                            closeModal();
                        }

                    }}
                >

                    <div className="provider-modal">


                        {/* MODAL HEADER */}

                        <div className="provider-modal-header">

                            <div>

                                <div className="modal-title-row">

                                    <div className="modal-icon">

                                        <Stethoscope
                                            size={19}
                                        />

                                    </div>

                                    <h2>
                                        Add Provider
                                    </h2>

                                </div>


                                <p>
                                    Add a healthcare provider
                                    to your clinic.
                                </p>

                            </div>


                            <button
                                type="button"
                                className="provider-modal-close"
                                onClick={closeModal}
                            >

                                <X size={19} />

                            </button>

                        </div>


                        {/* FORM */}

                        <form
                            onSubmit={handleAddProvider}
                        >

                            <div className="provider-modal-body">


                                {formError && (

                                    <div className="provider-form-error">

                                        {formError}

                                    </div>

                                )}


                                {/* NAME */}

                                <div className="form-row">

                                    <div className="form-group">

                                        <label>
                                            First Name
                                            <span>*</span>
                                        </label>

                                        <input
                                            type="text"
                                            name="first_name"
                                            value={
                                                formData.first_name
                                            }
                                            onChange={
                                                handleFormChange
                                            }
                                            placeholder="Enter first name"
                                            required
                                        />

                                    </div>


                                    <div className="form-group">

                                        <label>
                                            Last Name
                                            <span>*</span>
                                        </label>

                                        <input
                                            type="text"
                                            name="last_name"
                                            value={
                                                formData.last_name
                                            }
                                            onChange={
                                                handleFormChange
                                            }
                                            placeholder="Enter last name"
                                            required
                                        />

                                    </div>

                                </div>


                                {/* SPECIALTY */}

                                <div className="form-group">

                                    <label>
                                        Specialty
                                        <span>*</span>
                                    </label>

                                    <div className="input-with-icon">

                                        <Stethoscope
                                            size={16}
                                        />

                                        <input
                                            type="text"
                                            name="specialty"
                                            value={
                                                formData.specialty
                                            }
                                            onChange={
                                                handleFormChange
                                            }
                                            placeholder="e.g. Doctor, Dentist, Nurse"
                                            required
                                        />

                                    </div>

                                </div>


                                {/* EMAIL */}

                                <div className="form-group">

                                    <label>
                                        Email
                                    </label>

                                    <div className="input-with-icon">

                                        <Mail
                                            size={16}
                                        />

                                        <input
                                            type="email"
                                            name="email"
                                            value={
                                                formData.email
                                            }
                                            onChange={
                                                handleFormChange
                                            }
                                            placeholder="provider@example.com"
                                        />

                                    </div>

                                </div>


                                {/* PHONE */}

                                <div className="form-group">

                                    <label>
                                        Phone
                                    </label>

                                    <div className="input-with-icon">

                                        <Phone
                                            size={16}
                                        />

                                        <input
                                            type="tel"
                                            name="phone"
                                            value={
                                                formData.phone
                                            }
                                            onChange={
                                                handleFormChange
                                            }
                                            placeholder="Enter phone number"
                                        />

                                    </div>

                                </div>

                            </div>


                            {/* FOOTER */}

                            <div className="provider-modal-footer">

                                <button
                                    type="button"
                                    className="modal-cancel-btn"
                                    onClick={closeModal}
                                    disabled={saving}
                                >
                                    Cancel
                                </button>


                                <button
                                    type="submit"
                                    className="modal-save-btn"
                                    disabled={saving}
                                >

                                    {saving ? (

                                        <>
                                            <RefreshCw
                                                size={16}
                                                className="spin"
                                            />

                                            Saving...

                                        </>

                                    ) : (

                                        <>
                                            <Plus size={17} />

                                            Add Provider

                                        </>

                                    )}

                                </button>

                            </div>

                        </form>

                    </div>

                </div>

            )}

            {/* ==========================================
                DELETE PROVIDER MODAL
            ========================================== */}

            {showDeleteModal && (

                <div
                    className="delete-modal-overlay"
                    onMouseDown={(e) => {

                        if (
                            e.target ===
                            e.currentTarget
                        ) {

                            setShowDeleteModal(false);

                            setProviderToDelete(null);

                        }

                    }}
                >

                    <div className="delete-modal">


                        <div className="delete-modal-icon">

                            <Trash2 size={22} />

                        </div>


                        <h2>
                            Delete Provider?
                        </h2>


                        <p>

                            Are you sure you want to delete{" "}

                            <strong>

                                {providerToDelete?.first_name}{" "}
                                {providerToDelete?.last_name}

                            </strong>

                            ?

                        </p>


                        <span className="delete-warning">

                            This action cannot be undone.

                        </span>


                        <div className="delete-modal-actions">

                            <button
                                type="button"
                                className="delete-cancel-btn"
                                onClick={() => {

                                    setShowDeleteModal(false);

                                    setProviderToDelete(null);

                                }}
                                disabled={deleting}
                            >

                                Cancel

                            </button>


                            <button
                                type="button"
                                className="delete-confirm-btn"
                                onClick={handleDeleteProvider}
                                disabled={deleting}
                            >

                                {deleting ? (

                                    <>
                                        <RefreshCw
                                            size={15}
                                            className="spin"
                                        />

                                        Deleting...

                                    </>

                                ) : (

                                    <>
                                        <Trash2 size={15} />

                                        Delete Provider

                                    </>

                                )}

                            </button>

                        </div>

                    </div>

                </div>

            )}


        </div>

    );

}