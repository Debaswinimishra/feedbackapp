import React, { useState, useEffect } from "react";
import Swal from "sweetalert2";
import {
  getStudentListForFeedback,
  getAllFeedbackQuestions,
  saveFeedback,
  getAllSchoolsClusterwise,
  getAllocatedClusters,
} from "./StudentFeedback.Api";

const StudentFeedback = () => {
  const [selectedClass, setSelectedClass] = useState("");
  const [selectedCluster, setSelectedCluster] = useState("");
  const [selectedSchool, setSelectedSchool] = useState("");
  const [activeTab, setActiveTab] = useState(1);
  const [selectedYear, setSelectedYear] = useState("");
  const [selectedMonth, setSelectedMonth] = useState("");
  const [questions, setQuestions] = useState([]);
  const [clusterOptions, setClusterOptions] = useState([]);
  const [schoolOptions, setSchoolsOptions] = useState([]);
  const [gkQuestions, setGkQuestions] = useState([]);
  const [answers, setAnswers] = useState({});
  const [selectedStudent, setSelectedStudent] = useState("");
  const [studentOptions, setStudentOptions] = useState([]);

  const userId = localStorage.getItem("userid"); //This is only my consultantId

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

  const currentYear = new Date().getFullYear();
  const currentMonth = new Date().getMonth() + 1; // Month is 0-indexed

  useEffect(() => {
    if (selectedMonth && selectedYear && userId) {
      const data = {
        year: parseInt(selectedYear),
        month: parseInt(selectedMonth),
        consultantId: userId,
      };
      console.log("data sent----------->", data);
      getAllocatedClusters(data)
        .then((res) => {
          if (res.status === 200) {
            console.log("res.data------------>", res.data);
            setClusterOptions(res.data);
          } else {
            console.log("The status got ---------->", res.status);
          }
        })
        .catch((error) => {
          console.error("The error encountered----------->", error);
        });
    }
  }, [selectedMonth, selectedYear]);

  const handleYearChange = (e) => {
    setSelectedYear(e.target.value);
    setSelectedMonth("");
    setSelectedClass("");
    setGkQuestions([]);
    setAnswers({});
    setSelectedStudent("");
  };

  const handleMonthChange = (e) => {
    if (selectedYear == currentYear && e.target.value > currentMonth) {
      alert("You can't select a month beyond the current month!");
    } else {
      setSelectedMonth(e.target.value);
      setSelectedClass("");
      setSelectedStudent("");
    }
    setGkQuestions([]);
    setAnswers({});
  };

  const handleTabChange = (tab) => setActiveTab(tab);

  const handleClusterChange = (e) => {
    setSelectedCluster(e.target.value);
    setGkQuestions([]);
    setAnswers({});
    getAllSchoolsClusterwise(e.target.value)
      .then((res) => {
        if (res.status === 200) {
          setSchoolsOptions(res.data);
        } else {
          console.log("The status got ---------->", res.status);
        }
      })
      .catch((error) => {
        console.error(
          "The error encountered while fetching schools------->",
          error
        );
      });
  };
  const handleSchoolChange = (e) => {
    setSelectedSchool(e.target.value);
    setGkQuestions([]);
    setAnswers({});
  };
  const handleClassChange = (e) => {
    setSelectedClass(e.target.value);

    setAnswers({});
    setSelectedStudent("");
    const data = {
      year: selectedYear,
      month: selectedMonth,
      clas: e.target.value,
      biweek: activeTab,
      consultantId: userId,
    };
    getStudentListForFeedback(data)
      .then((res) => {
        if (res.status === 200) {
          setStudentOptions(res.data);
        } else {
          setStudentOptions([]);
        }
      })
      .catch((error) =>
        console.error(
          "The error encountered while getting the students------>",
          error
        )
      );
  };

  const handleStudentChange = (e) => {
    setSelectedStudent(e.target.value);
    setGkQuestions(dummyQuestions);
    // getAllFeedbackQuestions()
    //   .then((res) => {
    //     if (res.status === 200) {
    //       setQuestions(res.data);
    //     } else {
    //       alert("No data is found for the selected fields!");
    //     }
    //   })
    //   .catch((error) => {
    //     console.error("The error is -------->", error);
    //   });
  };

  const handleAnswerChange = (questionId, answer) => {
    setAnswers((prevAnswers) => ({
      ...prevAnswers,
      [questionId]: answer,
    }));
  };

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

          setStudentOptions(updatedStudents); // Update student options
        }
        // Reset states after submission
        setSelectedCluster("");
        setSelectedSchool("");
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
        <label style={styles.label}>Select Cluster:</label>
        <select
          style={styles.dropdown}
          value={selectedCluster}
          onChange={handleClusterChange}
        >
          <option value="" disabled>
            --Select Cluster--
          </option>
          {selectedYear &&
            selectedMonth &&
            clusterOptions.map((clusterOption, index) => (
              <option key={index} value={clusterOption?.cluster}>
                {clusterOption?.cluster}
              </option>
            ))}
        </select>
      </div>
      <div style={styles.dropdownContainer}>
        <label style={styles.label}>Select School:</label>
        <select
          style={styles.dropdown}
          value={selectedSchool}
          onChange={handleSchoolChange}
        >
          <option value="" disabled>
            --Select School--
          </option>
          {selectedYear &&
            selectedMonth &&
            selectedCluster &&
            schoolOptions.map((schoolOption) => (
              <option key={schoolOption} value={schoolOption}>
                School {schoolOption}
              </option>
            ))}
        </select>
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
            selectedCluster &&
            selectedSchool &&
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
          {studentOptions.length > 0 ? (
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
          ) : (
            <select style={styles.dropdown} disabled>
              <option value="">No students available</option>
            </select>
          )}
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
