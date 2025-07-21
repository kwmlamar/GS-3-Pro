const escapeContent = (content) => {
    if (!content) return '';
    return content.replace(/\\/g, '\\\\').replace(/`/g, '\\`').replace(/\$\{/g, '\\${');
};

const reportRoutes_jsx = {
  name: "reportRoutes.jsx",
  type: "file",
  content: escapeContent(`
import React from 'react';
import { Route, Navigate } from 'react-router-dom';
import ReportsLayout from '@/pages/Reports';
import ReportList from '@/pages/reports/ReportList';
import ViolationList from '@/pages/reports/ViolationList';
import ObservationList from '@/pages/reports/ObservationList';
import TemplateList from '@/pages/reports/TemplateList';

const reportRoutes = (
  <Route path="reports" element={<ReportsLayout />}>
    <Route index element={<Navigate to="list" replace />} />
    <Route path="list" element={<ReportList />} />
    <Route path="violations" element={<ViolationList />} />
    <Route path="observations" element={<ObservationList />} />
    <Route path="templates" element={<TemplateList />} />
  </Route>
);

export default reportRoutes;
`)
};

export const routesFolder = {
    name: "routes",
    type: "folder",
    children: [reportRoutes_jsx]
};