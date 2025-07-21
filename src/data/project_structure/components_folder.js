import { componentsDeveloperFolder } from "./components_developer_folder.js";
import { componentsUiFolder } from "./components_ui_folder.js";

const Header_jsx = {
    name: "Header.jsx",
    type: "file",
    content: `// Content not available`
};
const Layout_jsx = {
    name: "Layout.jsx",
    type: "file",
    content: `// Content not available`
};
const Sidebar_jsx = {
    name: "Sidebar.jsx",
    type: "file",
    content: `// Content not available`
};
const PerformanceTicker_jsx = {
    name: "PerformanceTicker.jsx",
    type: "file",
    content: `// Content not available`
};

const isoFolder = {
    name: "iso",
    type: "folder",
    children: [
        { name: "AuditItem.jsx", type: "file", content: `// Content not available` },
        { name: "ISOStandardCard.jsx", type: "file", content: `// Content not available` },
        { name: "InspectionItem.jsx", type: "file", content: `// Content not available` },
        { name: "ReportTemplateItem.jsx", type: "file", content: `// Content not available` },
    ]
};

const schedulingFolder = {
    name: "scheduling",
    type: "folder",
    children: [
        { name: "ComplianceCheckCard.jsx", type: "file", content: `// Content not available` },
        { name: "OnboardingQueueItem.jsx", type: "file", content: `// Content not available` },
        { name: "ScheduleItem.jsx", type: "file", content: `// Content not available` },
        { name: "YearlyEventItem.jsx", type: "file", content: `// Content not available` },
    ]
};

const sitesFolder = {
    name: "sites",
    type: "folder",
    children: [
        { name: "EntityForm.jsx", type: "file", content: `// Content not available` },
        { name: "EntityTable.jsx", type: "file", content: `// Content not available` },
        { name: "HierarchyDashboardTab.jsx", type: "file", content: `// Content not available` },
    ]
};

export const componentsFolder = {
    name: "components",
    type: "folder",
    children: [
        Header_jsx,
        Layout_jsx,
        Sidebar_jsx,
        PerformanceTicker_jsx,
        componentsDeveloperFolder,
        componentsUiFolder,
        isoFolder,
        schedulingFolder,
        sitesFolder
    ]
};