const tabs_jsx = {
    name: "tabs.jsx",
    type: "file",
    content: `import React from 'react';
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
`
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


export const componentsUiFolder = {
    name: "ui",
    type: "folder",
    children: [
        tabs_jsx,
        ...otherUiComponents
    ]
};