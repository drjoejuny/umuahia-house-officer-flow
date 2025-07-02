
import { toast } from "@/hooks/use-toast";
import { createCalendarEvent } from "@/utils/calendarUtils";
import { HouseOfficer } from "@/types/HouseOfficer";

export const useCalendarHandler = () => {
  const handleAddToCalendar = async (officer: HouseOfficer | null) => {
    if (!officer) {
      toast({
        title: "No Officer Registered",
        description: "Please register a house officer first before adding to calendar.",
        variant: "destructive",
      });
      return;
    }

    try {
      // Create calendar events
      await createCalendarEvent(
        `Clinical Presentation: ${officer.clinicalPresentationTopic}`,
        officer.clinicalPresentationDate,
        `Clinical presentation by ${officer.fullName} in ${officer.unitAssigned} unit`
      );

      await createCalendarEvent(
        `Sign-out: ${officer.fullName}`,
        officer.expectedSignOutDate,
        `Expected sign-out date for ${officer.fullName} from ${officer.unitAssigned} unit`
      );

      toast({
        title: "Calendar Events Created!",
        description: "Google Calendar events have been created for the presentation and sign-out dates.",
      });
    } catch (error) {
      console.error("Error creating calendar events:", error);
      toast({
        title: "Calendar Error",
        description: "There was an issue creating the calendar events. Please try again.",
        variant: "destructive",
      });
    }
  };

  return { handleAddToCalendar };
};
