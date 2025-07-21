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
        style={{ paddingLeft: `${level * 1.25 + 0.5}rem` }}
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