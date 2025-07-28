const AdminSettings_jsx = { name: "AdminSettings.jsx", type: "file", content: `// Content of AdminSettings.jsx` };
const Analytics_jsx = { name: "Analytics.jsx", type: "file", content: `// Content of Analytics.jsx` };
const Assessments_jsx = { name: "Assessments.jsx", type: "file", content: `// Content of Assessments.jsx` };
const Dashboard_jsx = { name: "Dashboard.jsx", type: "file", content: `// Content of Dashboard.jsx` };
const DeveloperPage_jsx = { name: "DeveloperPage.jsx", type: "file", content: `// Content of DeveloperPage.jsx` };
const Employees_jsx = { name: "Employees.jsx", type: "file", content: `// Content of Employees.jsx` };
const ExternalApp_jsx = { name: "ExternalApp.jsx", type: "file", content: `// Content of ExternalApp.jsx` };
const HealthSafety_jsx = { name: "HealthSafety.jsx", type: "file", content: `// Content of HealthSafety.jsx` };
const ISO_jsx = { name: "ISO.jsx", type: "file", content: `// Content of ISO.jsx` };
const LiveClasses_jsx = { name: "LiveClasses.jsx", type: "file", content: `// Content of LiveClasses.jsx` };
const Messaging_jsx = { name: "Messaging.jsx", type: "file", content: `// Content of Messaging.jsx` };
const NFCManagement_jsx = { name: "NFCManagement.jsx", type: "file", content: `// Content of NFCManagement.jsx` };
const Reports_jsx = { name: "Reports.jsx", type: "file", content: `// Content of Reports.jsx` };
const Scheduling_jsx = { name: "Scheduling.jsx", type: "file", content: `// Content of Scheduling.jsx` };
const Sites_jsx = { name: "Sites.jsx", type: "file", content: `// Content of Sites.jsx` };
const SecurityCompanies_jsx = { name: "SecurityCompanies.jsx", type: "file", content: `// Content of SecurityCompanies.jsx` };
const Training_jsx = { name: "Training.jsx", type: "file", content: `// Content of Training.jsx` };

const reportsFolder = {
    name: "reports",
    type: "folder",
    children: [
        { name: "ObservationList.jsx", type: "file", content: `// Content not available` },
        { name: "ReportList.jsx", type: "file", content: `// Content not available` },
        { name: "TemplateList.jsx", type: "file", content: `// Content not available` },
        { name: "ViolationList.jsx", type: "file", content: `// Content not available` },
    ]
};

export const pagesFolder = {
    name: "pages",
    type: "folder",
    children: [
        AdminSettings_jsx,
        Analytics_jsx,
        Assessments_jsx,
        Dashboard_jsx,
        DeveloperPage_jsx,
        Employees_jsx,
        ExternalApp_jsx,
        HealthSafety_jsx,
        ISO_jsx,
        LiveClasses_jsx,
        Messaging_jsx,
        NFCManagement_jsx,
        Reports_jsx,
        Scheduling_jsx,
        Sites_jsx,
        SecurityCompanies_jsx,
        Training_jsx,
        reportsFolder
    ]
};