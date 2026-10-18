
import { useEffect, useState } from "react";
import "./App.css";

const starterStudents = [
  {
    id: "ST001",
    fullName: "Thabo Mokoena",
    age: 21,
    email: "thabo@example.com",
    course: "Information Technology",
    status: "Enrolled",
  },
  {
    id: "ST002",
    fullName: "Lerato Mokati",
    age: 22,
    email: "lerato@example.com",
    course: "Business Information Technology",
    status: "Enrolled",
  },
  {
    id: "ST003",
    fullName: "Mpho Letuka",
    age: 20,
    email: "mpho@example.com",
    course: "Computer Science",
    status: "Pending",
  },
];

const emptyForm = {
  fullName: "",
  age: "",
  email: "",
  course: "",
  status: "Enrolled",
};

function App() {
  // Load saved students when the application starts.
  const [students, setStudents] = useState(() => {
    try {
      const savedStudents = localStorage.getItem("diwaStudents");
      return savedStudents
        ? JSON.parse(savedStudents)
        : starterStudents;
    } catch {
      return starterStudents;
    }
  });

  const [search, setSearch] = useState("");
  const [modalType, setModalType] = useState("");
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [formData, setFormData] = useState(emptyForm);
  const [errors, setErrors] = useState({});
  const [deleteStudent, setDeleteStudent] = useState(null);

  const appName = "Student Management System";

  // Save the student list whenever it changes.
  useEffect(() => {
    localStorage.setItem("diwaStudents", JSON.stringify(students));
  }, [students]);

  // Open the form for adding a student.
  const openAddModal = () => {
    setSelectedStudent(null);
    setFormData({ ...emptyForm });
    setErrors({});
    setModalType("add");
  };

  // Open the form with the student's existing information.
  const openEditModal = (student) => {
    setSelectedStudent(student);
    setFormData({
      fullName: student.fullName,
      age: String(student.age),
      email: student.email,
      course: student.course,
      status: student.status,
    });
    setErrors({});
    setModalType("edit");
  };

  // Close the modal and clear temporary form information.
  const closeModal = () => {
    setModalType("");
    setSelectedStudent(null);
    setFormData({ ...emptyForm });
    setErrors({});
  };

  // Update a form field when the user types or selects an option.
  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((previousData) => ({
      ...previousData,
      [name]: value,
    }));

    setErrors((previousErrors) => ({
      ...previousErrors,
      [name]: "",
    }));
  };

  // Check that the information is valid.
  const validateForm = () => {
    const newErrors = {};
    const ageNumber = Number(formData.age);

    // Correct email validation pattern.
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!formData.fullName.trim()) {
      newErrors.fullName =
        "Please enter the student's full name.";
    }

    if (!formData.age.trim()) {
      newErrors.age = "Please enter the student's age.";
    } else if (
      !Number.isInteger(ageNumber) ||
      ageNumber < 1 ||
      ageNumber > 120
    ) {
      newErrors.age =
        "Age must be a whole number between 1 and 120.";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Please enter an email address.";
    } else if (
      !emailPattern.test(formData.email.trim())
    ) {
      newErrors.email =
        "Please enter a valid email address.";
    }

    if (!formData.course.trim()) {
      newErrors.course =
        "Please enter the course of study.";
    }

    if (!["Enrolled", "Pending"].includes(formData.status)) {
      newErrors.status =
        "Please select a valid enrollment status.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Add a new student or update an existing student.
  const handleSubmit = (event) => {
    event.preventDefault();

    if (!validateForm()) {
      return;
    }

    const studentDetails = {
      fullName: formData.fullName.trim(),
      age: Number(formData.age),
      email: formData.email.trim(),
      course: formData.course.trim(),
      status: formData.status,
    };

    if (modalType === "add") {
      const newStudent = {
        id: `ST${Date.now()}`,
        ...studentDetails,
      };

      setStudents((previousStudents) => [
        ...previousStudents,
        newStudent,
      ]);
    } else {
      setStudents((previousStudents) =>
        previousStudents.map((student) =>
          student.id === selectedStudent.id
            ? { ...student, ...studentDetails }
            : student
        )
      );
    }

    closeModal();
  };

  // Delete the selected student after confirmation.
  const confirmDelete = () => {
    if (!deleteStudent) return;

    setStudents((previousStudents) =>
      previousStudents.filter(
        (student) => student.id !== deleteStudent.id
      )
    );

    setDeleteStudent(null);
  };

  // Search by ID, name, email, or course.
  const filteredStudents = students.filter((student) => {
    const searchText = search.toLowerCase();

    return (
      student.id.toLowerCase().includes(searchText) ||
      student.fullName.toLowerCase().includes(searchText) ||
      student.email.toLowerCase().includes(searchText) ||
      student.course.toLowerCase().includes(searchText)
    );
  });

  const enrolledCount = students.filter(
    (student) => student.status === "Enrolled"
  ).length;

  const pendingCount = students.filter(
    (student) => student.status === "Pending"
  ).length;

  return (
    <div className="app">
      <aside className="sidebar">
        <h2>SMS.</h2>
        <p className="sidebar-label">MENU</p>
        <div className="nav-item active">▦ Dashboard</div>
        <div className="nav-item">♙ Students</div>
        <div className="nav-item">⚙ Settings</div>
      </aside>

      <main className="main-content">
        <header className="topbar">
          <div>
            <p className="small-heading">STUDENT PORTAL</p>
            <h1>{appName}</h1>
          </div>
          <div className="profile">Admin</div>
        </header>

        <section className="welcome">
          <div>
            <p className="small-heading">OVERVIEW</p>
            <h2>Welcome back, Admin!</h2>
            <p>Manage student records in one place.</p>
          </div>
          <div className="welcome-icon">🎓</div>
        </section>

        <section className="stats">
          <div className="stat-card">
            <p>Total Students</p>
            <h2>{students.length}</h2>
          </div>

          <div className="stat-card">
            <p>Enrolled Students</p>
            <h2>{enrolledCount}</h2>
          </div>

          <div className="stat-card">
            <p>Pending Students</p>
            <h2>{pendingCount}</h2>
          </div>
        </section>

        <section className="student-section">
          <div className="section-heading">
            <div>
              <h2>Student Records</h2>
              <p>View and manage registered students.</p>
            </div>

            <button
              className="primary-button"
              onClick={openAddModal}
            >
              + Add Student
            </button>
          </div>

          <input
            className="search-input"
            type="search"
            placeholder="Search by name, ID, email, or course..."
            value={search}
            onChange={(event) => setSearch(event.target.value)}
          />

          <div className="table-wrapper">
            <table>
              <thead>
                <tr>
                  <th>Student ID</th>
                  <th>Full Name</th>
                  <th>Age</th>
                  <th>Email Address</th>
                  <th>Course</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>

              <tbody>
                {filteredStudents.map((student) => (
                  <tr key={student.id}>
                    <td>{student.id}</td>
                    <td className="student-name">
                      {student.fullName}
                    </td>
                    <td>{student.age}</td>
                    <td>{student.email}</td>
                    <td>{student.course}</td>

                    <td>
                      <span
                        className={
                          student.status === "Enrolled"
                            ? "status enrolled"
                            : "status pending"
                        }
                      >
                        {student.status}
                      </span>
                    </td>

                    <td>
                      <div className="action-buttons">
                        <button
                          className="edit-button"
                          onClick={() => openEditModal(student)}
                        >
                          Edit
                        </button>

                        <button
                          className="delete-button"
                          onClick={() => setDeleteStudent(student)}
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}

                {filteredStudents.length === 0 && (
                  <tr>
                    <td colSpan="7" className="empty-state">
                      No students found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </section>
      </main>

      {/* Add and edit modal */}
      {modalType && (
        <div className="modal-overlay">
          <section
            className="modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="student-modal-title"
          >
            <div className="modal-header">
              <div>
                <h2 id="student-modal-title">
                  {modalType === "add"
                    ? "Add Student"
                    : "Edit Student"}
                </h2>
                <p>Enter the student's information below.</p>
              </div>

              <button
                className="close-button"
                type="button"
                aria-label="Close modal"
                onClick={closeModal}
              >
                ×
              </button>
            </div>

            <form onSubmit={handleSubmit} noValidate>
              {modalType === "edit" && (
                <div className="form-group">
                  <label>Student ID</label>
                  <input value={selectedStudent.id} readOnly />
                </div>
              )}

              <div className="form-group">
                <label htmlFor="fullName">Full Name</label>
                <input
                  id="fullName"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  placeholder="Enter full name"
                  aria-invalid={Boolean(errors.fullName)}
                />

                {errors.fullName && (
                  <p className="error-message">
                    {errors.fullName}
                  </p>
                )}
              </div>

              <div className="form-group">
                <label htmlFor="age">Age</label>
                <input
                  id="age"
                  name="age"
                  type="number"
                  min="1"
                  max="120"
                  step="1"
                  value={formData.age}
                  onChange={handleChange}
                  placeholder="Enter age"
                  aria-invalid={Boolean(errors.age)}
                />

                {errors.age && (
                  <p className="error-message">
                    {errors.age}
                  </p>
                )}
              </div>

              <div className="form-group">
                <label htmlFor="email">Email Address</label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="student@example.com"
                  aria-invalid={Boolean(errors.email)}
                />

                {errors.email && (
                  <p className="error-message">
                    {errors.email}
                  </p>
                )}
              </div>

              <div className="form-group">
                <label htmlFor="course">Course of Study</label>
                <input
                  id="course"
                  name="course"
                  value={formData.course}
                  onChange={handleChange}
                  placeholder="Enter course"
                  aria-invalid={Boolean(errors.course)}
                />

                {errors.course && (
                  <p className="error-message">
                    {errors.course}
                  </p>
                )}
              </div>

              <div className="form-group">
                <label htmlFor="status">
                  Enrollment Status
                </label>

                <select
                  id="status"
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  aria-invalid={Boolean(errors.status)}
                >
                  <option value="Enrolled">Enrolled</option>
                  <option value="Pending">Pending</option>
                </select>

                {errors.status && (
                  <p className="error-message">
                    {errors.status}
                  </p>
                )}
              </div>

              <div className="modal-actions">
                <button
                  className="secondary-button"
                  type="button"
                  onClick={closeModal}
                >
                  Cancel
                </button>

                <button
                  className="primary-button"
                  type="submit"
                >
                  {modalType === "add"
                    ? "Add Student"
                    : "Save Changes"}
                </button>
              </div>
            </form>
          </section>
        </div>
      )}

      {/* Delete confirmation modal */}
      {deleteStudent && (
        <div className="modal-overlay">
          <section
            className="modal delete-modal"
            role="alertdialog"
            aria-modal="true"
            aria-labelledby="delete-modal-title"
          >
            <h2 id="delete-modal-title">Delete Student?</h2>

            <p>
              Are you sure you want to delete{" "}
              <strong>{deleteStudent.fullName}</strong>? This
              action cannot be undone.
            </p>

            <div className="modal-actions">
              <button
                className="secondary-button"
                onClick={() => setDeleteStudent(null)}
              >
                Cancel
              </button>

              <button
                className="delete-button"
                onClick={confirmDelete}
              >
                Yes, Delete
              </button>
            </div>
          </section>
        </div>
      )}
    </div>
  );
}

export default App;