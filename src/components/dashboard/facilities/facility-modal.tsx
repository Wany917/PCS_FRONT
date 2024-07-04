import * as React from 'react';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Button from '@mui/material/Button';
import { FacilityEditForm } from './facility-edit-form';

interface FacilityModalProps {
  open: boolean;
  onClose: () => void;
  facility: {
    id: string;
    name: string;
    description: string;
  };
}

export const FacilityModal: React.FC<FacilityModalProps> = ({ open, onClose, facility }) => {
  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Edit Facility</DialogTitle>
      <DialogContent>
        <FacilityEditForm facility={facility} />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="primary">
          Cancel
        </Button>
      </DialogActions>
    </Dialog>
  );
};
