import { Navigate, Route, Routes, Outlet } from "react-router-dom";

import ExaminatPage from "./examinats/ExaminatPage";
import CoursePage from "./courses/CoursePage";
import TopicsPage from "./topics/TopicsPage";
import QuestionLevelsPage from "./questionlevels/QuestionLevelsPage";
import ExamAreasPage from "./examareas/ExamAreasPage";
import PapersPage from "./papers/PapersPage";
import ExamsPage from "./exams/ExamsPage";
import CourseTopicsPage from "./courses/CourseTopicsPage";
import TopicsQuestionLevelPage from "./topics/TopicsQuestionLevelPage";
import QuestionsPage from "./questions/QuestionsPage";
import QuestionLevelsListQuestionPage from "./questionlevels/QuestionLevelsListQuestionPage";
import ExamDetailPage from "./exams/ExamDetailPage";
import ExamResultPage from "./exams/ExamResultPage";
import ActivationCodePage from "./activation-code/ActivationCodePage";
import UserCoursesPage from "./user-courses/UserCoursesPage";
import UserCoursesWaitActivePage from "./user-courses/UserCoursesWaitActivePage";
import UserPapersPage from "./userpapers/UserPapersPage";
import VietQRLogsPage from "./vietqrlogs/VietQRLogsPage";
const GeneralPage = () => {
  return (
    <Routes>
      <Route element={<Outlet />}>
        <Route path="examinats" element={<ExaminatPage />} />
        <Route path="courses" element={<CoursePage />} />
        <Route path="vietqrlogs" element={<VietQRLogsPage />} />

        <Route path="courses/topics" element={<CourseTopicsPage />} />
        <Route
          path="courses/topics/questionlevels"
          element={<TopicsQuestionLevelPage />}
        />
        <Route
          path="courses/topics/questionlevels/questions"
          element={<QuestionLevelsListQuestionPage />}
        />
        <Route path="topics" element={<TopicsPage />} />
        <Route
          path="topics/questionlevels"
          element={<TopicsQuestionLevelPage />}
        />
        <Route
          path="topics/questionlevels/questions"
          element={<QuestionLevelsListQuestionPage />}
        />
        <Route path="questionlevels" element={<QuestionLevelsPage />} />
        <Route
          path="questionlevels/questions"
          element={<QuestionLevelsListQuestionPage />}
        />
        <Route path="questions" element={<QuestionsPage />} />
        <Route path="examareas" element={<ExamAreasPage />} />
        <Route path="papers" element={<PapersPage />} />
        <Route path="exams" element={<ExamsPage />} />
        <Route path="exams/detail" element={<ExamDetailPage />} />
        <Route path="exams/result" element={<ExamResultPage />} />
        <Route path="activationcodes" element={<ActivationCodePage />} />
        <Route path="usercourses" element={<UserCoursesPage />} />
        <Route path="wait-courses" element={<UserCoursesWaitActivePage />} />
        <Route path="userpapers" element={<UserPapersPage />} />

        <Route path="*" element={<Navigate to="/error/404/system" />} />
        <Route
          index
          element={<Navigate to="/systems/company-info/overview" />}
        />
      </Route>
    </Routes>
  );
};

export default GeneralPage;
