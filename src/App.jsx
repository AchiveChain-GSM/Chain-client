// src/App.jsx
import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

import ProtectedRoute from './components/ProtectedRoute';

import Login from './pages/Login.jsx';
import Timeline from './pages/Timeline.jsx';
import Search from './pages/Search.jsx';
import Upload from './pages/Upload.jsx';
import PostDetail from './pages/PostDetail.jsx';

import Bookmark from './pages/Bookmark.jsx';
import MyData from './pages/mydata.jsx';
import Recent from './pages/Recent.jsx';
import RecentPost from './pages/RecentPosts.jsx';
import Findps from './pages/Findps.jsx';

import Signup from './pages/signup/Signup.jsx';
import VerifyEmail from './pages/VerifyEmail.jsx';
import PostEditView from './components/postDetail/PostEditView.jsx'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* ✅ 공개 페이지 */}
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/verify-email" element={<VerifyEmail />} />

        {/* 필요하면 비번찾기 같은 것도 공개 */}
        <Route path="/find-password" element={<Findps />} />

        {/* ✅ 로그인 필수: 타임라인/검색/글작성/상세/마이/북마크 등 */}
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Timeline />
            </ProtectedRoute>
          }
        />

        <Route
          path="/timeline"
          element={
            <ProtectedRoute>
              <Timeline />
            </ProtectedRoute>
          }
        />

        <Route
          path="/search"
          element={
            <ProtectedRoute>
              <Search />
            </ProtectedRoute>
          }
        />

        <Route
          path="/upload"
          element={
            <ProtectedRoute>
              <Upload />
            </ProtectedRoute>
          }
        />

        <Route
          path="/posts/:id"
          element={
            <ProtectedRoute>
              <PostDetail />
            </ProtectedRoute>
          }
        />

        <Route
          path="/bookmark"
          element={
            <ProtectedRoute>
              <Bookmark />
            </ProtectedRoute>
          }
        />

        <Route
          path="/mydata"
          element={
            <ProtectedRoute>
              <MyData />
            </ProtectedRoute>
          }
        />

        <Route
          path="/recent"
          element={
            <ProtectedRoute>
              <Recent />
            </ProtectedRoute>
          }
        />

        <Route
          path="/recent-post"
          element={
            <ProtectedRoute>
              <RecentPost />
            </ProtectedRoute>
          }
        />
        <Route
          path="/posts/:id/edit"
          element={
            <ProtectedRoute>
              <PostEditView />
            </ProtectedRoute>
          }
        />

        {/* ✅ 없는 경로 처리 */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
