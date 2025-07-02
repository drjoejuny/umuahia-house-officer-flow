
import { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Download, Search, Filter, Trash2 } from "lucide-react";
import { HouseOfficer } from "@/types/HouseOfficer";
import ChartsSection from "@/components/ChartsSection";
import { exportToPDF } from "@/utils/pdfExport";
import { format } from "date-fns";

interface DashboardProps {
  houseOfficers: HouseOfficer[];
  onDelete: (id: string) => void;
}

const Dashboard = ({ houseOfficers, onDelete }: DashboardProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterUnit, setFilterUnit] = useState<string>("all");
  const [filterGender, setFilterGender] = useState<string>("all");
  const [selectedOfficers, setSelectedOfficers] = useState<Set<string>>(new Set());
  const [sortBy, setSortBy] = useState<string>("dateSignedIn");

  const filteredAndSortedOfficers = useMemo(() => {
    let filtered = houseOfficers.filter(officer => {
      const matchesSearch = officer.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           officer.clinicalPresentationTopic.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesUnit = filterUnit === "all" || officer.unitAssigned === filterUnit;
      const matchesGender = filterGender === "all" || officer.gender === filterGender;
      
      return matchesSearch && matchesUnit && matchesGender;
    });

    return filtered.sort((a, b) => {
      switch (sortBy) {
        case "fullName":
          return a.fullName.localeCompare(b.fullName);
        case "dateSignedIn":
          return new Date(b.dateSignedIn).getTime() - new Date(a.dateSignedIn).getTime();
        case "unitAssigned":
          return a.unitAssigned.localeCompare(b.unitAssigned);
        case "clinicalPresentationDate":
          return new Date(a.clinicalPresentationDate).getTime() - new Date(b.clinicalPresentationDate).getTime();
        default:
          return 0;
      }
    });
  }, [houseOfficers, searchTerm, filterUnit, filterGender, sortBy]);

  const units = [...new Set(houseOfficers.map(officer => officer.unitAssigned))];

  const handleSelectOfficer = (officerId: string, checked: boolean) => {
    const newSelected = new Set(selectedOfficers);
    if (checked) {
      newSelected.add(officerId);
    } else {
      newSelected.delete(officerId);
    }
    setSelectedOfficers(newSelected);
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedOfficers(new Set(filteredAndSortedOfficers.map(officer => officer.id)));
    } else {
      setSelectedOfficers(new Set());
    }
  };

  const handleExportPDF = () => {
    const selectedData = filteredAndSortedOfficers.filter(officer => 
      selectedOfficers.has(officer.id)
    );
    
    if (selectedData.length === 0) {
      alert("Please select at least one house officer to export.");
      return;
    }

    exportToPDF(selectedData);
  };

  return (
    <div className="space-y-6">
      {/* Charts Section */}
      <ChartsSection houseOfficers={houseOfficers} />

      {/* Controls */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Controls & Filters
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search by name or presentation topic..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* Filters */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Select value={filterUnit} onValueChange={setFilterUnit}>
              <SelectTrigger>
                <SelectValue placeholder="Filter by unit" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Units</SelectItem>
                {units.map(unit => (
                  <SelectItem key={unit} value={unit}>{unit}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={filterGender} onValueChange={setFilterGender}>
              <SelectTrigger>
                <SelectValue placeholder="Filter by gender" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Genders</SelectItem>
                <SelectItem value="Male">Male</SelectItem>
                <SelectItem value="Female">Female</SelectItem>
              </SelectContent>
            </Select>

            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger>
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="dateSignedIn">Date Signed In</SelectItem>
                <SelectItem value="fullName">Name</SelectItem>
                <SelectItem value="unitAssigned">Unit</SelectItem>
                <SelectItem value="clinicalPresentationDate">Presentation Date</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Export Button */}
          <Button 
            onClick={handleExportPDF}
            className="w-full bg-green-600 hover:bg-green-700"
            disabled={selectedOfficers.size === 0}
          >
            <Download className="h-4 w-4 mr-2" />
            Download Selected as PDF ({selectedOfficers.size} selected)
          </Button>
        </CardContent>
      </Card>

      {/* Data Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>House Officers ({filteredAndSortedOfficers.length})</span>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="select-all"
                checked={selectedOfficers.size === filteredAndSortedOfficers.length && filteredAndSortedOfficers.length > 0}
                onCheckedChange={handleSelectAll}
              />
              <label htmlFor="select-all" className="text-sm font-medium">
                Select All
              </label>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <div className="space-y-4">
              {filteredAndSortedOfficers.map((officer) => (
                <div key={officer.id} className="border rounded-lg p-4 bg-gray-50">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center space-x-3">
                      <Checkbox
                        checked={selectedOfficers.has(officer.id)}
                        onCheckedChange={(checked) => 
                          handleSelectOfficer(officer.id, checked as boolean)
                        }
                      />
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2 flex-1">
                        <div>
                          <span className="font-semibold text-blue-600">{officer.fullName}</span>
                          <p className="text-sm text-gray-600">{officer.gender}</p>
                        </div>
                        <div>
                          <p className="text-sm font-medium">{officer.unitAssigned}</p>
                          <p className="text-xs text-gray-500">
                            Signed In: {format(new Date(officer.dateSignedIn), "MMM dd, yyyy")}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm font-medium">{officer.clinicalPresentationTopic}</p>
                          <p className="text-xs text-gray-500">
                            Presentation: {format(new Date(officer.clinicalPresentationDate), "MMM dd, yyyy")}
                          </p>
                          <p className="text-xs text-gray-500">
                            Sign-out: {format(new Date(officer.expectedSignOutDate), "MMM dd, yyyy")}
                          </p>
                        </div>
                      </div>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onDelete(officer.id)}
                      className="text-red-600 hover:text-red-700 hover:bg-red-50"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
              
              {filteredAndSortedOfficers.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  No house officers found matching the current filters.
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Dashboard;
