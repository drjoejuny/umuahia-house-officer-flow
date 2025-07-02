
import { Calendar as CalendarIconLucide } from "lucide-react";
import { Button } from "@/components/ui/button";
import { HouseOfficer } from "@/types/HouseOfficer";

interface FormButtonsProps {
  lastRegisteredOfficer: HouseOfficer | null;
  onAddToCalendar: () => void;
}

const FormButtons = ({ lastRegisteredOfficer, onAddToCalendar }: FormButtonsProps) => {
  return (
    <div className="space-y-3">
      <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700">
        Register House Officer
      </Button>
      
      {lastRegisteredOfficer && (
        <Button 
          type="button" 
          variant="outline" 
          className="w-full border-green-600 text-green-600 hover:bg-green-50"
          onClick={onAddToCalendar}
        >
          <CalendarIconLucide className="mr-2 h-4 w-4" />
          Add to Google Calendar
        </Button>
      )}
    </div>
  );
};

export default FormButtons;
