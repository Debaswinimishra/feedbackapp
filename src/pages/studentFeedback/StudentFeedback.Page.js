import React, { useState } from "react";
import {
  getStudentListForFeedback,
  getAllFeedbackQuestions,
  saveFeedback,
} from "./StudentFeedback.Api";

const StudentFeedback = () => {
  const [selectedClass, setSelectedClass] = useState("");
  const [activeTab, setActiveTab] = useState(1);
  const [selectedYear, setSelectedYear] = useState("");
  const [selectedMonth, setSelectedMonth] = useState("");
  const [questions, setQuestions] = useState([]);
  const [studentData, setStudentData] = useState([]);
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

  const handleYearChange = (e) => {
    setSelectedYear(e.target.value);
    setSelectedMonth("");
    setSelectedClass("");
  };
  const handleMonthChange = (e) => {
    setSelectedMonth(e.target.value);
    setSelectedClass("");
  };
  const handleTabChange = (tab) => setActiveTab(tab);

  const handleClassChange = (e) => {
    setSelectedClass(e.target.value);

    const data = {
      year: selectedYear,
      month: selectedMonth,
      clas: e.target.value,
      biweek: activeTab,
      consultantId: userId,
    };
    getStudentListForFeedback(data);
    getAllFeedbackQuestions()
      .then((res) => {
        if (res.status === 200) {
          setQuestions(res.data);
        } else {
          alert("No data is found for the selected fields!");
        }
      })
      .catch((error) => {
        console.error("The error is -------->", error);
      });
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
  },
};

export default StudentFeedback;
