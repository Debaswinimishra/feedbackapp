import api from "../../api/api";

//*To fetch my students under my consultantId
export const getStudentListForFeedback = async (data) => {
  return await api.get(
    `/getAllocatedStudents/${data.year}/${data.month}/${data.biweek}/${data.consultantId}/${data.clas}`
  );
};

//* To fetch all the questions.
export const getAllFeedbackQuestions = async () => {
  return await api.get("/getAllFeedbackQuestions");
};

//* To save the feedback of the student
export const saveFeedback = async (body) => {
  return await api.post("/saveParentsFeedback");
};
