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
  const [answers, setAnswers] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState("");
  const [studentOptions, setStudentOptions] = useState([]);

  const userId = localStorage.getItem("userid"); //This is only my consultantId
  const username = localStorage.getItem("username");

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
  const currentMonth = new Date().getMonth() + 1;

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

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setSelectedCluster("");
    setSelectedSchool("");
    setSelectedClass("");
    setSelectedStudent("");
    setGkQuestions([]);
  };

  const handleClusterChange = (e) => {
    setSelectedCluster(e.target.value);
    setSelectedSchool("");
    setSelectedClass("");
    setSelectedStudent("");
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
    setSelectedClass("");
    setSelectedStudent("");
    setGkQuestions([]);
    setAnswers({});
  };
  const handleClassChange = (e) => {
    setSelectedClass(e.target.value);
    setSelectedStudent("");
    setAnswers({});
    setSelectedStudent("");
    setGkQuestions([]);
    const data = {
      year: parseInt(selectedYear),
      month: parseInt(selectedMonth),
      class: parseInt(e.target.value),
      biweek: parseInt(activeTab),
      consultantId: userId,
      cluster: selectedCluster,
      school_name: selectedSchool,
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
    if (e.target.value) {
      setSelectedStudent(e.target.value);
      setGkQuestions([]);
      getAllFeedbackQuestions()
        .then((res) => {
          if (res.status === 200) {
            setGkQuestions(res.data);
          } else {
            alert("No data is found for the selected fields!");
          }
        })
        .catch((error) => {
          console.error("The error is -------->", error);
        });
    } else {
      setSelectedStudent("");
    }
  };

  const handleAnswerChange = (questionOrder, selectedAnswer) => {
    setAnswers((prevAnswers) => {
      // Ensure prevAnswers is an array, defaulting to an empty array if undefined
      const answersArray = Array.isArray(prevAnswers) ? prevAnswers : [];

      const existingIndex = answersArray.findIndex(
        (item) => item.questionOrder === questionOrder
      );

      // Find the question from gkQuestions based on questionOrder
      const currentQuestion = gkQuestions.find(
        (q) => q.questionOrder === questionOrder
      );

      // Determine the answer based on the selectedAnswer
      const newAnswer = selectedAnswer === "yes" ? "yes" : "no";

      // Create a copy of answersArray to update
      const updatedAnswers = [...answersArray];

      if (existingIndex !== -1) {
        // Update the existing answer
        updatedAnswers[existingIndex] = {
          ...updatedAnswers[existingIndex],
          answer: newAnswer,
        };
      } else if (currentQuestion) {
        // Add new answer with questionOrder and question from gkQuestions
        updatedAnswers.push({
          questionOrder: currentQuestion.questionOrder,
          question: currentQuestion.question,
          answer: newAnswer,
        });
      }

      return updatedAnswers;
    });
  };

  //This will be having my student data that I need for the save function
  const studentName = studentOptions?.filter(
    (item) => item.student_id === selectedStudent
  );

  console.log("studentName--------->", studentName);

  const handleSubmit = () => {
    const allAnswered = answers.length === gkQuestions?.length;
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
        const body = {
          year: parseInt(selectedYear),
          month: parseInt(selectedMonth),
          consultantId: userId,
          consultantName: username,
          student_id: studentName[0]?.student_id,
          student_name: studentName[0]?.student_name,
          feedbackData: answers,
          feedbackStatus: "complete",
          biweek: parseInt(activeTab),
          class: parseInt(selectedClass),
          school_name: selectedSchool,
          cluster: selectedCluster,
        };
        console.log("body sent-------->", body);
        saveFeedback(body)
          .then((res) => {
            if (res.status === 200) {
              console.log("res.status--------->", res.status);
              alert("Succesfully saved feedback response.");
              if (selectedStudent) {
                const updatedStudents = studentOptions.filter(
                  (student) => student.id !== parseInt(selectedStudent)
                );

                setStudentOptions(updatedStudents);
              }
              setSelectedCluster("");
              setSelectedSchool("");
              setSelectedClass("");
              setGkQuestions([]);
              setAnswers({});
              setSelectedStudent("");
            } else {
              console.log("res.status--------->", res.status);
              alert("Response couldn't be saved.Please try again later!");
            }
          })
          .catch((error) => {
            console.error(
              "The error encountered while saving feedback response--------->",
              error
            );
          });
      });
    }
  };

  console.log("answers----------->", answers);

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
            schoolOptions?.map((schoolOption, index) => (
              <option key={index} value={schoolOption?.school_name}>
                {schoolOption?.school_name}
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
              {studentOptions.map((student, index) => (
                <option key={index} value={student.student_id}>
                  {student.student_name}
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
              <div key={index} style={styles.question}>
                <p style={styles.questionText}>
                  {index + 1}. {question?.question}
                </p>
                <div style={styles.radioGroup}>
                  <label style={styles.radioLabel}>
                    <input
                      type="radio"
                      name={`question-${question.questionOrder}`}
                      value="yes"
                      onChange={() =>
                        handleAnswerChange(question.questionOrder, "yes")
                      }
                      style={styles.radioInput}
                    />{" "}
                    Yes
                  </label>
                  <label style={styles.radioLabel}>
                    <input
                      type="radio"
                      name={`question-${question.questionOrder}`}
                      value="no"
                      onChange={() =>
                        handleAnswerChange(question.questionOrder, "no")
                      }
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
    boxShadow:
      "rgba(9, 30, 66, 0.25) 0px 4px 8px -2px, rgba(9, 30, 66, 0.08) 0px 0px 0px 1px",
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
    boxShadow:
      "rgba(0, 0, 0, 0.16) 0px 3px 6px, rgba(0, 0, 0, 0.23) 0px 3px 6px",
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
