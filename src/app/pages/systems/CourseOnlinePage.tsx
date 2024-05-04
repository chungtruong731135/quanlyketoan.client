import { Navigate, Route, Routes, Outlet } from "react-router-dom";

import CourseOnlinePage from "./course-onlines/CourseOnlinePage";
import CourseTopicsPage from "./course-onlines/CourseTopicsPage";
import ClassOnlinePage from "./course-onlines-classes/ClassOnlinePage";
import ClassSessionsPage from "./course-onlines-classes/ClassSessionsPage";
import CourseSessionsPage from "./course-onlines-sessions/CourseSessionsPage";
import SessionAssignmentPage from "./course-onlines-sessions/SessionAssignmentPage";
const GeneralPage = () => {
  return (
    <Routes>
      <Route element={<Outlet />}>
        <Route path="courses" element={<CourseOnlinePage />} />
        <Route path="courses/classes" element={<CourseTopicsPage />} />
        <Route
          path="courses/classes/sessions"
          element={<ClassSessionsPage />}
        />
        <Route
          path="courses/classes/sessions/assignments"
          element={<SessionAssignmentPage />}
        />
        <Route path="course-classes" element={<ClassOnlinePage />} />
        <Route path="course-classes/sessions" element={<ClassSessionsPage />} />
        <Route
          path="course-classes/sessions/assignments"
          element={<SessionAssignmentPage />}
        />
        <Route path="class-sessions" element={<CourseSessionsPage />} />
        <Route
          path="class-sessions/assignments"
          element={<SessionAssignmentPage />}
        />
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
