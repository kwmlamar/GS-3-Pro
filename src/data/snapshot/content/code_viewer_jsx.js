export const codeViewerContent = `import React, { useState, useEffect } from 'react';
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
`;