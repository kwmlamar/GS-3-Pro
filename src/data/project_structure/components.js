const escapeContent = (content) => {
    if (!content) return '';
    return content.replace(/\\/g, '\\\\').replace(/`/g, '\\`').replace(/\$\{/g, '\\${');
};

const CodeViewer_jsx = {
  name: "CodeViewer.jsx",
  type: "file",
  content: escapeContent(`
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Loader2, AlertTriangle, Code } from 'lucide-react';

const CodeViewer = ({ file }) => {
  const [content, setContent] = useState('Select a file to view its content.');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (file) {
      setIsLoading(true);
      setError(null);
      
      setTimeout(() => {
        if (file.content) {
          setContent(file.content);
        } else {
          setError('File content is not available or could not be loaded.');
          setContent('');
        }
        setIsLoading(false);
      }, 200);
    }
  }, [file]);

  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="flex flex-col items-center justify-center h-full text-slate-400">
          <Loader2 className="w-8 h-8 animate-spin mb-4" />
          <p>Loading file content...</p>
        </div>
      );
    }
    if (error) {
      return (
        <div className="flex flex-col items-center justify-center h-full text-yellow-400">
          <AlertTriangle className="w-8 h-8 mb-4" />
          <p>{error}</p>
        </div>
      );
    }
    if (!file) {
        return (
             <div className="flex flex-col items-center justify-center h-full text-slate-400">
                <Code className="w-12 h-12 mb-4 text-sky-400" />
                <h3 className="text-lg font-semibold text-white">Select a file</h3>
                <p>Choose a file from the tree on the left to view its source code.</p>
            </div>
        )
    }
    return (
      <pre className="p-4"><code className="text-sm">{content}</code></pre>
    );
  };

  return (
    <div className="bg-slate-900/70 text-white font-mono rounded-lg h-full overflow-auto scrollbar-thin scrollbar-thumb-slate-700 scrollbar-track-slate-800/50">
      {renderContent()}
    </div>
  );
};

export default CodeViewer;
`)
};

const FileTree_jsx = {
  name: "FileTree.jsx",
  type: "file",
  content: escapeContent(`
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { File, Folder, ChevronRight, ChevronDown, Loader2 } from 'lucide-react';
import { projectFiles } from '@/data/projectFiles.js';

const FileNode = ({ node, onFileSelect, level = 0 }) => {
  const [isOpen, setIsOpen] = useState(level < 1);

  const handleToggle = () => {
    if (node.type === 'folder') {
      setIsOpen(!isOpen);
    } else {
      onFileSelect(node);
    }
  };

  const isFolder = node.type === 'folder';

  return (
    <div>
      <div
        onClick={handleToggle}
        className="flex items-center p-1.5 rounded-md hover:bg-slate-700/50 cursor-pointer transition-colors"
        style={{ paddingLeft: \`\${level * 1.25 + 0.5}rem\` }}
      >
        {isFolder ? (
          isOpen ? <ChevronDown className="w-4 h-4 mr-2 flex-shrink-0" /> : <ChevronRight className="w-4 h-4 mr-2 flex-shrink-0" />
        ) : (
          <File className="w-4 h-4 mr-2 flex-shrink-0 text-sky-400" />
        )}
        {isFolder ? (
          <Folder className="w-4 h-4 mr-2 flex-shrink-0 text-yellow-400" />
        ) : null}
        <span className="text-sm text-slate-300 truncate">{node.name}</span>
      </div>
      <AnimatePresence>
        {isFolder && isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            {node.children.map((childNode, index) => (
              <FileNode key={index} node={childNode} onFileSelect={onFileSelect} level={level + 1} />
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const FileTree = ({ onFileSelect }) => {
  const [fileStructure, setFileStructure] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      setFileStructure(projectFiles);
      setIsLoading(false);
    }, 100);
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full text-slate-400">
        <Loader2 className="w-6 h-6 animate-spin mr-2" />
        <span>Loading Project...</span>
      </div>
    );
  }

  return (
    <div className="bg-slate-800/50 text-white rounded-lg p-2 h-full overflow-y-auto border-r border-slate-700">
      {fileStructure.map((node, index) => (
        <FileNode key={index} node={node} onFileSelect={onFileSelect} />
      ))}
    </div>
  );
};

export default FileTree;
`)
};

const componentsDeveloperFolder = {
  name: "developer",
  type: "folder",
  children: [CodeViewer_jsx, FileTree_jsx]
};

const otherUiComponents = [
    { name: "avatar.jsx", content: `// Content not available` },
    { name: "button.jsx", content: `// Content not available` },
    { name: "card.jsx", content: `// Content not available` },
    { name: "input.jsx", content: `// Content not available` },
    { name: "label.jsx", content: `// Content not available` },
    { name: "select.jsx", content: `// Content not available` },
    { name: "switch.jsx", content: `// Content not available` },
    { name: "table.jsx", content: `// Content not available` },
    { name: "textarea.jsx", content: `// Content not available` },
    { name: "toast.jsx", content: `// Content not available` },
    { name: "toaster.jsx", content: `// Content not available` },
    { name: "use-toast.js", content: `// Content not available` },
].map(c => ({ ...c, type: 'file' }));

const tabs_jsx = {
  name: "tabs.jsx",
  type: "file",
  content: escapeContent(`
import React from 'react';
import * as TabsPrimitive from '@radix-ui/react-tabs';
import { cn } from '@/lib/utils';

const Tabs = TabsPrimitive.Root;

const TabsList = React.forwardRef(({ className, ...props }, ref) => (
  <TabsPrimitive.List
    ref={ref}
    className={cn(
      'inline-flex h-auto items-center justify-center rounded-md bg-muted p-1 text-muted-foreground',
      className
    )}
    {...props}
  />
));
TabsList.displayName = TabsPrimitive.List.displayName;

const TabsTrigger = React.forwardRef(({ className, ...props }, ref) => (
  <TabsPrimitive.Trigger
    ref={ref}
    className={cn(
      'inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm',
      className
    )}
    {...props}
  />
));
TabsTrigger.displayName = TabsPrimitive.Trigger.displayName;

const TabsContent = React.forwardRef(({ className, ...props }, ref) => (
  <TabsPrimitive.Content
    ref={ref}
    className={cn(
      'mt-2 ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
      className
    )}
    {...props}
  />
));
TabsContent.displayName = TabsPrimitive.Content.displayName;

export { Tabs, TabsList, TabsTrigger, TabsContent };
`)
};

const componentsUiFolder = {
  name: "ui",
  type: "folder",
  children: [tabs_jsx, ...otherUiComponents]
};

export const componentsFolder = {
  name: "components",
  type: "folder",
  children: [
    { name: "Header.jsx", type: "file", content: `// Content not available` },
    { name: "Layout.jsx", type: "file", content: `// Content not available` },
    { name: "PerformanceTicker.jsx", type: "file", content: `// Content not available` },
    { name: "Sidebar.jsx", type: "file", content: `// Content not available` },
    componentsDeveloperFolder, 
    componentsUiFolder
  ]
};