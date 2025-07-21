const CodeViewer_jsx = {
    name: "CodeViewer.jsx",
    type: "file",
    content: `import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Loader2, AlertTriangle } from 'lucide-react';

const CodeViewer = ({ file }) => {
  const [content, setContent] = useState('Select a file to view its content.');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (file) {
      setIsLoading(true);
      setError(null);
      setTimeout(() => {
        try {
          if (file.content) {
            setContent(file.content);
          } else {
            setContent('// No content available for this file.');
          }
        } catch (e) {
          setError('Failed to load file content.');
          setContent('');
        } finally {
          setIsLoading(false);
        }
      }, 200);
    }
  }, [file]);

  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="flex items-center justify-center h-full text-slate-400">
          <Loader2 className="w-8 h-8 animate-spin mr-2" />
          <span>Loading file...</span>
        </div>
      );
    }
    if (error) {
      return (
        <div className="flex items-center justify-center h-full text-red-400">
          <AlertTriangle className="w-8 h-8 mr-2" />
          <span>{error}</span>
        </div>
      );
    }
    return (
      <pre className="p-4"><code className="font-mono text-sm">{content}</code></pre>
    );
  };

  return (
    <div className="bg-slate-900/70 text-white h-full overflow-auto scrollbar-thin scrollbar-thumb-slate-700 scrollbar-track-slate-800/50">
      {renderContent()}
    </div>
  );
};

export default CodeViewer;
`
};

const FileTree_jsx = {
    name: "FileTree.jsx",
    type: "file",
    content: `import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { File, Folder, ChevronRight, ChevronDown, Loader2 } from 'lucide-react';
import { projectFiles } from '@/data/projectFiles';

const FileNode = ({ node, onFileSelect, level = 0 }) => {
  const [isOpen, setIsOpen] = useState(level < 1);

  const isFolder = node.type === 'folder';

  const handleToggle = () => {
    if (isFolder) {
      setIsOpen(!isOpen);
    } else {
      onFileSelect(node);
    }
  };

  return (
    <div>
      <div
        onClick={handleToggle}
        className="flex items-center p-1.5 rounded-md cursor-pointer hover:bg-slate-700/50 transition-colors"
        style={{ paddingLeft: \`\${level * 1.25 + 0.5}rem\` }}
      >
        {isFolder ? (
          isOpen ? <ChevronDown size={16} className="mr-2 flex-shrink-0" /> : <ChevronRight size={16} className="mr-2 flex-shrink-0" />
        ) : (
          <File size={16} className="mr-2 flex-shrink-0 text-slate-400" />
        )}
        {isFolder ? <Folder size={16} className="mr-2 text-sky-400" /> : null}
        <span className="truncate text-sm">{node.name}</span>
      </div>
      <AnimatePresence initial={false}>
        {isFolder && isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            {node.children?.map((childNode) => (
              <FileNode key={childNode.name} node={childNode} onFileSelect={onFileSelect} level={level + 1} />
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const FileTree = ({ onFileSelect }) => {
  const [fileStructure, setFileStructure] = useState(null);

  useEffect(() => {
    setFileStructure(projectFiles);
  }, []);

  if (!fileStructure) {
    return (
      <div className="flex items-center justify-center h-full text-slate-400">
        <Loader2 className="w-6 h-6 animate-spin mr-2" />
        <span>Loading Project Structure...</span>
      </div>
    );
  }

  return (
    <div className="p-2 h-full overflow-y-auto scrollbar-thin scrollbar-thumb-slate-700 scrollbar-track-slate-800/50">
      {fileStructure.children.map((node) => (
        <FileNode key={node.name} node={node} onFileSelect={onFileSelect} />
      ))}
    </div>
  );
};

export default FileTree;
`
};

export const componentsDeveloperFolder = {
    name: "developer",
    type: "folder",
    children: [
        CodeViewer_jsx,
        FileTree_jsx
    ]
};