import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { useToast } from '@/components/ui/use-toast';

const GuideForm = ({ isOpen, setIsOpen, siteId, onSuccess }) => {
  const { toast } = useToast();

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Guide Form</DialogTitle>
          <DialogDescription>
            This feature is not yet implemented.
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
};

export default GuideForm;