import { useEffect, useState } from "react";

import {
    Search,
    Users as UsersIcon,
    Plus,
    RefreshCw,
    Mail,
    Shield,
    Trash2,
    Pencil,
    X
} from "lucide-react";

import {
    getUsers,
    createUser,
    deleteUser,
    updateUser
} from "../../api/usersApi";

import "./users.css";


export default function Users() {

    const [users, setUsers] = useState([]);

    const [loading, setLoading] =
        useState(true);

    const [search, setSearch] =
        useState("");

    const [error, setError] =
        useState("");

    const [showModal, setShowModal] =
        useState(false);

    const [editingUser, setEditingUser] =
        useState(null);

    const [saving, setSaving] =
        useState(false);


    const [formError, setFormError] =
        useState("");


    const [formData, setFormData] = useState({

        first_name: "",
        last_name: "",
        email: "",
        password: "",
        role: "receptionist"

    });


    // ==========================================
    // LOAD USERS
    // ==========================================

    const fetchUsers = async () => {

        try {

            setLoading(true);

            setError("");

            const data =
                await getUsers();

            setUsers(data);

        } catch (error) {

            console.error(error);

            setError(
                "Unable to load users."
            );

        } finally {

            setLoading(false);

        }

    };


    useEffect(() => {

        fetchUsers();

    }, []);


    // ==========================================
    // SEARCH
    // ==========================================

    const filteredUsers =
        users.filter((user) => {

            const value =
                search.toLowerCase();

            return (

                user.first_name
                    ?.toLowerCase()
                    .includes(value)

                ||

                user.last_name
                    ?.toLowerCase()
                    .includes(value)

                ||

                user.email
                    ?.toLowerCase()
                    .includes(value)

                ||

                user.role
                    ?.toLowerCase()
                    .includes(value)

            );

        });


    // ==========================================
    // FORM CHANGE
    // ==========================================

    const handleChange = (event) => {

        const {
            name,
            value
        } = event.target;


        setFormData((previous) => ({

            ...previous,

            [name]: value

        }));

    };


    // ==========================================
    // CLOSE MODAL
    // ==========================================

    const closeModal = () => {

        if (saving) {
            return;
        }
    
    
        setShowModal(false);
    
        setEditingUser(null);
    
        setFormError("");
    
    
        setFormData({
    
            first_name: "",
            last_name: "",
            email: "",
            password: "",
            role: "receptionist"
    
        });
    
    };

    // ==========================================
    // EDIT USER
    // ==========================================


    const handleEditUser = (user) => {

        setEditingUser(user);
    
        setFormError("");
    
        setFormData({
    
            first_name:
                user.first_name || "",
    
            last_name:
                user.last_name || "",
    
            email:
                user.email || "",
    
            password: "",
    
            role:
                user.role || "receptionist"
    
        });
    
        setShowModal(true);
    
    };


    // ==========================================
    // CREATE USER
    // ==========================================

    const handleSubmitUser = async (event) => {

        event.preventDefault();
    
        setFormError("");
    
    
        if (
            !formData.first_name.trim() ||
            !formData.last_name.trim() ||
            !formData.email.trim()
        ) {
    
            setFormError(
                "Please complete all required fields."
            );
    
            return;
    
        }
    
    
        // Password is required only when creating
    
        if (
            !editingUser &&
            !formData.password.trim()
        ) {
    
            setFormError(
                "Password is required."
            );
    
            return;
    
        }
    
    
        // If a password was entered while editing,
        // validate it.
    
        if (
            formData.password &&
            formData.password.length < 8
        ) {
    
            setFormError(
                "Password must be at least 8 characters."
            );
    
            return;
    
        }
    
    
        try {
    
            setSaving(true);
    
    
            if (editingUser) {
    
                // ======================================
                // UPDATE
                // ======================================
    
                const updatedUser =
                    await updateUser(
                        editingUser.id,
                        {
                            first_name:
                                formData.first_name.trim(),
    
                            last_name:
                                formData.last_name.trim(),
    
                            email:
                                formData.email.trim(),
    
                            password:
                                formData.password,
    
                            role:
                                formData.role
                        }
                    );
    
    
                setUsers((previous) =>
                    previous.map((user) =>
                        user.id === editingUser.id
                            ? updatedUser
                            : user
                    )
                );
    
            } else {
    
                // ======================================
                // CREATE
                // ======================================
    
                const newUser =
                    await createUser({
    
                        first_name:
                            formData.first_name.trim(),
    
                        last_name:
                            formData.last_name.trim(),
    
                        email:
                            formData.email.trim(),
    
                        password:
                            formData.password,
    
                        role:
                            formData.role
    
                    });
    
    
                setUsers((previous) => [
    
                    ...previous,
    
                    newUser
    
                ]);
    
            }
    
    
            closeModal();
    
        } catch (error) {
    
            console.error(error);
    
            setFormError(
                error.response?.data?.message ||
                "Unable to save user."
            );
    
        } finally {
    
            setSaving(false);
    
        }
    
    };


    // ==========================================
    // DELETE USER
    // ==========================================

    const handleDelete = async (user) => {

        const confirmed =
            window.confirm(
                `Delete ${user.first_name} ${user.last_name}?`
            );


        if (!confirmed) {
            return;
        }


        try {

            await deleteUser(user.id);


            setUsers((previous) =>
                previous.filter(
                    (item) =>
                        item.id !== user.id
                )
            );

        } catch (error) {

            console.error(error);

            setError(
                error.response?.data?.message ||
                "Unable to delete user."
            );

        }

    };


    return (

        <div className="users-page">


            {/* HEADER */}

            <div className="users-header">

                <div className="users-title">

                    <div className="users-title-icon">

                        <UsersIcon size={22} />

                    </div>

                    <div>

                        <h1>
                            Users
                        </h1>

                        <p>
                            Manage staff accounts
                            and access.
                        </p>

                    </div>

                </div>


                <div className="users-header-actions">

                    <button
                        className="users-refresh-btn"
                        onClick={fetchUsers}
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
                        className="users-add-btn"
                        onClick={() => {

                            setFormError("");

                            setShowModal(true);

                        }}
                    >

                        <Plus size={18} />

                        Add User

                    </button>

                </div>

            </div>


            {/* TOOLBAR */}

            <div className="users-toolbar">

                <div className="users-search">

                    <Search size={18} />

                    <input
                        type="text"
                        placeholder="Search users..."
                        value={search}
                        onChange={(event) =>
                            setSearch(
                                event.target.value
                            )
                        }
                    />

                </div>


                <div className="users-count">

                    <strong>
                        {filteredUsers.length}
                    </strong>

                    {filteredUsers.length === 1
                        ? " User"
                        : " Users"}

                </div>

            </div>


            {/* ERROR */}

            {error && (

                <div className="users-error">

                    {error}

                    <button
                        onClick={fetchUsers}
                    >
                        Try Again
                    </button>

                </div>

            )}


            {/* USERS */}

            {loading ? (

                <div className="users-loading">

                    <div className="user-spinner"></div>

                    <p>
                        Loading users...
                    </p>

                </div>

            ) : (

                <div className="users-list">

                    {filteredUsers.map(
                        (user) => (

                            <div
                                className="user-row"
                                key={user.id}
                            >

                                <div className="user-main">

                                    <div className="user-avatar">

                                        {user.first_name
                                            ?.charAt(0)
                                            .toUpperCase()}

                                        {user.last_name
                                            ?.charAt(0)
                                            .toUpperCase()}

                                    </div>


                                    <div className="user-name">

                                        <h2>

                                            {user.first_name}{" "}
                                            {user.last_name}

                                        </h2>

                                        <div>

                                            <Mail size={14} />

                                            {user.email}

                                        </div>

                                    </div>

                                </div>


                                <div className="user-right">

                                    <span
                                        className={
                                            user.role ===
                                            "admin"
                                                ? "role-badge admin"
                                                : "role-badge receptionist"
                                        }
                                    >

                                        <Shield size={13} />

                                        {user.role ===
                                            "admin"
                                            ? "Admin"
                                            : "Receptionist"}

                                    </span>


                                    <span className="user-date">

                                        {user.created_at
                                            ? new Date(
                                                user.created_at
                                            ).toLocaleDateString()
                                            : ""}

                                    </span>


                                    <div className="user-actions">

                                        <button
                                            type="button"
                                            className="edit-user-btn"
                                            onClick={() =>
                                                handleEditUser(user)
                                            }
                                            title="Edit user"
                                        >

                                            <Pencil size={15} />

                                        </button>


                                        <button
                                            type="button"
                                            className="delete-user-btn"
                                            onClick={() =>
                                                handleDelete(user)
                                            }
                                            title="Delete user"
                                        >

                                            <Trash2 size={15} />

                                        </button>

                                    </div>

                                </div>

                            </div>

                        )
                    )}

                </div>

            )}


            {/* ==========================================
                ADD USER MODAL
            ========================================== */}

            {showModal && (

                <div
                    className="user-modal-overlay"
                    onMouseDown={(event) => {

                        if (
                            event.target ===
                            event.currentTarget
                        ) {

                            closeModal();

                        }

                    }}
                >

                    <div className="user-modal">


                        <div className="user-modal-header">

                            <div>

                            <h2>
                                {editingUser
                                    ? "Edit User"
                                    : "Add User"}
                            </h2>

                            <p>
                                {editingUser
                                    ? "Update this staff member's information."
                                    : "Create a staff account for the clinic."}
                            </p>

                            </div>


                            <button
                                className="user-modal-close"
                                onClick={closeModal}
                            >

                                <X size={19} />

                            </button>

                        </div>


                        <form
                            onSubmit={
                                handleSubmitUser
                            }
                        >

                            <div className="user-modal-body">


                                {formError && (

                                    <div className="user-form-error">

                                        {formError}

                                    </div>

                                )}


                                <div className="user-form-row">

                                    <div className="user-form-group">

                                        <label>
                                            First Name *
                                        </label>

                                        <input
                                            name="first_name"
                                            value={
                                                formData.first_name
                                            }
                                            onChange={
                                                handleChange
                                            }
                                            placeholder="First name"
                                        />

                                    </div>


                                    <div className="user-form-group">

                                        <label>
                                            Last Name *
                                        </label>

                                        <input
                                            name="last_name"
                                            value={
                                                formData.last_name
                                            }
                                            onChange={
                                                handleChange
                                            }
                                            placeholder="Last name"
                                        />

                                    </div>

                                </div>


                                <div className="user-form-group">

                                    <label htmlFor="edit-email">
                                        Email <span>*</span>
                                    </label>

                                    <input
                                        id="user-email"
                                        type="email"
                                        name="email"
                                        value={formData.email || ""}
                                        onChange={handleChange}
                                        placeholder="staff@example.com"
                                        disabled={!!editingUser}
                                        readOnly={!!editingUser}
                                        className={editingUser ? "disabled-input" : ""}
                                        required
                                    />

                                    {editingUser && (
                                        <small className="field-help">
                                            Email cannot be changed after the account is created.
                                        </small>
                                    )}

                                </div>


                                <div className="user-form-group">

                                <label>

                                    Password

                                    {!editingUser && " *"}

                                </label>

                                <input
                                    type="password"
                                    name="password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    placeholder={
                                        editingUser
                                            ? "Leave blank to keep current password"
                                            : "Minimum 8 characters"
                                    }
                                />

                                </div>


                                <div className="user-form-group">

                                    <label>
                                        Role
                                    </label>

                                    <select
                                        name="role"
                                        value={
                                            formData.role
                                        }
                                        onChange={
                                            handleChange
                                        }
                                    >

                                        <option value="receptionist">
                                            Receptionist
                                        </option>

                                        <option value="admin">
                                            Admin
                                        </option>

                                    </select>

                                </div>

                            </div>


                            <div className="user-modal-footer">

                                <button
                                    type="button"
                                    className="user-cancel-btn"
                                    onClick={closeModal}
                                    disabled={saving}
                                >
                                    Cancel
                                </button>


                                <button
                                    type="submit"
                                    className="user-save-btn"
                                    disabled={saving}
                                >

                                    {saving ? (

                                        <>
                                            <RefreshCw
                                                size={15}
                                                className="spin"
                                            />

                                            {editingUser
                                                ? "Saving..."
                                                : "Creating..."}

                                        </>

                                    ) : (

                                        <>
                                            {editingUser ? (
                                                <Pencil size={15} />
                                            ) : (
                                                <Plus size={16} />
                                            )}

                                            {editingUser
                                                ? "Save Changes"
                                                : "Create User"}

                                        </>

                                    )}

                                </button>

                            </div>

                        </form>

                    </div>

                </div>

            )}

        </div>

    );

}