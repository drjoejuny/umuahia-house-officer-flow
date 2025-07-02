
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import HouseOfficerForm from "@/components/HouseOfficerForm";
import Dashboard from "@/components/Dashboard";
import { HouseOfficer } from "@/types/HouseOfficer";

const Index = () => {
  const [houseOfficers, setHouseOfficers] = useState<HouseOfficer[]>([]);

  const addHouseOfficer = (officer: HouseOfficer) => {
    setHouseOfficers(prev => [...prev, officer]);
  };

  const deleteHouseOfficer = (id: string) => {
    setHouseOfficers(prev => prev.filter(officer => officer.id !== id));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-6">
          <h1 className="text-2xl md:text-3xl font-bold text-center text-gray-800 leading-tight">
            FMC UMUAHIA, ABIA STATE
          </h1>
          <h2 className="text-lg md:text-xl font-semibold text-center text-blue-600 mt-2">
            DEPARTMENT OF INTERNAL MEDICINE
          </h2>
          <h3 className="text-base md:text-lg text-center text-gray-600 mt-1">
            HOUSE OFFICERS CLINICAL FLOW
          </h3>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Form Section */}
          <div className="space-y-6">
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="text-xl text-center text-gray-800">
                  Register House Officer
                </CardTitle>
              </CardHeader>
              <CardContent>
                <HouseOfficerForm onSubmit={addHouseOfficer} />
              </CardContent>
            </Card>
          </div>

          {/* Dashboard Section */}
          <div className="space-y-6">
            <Dashboard 
              houseOfficers={houseOfficers} 
              onDelete={deleteHouseOfficer}
            />
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-6 mt-12">
        <div className="container mx-auto px-4 text-center">
          <p className="text-sm">
            Built by Dr. Onyemachi Joseph, copyright 2025
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
