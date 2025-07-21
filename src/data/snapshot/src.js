import { appJsxContent } from './content/app_jsx.js';
import { mainJsxContent } from './content/main_jsx.js';
import { indexCssContent } from './content/index_css.js';
import { codeViewerContent } from './content/code_viewer_jsx.js';
import { fileTreeContent } from './content/file_tree_jsx.js';

const appJsx = {
    name: "App.jsx",
    type: "file",
    content: appJsxContent
};

const mainJsx = {
    name: "main.jsx",
    type: "file",
    content: mainJsxContent
};

const indexCss = {
    name: "index.css",
    type: "file",
    content: indexCssContent
};

const codeViewer = {
    name: "CodeViewer.jsx",
    type: "file",
    content: codeViewerContent
};

const fileTree = {
    name: "FileTree.jsx",
    type: "file",
    content: fileTreeContent
};

const developerFolder = {
    name: "developer",
    type: "folder",
    children: [codeViewer, fileTree]
};

const componentsFolder = {
    name: "components",
    type: "folder",
    children: [developerFolder]
};

export const srcFiles = {
    name: "src",
    type: "folder",
    children: [
        appJsx,
        mainJsx,
        indexCss,
        componentsFolder
    ]
};