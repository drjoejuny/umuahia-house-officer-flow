
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from "recharts";
import { HouseOfficer } from "@/types/HouseOfficer";
import { format } from "date-fns";

interface ChartsSectionProps {
  houseOfficers: HouseOfficer[];
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82CA9D', '#FFC658', '#8DD1E1'];

const ChartsSection = ({ houseOfficers }: ChartsSectionProps) => {
  // Unit distribution data
  const unitData = houseOfficers.reduce((acc, officer) => {
    acc[officer.unitAssigned] = (acc[officer.unitAssigned] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const unitChartData = Object.entries(unitData).map(([unit, count]) => ({
    unit: unit.length > 12 ? unit.substring(0, 12) + '...' : unit,
    fullUnit: unit,
    count,
  }));

  // Gender distribution data
  const genderData = houseOfficers.reduce((acc, officer) => {
    acc[officer.gender] = (acc[officer.gender] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const genderChartData = Object.entries(genderData).map(([gender, count]) => ({
    gender,
    count,
  }));

  // Timeline data for sign-ins and presentations
  const timelineData = houseOfficers
    .map(officer => ({
      date: format(new Date(officer.dateSignedIn), "MMM yyyy"),
      signIns: 1,
      presentations: 0,
    }))
    .concat(
      houseOfficers.map(officer => ({
        date: format(new Date(officer.clinicalPresentationDate), "MMM yyyy"),
        signIns: 0,
        presentations: 1,
      }))
    )
    .reduce((acc, item) => {
      const existing = acc.find(a => a.date === item.date);
      if (existing) {
        existing.signIns += item.signIns;
        existing.presentations += item.presentations;
      } else {
        acc.push(item);
      }
      return acc;
    }, [] as Array<{date: string, signIns: number, presentations: number}>)
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Unit Distribution Bar Chart */}
      <Card>
        <CardHeader>
          <CardTitle>House Officers per Unit</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={unitChartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                dataKey="unit" 
                angle={-45}
                textAnchor="end"
                height={80}
                fontSize={12}
              />
              <YAxis />
              <Tooltip 
                formatter={(value, name) => [value, "Count"]}
                labelFormatter={(label) => {
                  const item = unitChartData.find(d => d.unit === label);
                  return item ? item.fullUnit : label;
                }}
              />
              <Bar dataKey="count" fill="#3B82F6" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Gender Distribution Pie Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Gender Distribution</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={genderChartData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ gender, count, percent }) => 
                  `${gender}: ${count} (${(percent * 100).toFixed(0)}%)`
                }
                outerRadius={80}
                fill="#8884d8"
                dataKey="count"
              >
                {genderChartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Timeline Chart */}
      <Card className="lg:col-span-2">
        <CardHeader>
          <CardTitle>Timeline: Sign-ins vs Clinical Presentations</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={timelineData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Line 
                type="monotone" 
                dataKey="signIns" 
                stroke="#3B82F6" 
                strokeWidth={3}
                name="Sign-ins"
              />
              <Line 
                type="monotone" 
                dataKey="presentations" 
                stroke="#10B981" 
                strokeWidth={3}
                name="Presentations"
              />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
};

export default ChartsSection;
