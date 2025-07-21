import React from 'react';
import { CardContent } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Edit, Trash2 } from 'lucide-react';
import { iosButtonStyle } from '@/pages/Sites';

const EntityTable = ({ sites, loading, onEdit, onDelete }) => {
  if (loading) {
    return <CardContent><p className="text-center text-gray-400 py-4">Loading entities...</p></CardContent>;
  }

  if (!sites || sites.length === 0) {
    return <CardContent><p className="text-center text-gray-400 py-4">No entities found. Click "Add New Entity" to get started.</p></CardContent>;
  }

  return (
    <CardContent>
      <div className="overflow-x-auto">
        <Table>
          <TableHeader className="ios-table-header">
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Parent</TableHead>
              <TableHead>Client</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody className="dark-table-row-hover">
            {sites.map((site) => (
              <TableRow key={site.id}>
                <TableCell className="font-medium text-white">{site.name}</TableCell>
                <TableCell>{site.type ? site.type.charAt(0).toUpperCase() + site.type.slice(1).replace('_', ' ') : 'N/A'}</TableCell>
                <TableCell>{site.parent_name || 'N/A'}</TableCell>
                <TableCell>{site.client_name || 'N/A'}</TableCell>
                <TableCell className="text-right space-x-1 md:space-x-2">
                  <Button variant="ghost" size="icon" onClick={() => onEdit(site)} className={`hover:bg-blue-500/20 text-blue-400 ${iosButtonStyle} p-1.5 md:p-2 h-auto md:h-8 w-auto md:w-8`}>
                    <Edit className="w-3.5 h-3.5 md:w-4 md:h-4" />
                  </Button>
                  <Button variant="ghost" size="icon" onClick={() => onDelete(site.id)} className={`hover:bg-red-500/20 text-red-400 ${iosButtonStyle} p-1.5 md:p-2 h-auto md:h-8 w-auto md:w-8`}>
                    <Trash2 className="w-3.5 h-3.5 md:w-4 md:h-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </CardContent>
  );
};

export default EntityTable;