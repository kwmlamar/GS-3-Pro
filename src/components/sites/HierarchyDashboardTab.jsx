import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { BarChart3, Package, Layers, Globe } from 'lucide-react';
import { iosInputStyle } from '@/pages/Sites';

const iconMap = {
  site: Package,
  region: Layers,
  national: Globe,
  global: Globe, 
};

const HierarchyDashboardTab = ({ title, parentTypeForSelection, childTypeToDisplay, allSites, loading, selectedParent, setSelectedParent, getDashboardData }) => {
  const { toast } = useToast();
  const parentEntities = allSites.filter(s => s.type === parentTypeForSelection);
  const data = getDashboardData(parentTypeForSelection, childTypeToDisplay);
  const IconComponent = iconMap[parentTypeForSelection] || BarChart3;

  return (
    <Card className="ios-card">
      <CardHeader>
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
          <CardTitle className="text-xl text-white flex items-center mb-2 sm:mb-0">
            <IconComponent className="w-5 h-5 mr-2 text-blue-400" />
            {title}
          </CardTitle>
          {parentEntities.length > 0 && (
            <Select 
              onValueChange={(value) => setSelectedParent(value === 'none' ? null : parseInt(value))} 
              value={selectedParent || 'none'}
            >
              <SelectTrigger className={`${iosInputStyle} w-full sm:w-auto sm:max-w-xs`}>
                <SelectValue placeholder={`Select ${parentTypeForSelection}...`} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">Overview (All {parentTypeForSelection}s)</SelectItem>
                {parentEntities.map(p => <SelectItem key={p.id} value={p.id.toString()}>{p.name}</SelectItem>)}
              </SelectContent>
            </Select>
          )}
        </div>
        <CardDescription className="text-gray-400 mt-2">
          {selectedParent ? `Data for children of ${allSites.find(s => s.id === selectedParent)?.name || parentTypeForSelection}.` : `Overview of all ${childTypeToDisplay}s under ${parentTypeForSelection}s.`}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {loading ? <p className="text-center text-gray-400 py-4">Loading data...</p> :
         data.length === 0 ? (
          <div className="text-center py-12 min-h-[200px] flex flex-col items-center justify-center">
            <BarChart3 className="w-12 h-12 mx-auto text-slate-500 mb-3 opacity-70" />
            <p className="text-gray-400">No {childTypeToDisplay} data to display for {selectedParent ? allSites.find(s => s.id === selectedParent)?.name : `the selected ${parentTypeForSelection}`}.</p>
            {!selectedParent && parentEntities.length > 0 && <p className="text-sm text-slate-500 mt-1">Select a {parentTypeForSelection} from the dropdown to see its children.</p>}
            {parentEntities.length === 0 && <p className="text-sm text-slate-500 mt-1">No {parentTypeForSelection} entities exist to display data for.</p>}
          </div>
         ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {data.map(item => (
              <Card key={item.id} className="bg-slate-800/50 border-slate-700 hover-lift">
                <CardHeader>
                  <CardTitle className="text-lg text-sky-300">{item.name}</CardTitle>
                  <CardDescription className="text-slate-400">{item.type ? item.type.charAt(0).toUpperCase() + item.type.slice(1).replace('_', ' ') : 'N/A'}</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-xs text-slate-500">Address: {item.address ? JSON.stringify(item.address) : 'N/A'}</p>
                  <p className="text-xs text-slate-500 mt-1">Client: {item.client_name || 'N/A'}</p>
                  <Button size="sm" variant="link" className="text-blue-400 hover:text-blue-300 p-0 mt-2 text-xs" onClick={() => toast({title: "🚧 Feature Not Implemented"})}>View Details</Button>
                </CardContent>
              </Card>
            ))}
          </div>
         )
        }
        <div className="text-center py-8 mt-4 border-t border-slate-700">
          <BarChart3 className="w-10 h-10 mx-auto text-slate-600 mb-2 opacity-50" />
          <p className="text-gray-500 text-sm">AI-powered charts and aggregated analytics will appear here.</p>
        </div>
      </CardContent>
    </Card>
  );
};

export default HierarchyDashboardTab;