import React, { useState } from "react";
import Swal from "sweetalert2";

const StudentFeedback = () => {
  const [selectedClass, setSelectedClass] = useState("");
  const [activeTab, setActiveTab] = useState(1);
  const [selectedYear, setSelectedYear] = useState("");
  const [selectedMonth, setSelectedMonth] = useState("");
  const [gkQuestions, setGkQuestions] = useState([]);
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

  const dummyQuestions = [
    { id: 1, text: "Is the sky blue?" },
    { id: 2, text: "Do fish swim?" },
    { id: 3, text: "Is the earth round?" },
  ];

  const handleYearChange = (e) => {
    setSelectedYear(e.target.value);
    setSelectedMonth("");
    setSelectedClass("");
    setGkQuestions([]);
  };

  const handleMonthChange = (e) => {
    setSelectedMonth(e.target.value);
    setSelectedClass("");
    setGkQuestions([]);
  };

  const handleTabChange = (tab) => setActiveTab(tab);

  const handleClassChange = (e) => {
    setSelectedClass(e.target.value);
    setGkQuestions(dummyQuestions); // Set dummy GK questions directly
  };

  const handleSubmit = () => {
    Swal.fire({
      title: "Quiz Submitted Successfully!",
      icon: "success",
      toast: true,
      position: "top-end",
      timer: 3000,
      showConfirmButton: false,
    });

    setSelectedClass("");
    setSelectedYear("");
    setSelectedMonth("");
    setGkQuestions([]);
  };

  return (
    <div style={styles.container}>
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

      {/* Show GK questions after class is selected */}
      {selectedYear &&
        selectedMonth &&
        selectedClass &&
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
                      style={styles.radioInput}
                    />{" "}
                    Yes
                  </label>
                  <label style={styles.radioLabel}>
                    <input
                      type="radio"
                      name={`question-${question.id}`}
                      value="no"
                      style={styles.radioInput}
                    />{" "}
                    No
                  </label>
                </div>
              </div>
            ))}
          </div>
        )}

      {/* Submit Button */}
      {selectedYear &&
        selectedMonth &&
        selectedClass &&
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
