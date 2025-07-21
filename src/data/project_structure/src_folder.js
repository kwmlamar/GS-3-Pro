import { componentsFolder } from "./components_folder.js";
import { dataFolder } from "./data_folder.js";
import { libFolder } from "./lib_folder.js";
import { pagesFolder } from "./pages_folder.js";
import { routesFolder } from "./routes_folder.js";

const App_jsx = { name: "App.jsx", type: "file", content: `// Content of App.jsx` };
const main_jsx = { name: "main.jsx", type: "file", content: `// Content of main.jsx` };
const index_css = { name: "index.css", type: "file", content: `/* Content not available */` };

export const srcFolder = {
    name: "src",
    type: "folder",
    children: [
        componentsFolder,
        dataFolder,
        libFolder,
        pagesFolder,
        routesFolder,
        App_jsx,
        main_jsx,
        index_css
    ]
};