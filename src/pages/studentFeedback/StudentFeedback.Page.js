import React, { useState, useEffect } from "react";
import Swal from "sweetalert2";
const StudentFeedback = () => {
  const [selectedClass, setSelectedClass] = useState("");
  const [activeTab, setActiveTab] = useState(1);
  const [selectedYear, setSelectedYear] = useState("");
  const [selectedMonth, setSelectedMonth] = useState("");
  const [gkQuestions, setGkQuestions] = useState([]);
  const [answers, setAnswers] = useState({});
  const [selectedStudent, setSelectedStudent] = useState("");
  const [studentOptions, setStudentOptions] = useState([
    { id: 0, name: "Student A" },
    { id: 1, name: "Student B" },
    { id: 2, name: "Student C" },
  ]);

  const userId = localStorage.getItem("userid");

  const classOptions = [1, 2, 3, 4, 5];
  const yearOptions = [2024, 2023];
  const monthOptions = [
    { value: 1, label: "January" },
    { value: 2, label: "February" },
    { value: 3, label: "March" },
    { value: 4, label: "April" },
    { value: 5, label: "May" },
    { value: 6, label: "June" },
    { value: 7, label: "July" },
    { value: 8, label: "August" },
    { value: 9, label: "September" },
    { value: 10, label: "October" },
    { value: 11, label: "November" },
    { value: 12, label: "December" },
  ];

  // const studentOptions = [
  //   { id: 1, name: "Student A" },
  //   { id: 2, name: "Student B" },
  //   { id: 3, name: "Student C" },
  // ];

  const dummyQuestions = [
    { id: 1, text: "Is the sky blue?" },
    { id: 2, text: "Do fish swim?" },
    { id: 3, text: "Is the earth round?" },
  ];

  const currentYear = new Date().getFullYear();
  const currentMonth = new Date().getMonth() + 1; // Month is 0-indexed

  useEffect(() => {
    // Set the current year and month on component mount
    setSelectedYear(currentYear);
    setSelectedMonth(currentMonth);
  }, [currentYear, currentMonth]);

  const handleYearChange = (e) => {
    setSelectedYear(e.target.value);
    setSelectedMonth("");
    setSelectedClass("");
    setGkQuestions([]);
    setAnswers({});
    setSelectedStudent(""); // Reset student selection
  };

  const handleMonthChange = (e) => {
    if (selectedYear == currentYear && e.target.value > currentMonth) {
      alert("You can't select a month beyond the current month!");
    } else {
      setSelectedMonth(e.target.value);
      setSelectedClass("");
      setSelectedStudent(""); // Reset student selection
    }
    setGkQuestions([]);
    setAnswers({});
  };

  const handleTabChange = (tab) => setActiveTab(tab);

  const handleClassChange = (e) => {
    setSelectedClass(e.target.value);
    setGkQuestions(dummyQuestions);
    setAnswers({});
    setSelectedStudent(""); // Reset student selection
  };

  const handleStudentChange = (e) => {
    setSelectedStudent(e.target.value);
  };

  const handleAnswerChange = (questionId, answer) => {
    setAnswers((prevAnswers) => ({
      ...prevAnswers,
      [questionId]: answer,
    }));
  };
  const [availableStudents, setAvailableStudents] = useState(studentOptions);
  const handleSubmit = () => {
    const allAnswered = gkQuestions.every(
      (question) => answers[question.id] !== undefined
    );

    if (!allAnswered) {
      Swal.fire({
        title: "Incomplete Submission",
        text: "Please answer all questions!",
        icon: "warning",
        confirmButtonColor: "#3f51b5",
        confirmButtonText: "OK",
      });
    } else {
      Swal.fire({
        title: "Success",
        text: "Quiz Submitted Successfully!",
        icon: "success",
        confirmButtonColor: "#3f51b5",
        confirmButtonText: "OK",
      }).then(() => {
        // Check if a student is selected
        if (selectedStudent) {
          // Remove the selected student from the student options
          const updatedStudents = studentOptions.filter(
            (student) => student.id !== parseInt(selectedStudent)
          );
          console.log("updatedStudents", updatedStudents);

          setStudentOptions(updatedStudents); // Update student options
        }
        // Reset states after submission
        setSelectedClass("");
        setGkQuestions([]);
        setAnswers({});
        setSelectedStudent(""); // Reset student selection
      });
    }
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.userIdText}>User ID: {userId}</h2>
      <div style={styles.dropdownContainer}>
        <label style={styles.label}>Select Year:</label>
        <select
          style={styles.dropdown}
          value={selectedYear}
          onChange={handleYearChange}
        >
          <option value="" disabled>
            --Select Year--
          </option>
          {yearOptions.map((yearOption) => (
            <option key={yearOption} value={yearOption}>
              {yearOption}
            </option>
          ))}
        </select>
      </div>

      <div style={styles.dropdownContainer}>
        <label style={styles.label}>Select Month:</label>
        <select
          style={styles.dropdown}
          value={selectedMonth}
          onChange={handleMonthChange}
        >
          <option value="" disabled>
            --Select Month--
          </option>
          {selectedYear &&
            monthOptions.map((monthOption, index) => (
              <option key={index} value={monthOption.value}>
                {monthOption.label}
              </option>
            ))}
        </select>
      </div>

      <div style={styles.tabContainer}>
        <button
          style={
            activeTab === 1
              ? { ...styles.tab, ...styles.activeTab }
              : styles.tab
          }
          onClick={() => handleTabChange(1)}
        >
          Day 1-15
        </button>
        <button
          style={
            activeTab === 2
              ? { ...styles.tab, ...styles.activeTab }
              : styles.tab
          }
          onClick={() => handleTabChange(2)}
        >
          Day 16-30
        </button>
      </div>

      <div style={styles.dropdownContainer}>
        <label style={styles.label}>Select Class:</label>
        <select
          style={styles.dropdown}
          value={selectedClass}
          onChange={handleClassChange}
        >
          <option value="" disabled>
            --Select Class--
          </option>
          {selectedYear &&
            selectedMonth &&
            classOptions.map((classOption) => (
              <option key={classOption} value={classOption}>
                Class {classOption}
              </option>
            ))}
        </select>
      </div>

      {/* Show Student dropdown only after selecting a class */}
      {selectedClass && (
        <div style={styles.dropdownContainer}>
          <label style={styles.label}>Select Student:</label>
          <select
            style={styles.dropdown}
            value={selectedStudent}
            onChange={handleStudentChange}
          >
            <option value="">--Select Student--</option>
            {studentOptions.map((student) => (
              <option key={student.id} value={student.id}>
                {student.name}
              </option>
            ))}
          </select>
        </div>
      )}

      {selectedYear &&
        selectedMonth &&
        selectedClass &&
        selectedStudent &&
        gkQuestions.length > 0 && (
          <div style={styles.questionsContainer}>
            {gkQuestions.map((question, index) => (
              <div key={question.id} style={styles.question}>
                <p style={styles.questionText}>
                  {index + 1}. {question.text}
                </p>
                <div style={styles.radioGroup}>
                  <label style={styles.radioLabel}>
                    <input
                      type="radio"
                      name={`question-${question.id}`}
                      value="yes"
                      onChange={() => handleAnswerChange(question.id, "yes")}
                      style={styles.radioInput}
                    />{" "}
                    Yes
                  </label>
                  <label style={styles.radioLabel}>
                    <input
                      type="radio"
                      name={`question-${question.id}`}
                      value="no"
                      onChange={() => handleAnswerChange(question.id, "no")}
                      style={styles.radioInput}
                    />{" "}
                    No
                  </label>
                </div>
              </div>
            ))}
          </div>
        )}

      {selectedYear &&
        selectedMonth &&
        selectedClass &&
        selectedStudent &&
        gkQuestions.length > 0 && (
          <button style={styles.submitButton} onClick={handleSubmit}>
            Submit Feedback
          </button>
        )}
    </div>
  );
};

const styles = {
  container: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    padding: "20px",
    fontFamily: "'Arial', sans-serif",
    maxWidth: "400px",
    margin: "0 auto",
  },
  tabContainer: {
    display: "flex",
    justifyContent: "center",
    marginBottom: "20px",
    width: "100%",
  },
  tab: {
    flex: 1,
    padding: "15px",
    fontSize: "16px",
    cursor: "pointer",
    backgroundColor: "#e0f7fa",
    border: "1px solid #ccc",
    outline: "none",
    borderRadius: "0px",
    textAlign: "center",
    transition: "background-color 0.3s ease",
    margin: "0 10px",
  },
  activeTab: {
    backgroundColor: "#3f51b5",
    color: "white",
    border: "none",
  },
  dropdownContainer: {
    marginBottom: "15px",
    width: "100%",
  },
  label: {
    display: "block",
    marginBottom: "5px",
    fontSize: "16px",
    color: "#555",
  },
  dropdown: {
    width: "100%",
    padding: "10px",
    fontSize: "16px",
    borderRadius: "4px",
    border: "1px solid #ccc",
    outline: "none",
    boxSizing: "border-box",
  },
  questionsContainer: {
    marginTop: "20px",
    width: "100%",
  },
  question: {
    marginBottom: "20px",
    padding: "15px",
    border: "1px solid #ccc",
    borderRadius: "8px",
    backgroundColor: "#f9f9f9",
  },
  questionText: {
    fontSize: "16px",
    marginBottom: "10px",
    color: "#333",
  },
  radioGroup: {
    display: "flex",
    justifyContent: "flex-start",
  },
  radioLabel: {
    fontSize: "16px",
    color: "#555",
    marginRight: "30px",
  },
  radioInput: {
    marginRight: "5px",
  },
  submitButton: {
    marginTop: "20px",
    padding: "10px 20px",
    backgroundColor: "#e0f7fa",
    border: "2px solid #3f51b5",
    color: "black",
    fontSize: "16px",
    cursor: "pointer",
    borderRadius: "5px",
    transition: "background-color 0.3s ease",
  },
  popupOverlay: {
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  popup: {
    backgroundColor: "white",
    padding: "20px",
    borderRadius: "8px",
    textAlign: "center",
    width: "300px",
  },
  okButton: {
    marginTop: "10px",
    padding: "10px 20px",
    backgroundColor: "#3f51b5",
    color: "white",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
  },
  userIdText: {
    marginBottom: "20px",
    fontWeight: "bold",
    fontSize: "17px",
    marginTop: "-15px",
  },
  // Responsive styles
  "@media (max-width: 600px)": {
    tab: {
      padding: "12px",
      fontSize: "14px",
    },
    dropdown: {
      padding: "8px",
      fontSize: "14px",
    },
    label: {
      fontSize: "14px",
    },
    questionText: {
      fontSize: "14px",
    },
    submitButton: {
      padding: "8px 15px",
      fontSize: "14px",
    },
  },
};

export default StudentFeedback;
