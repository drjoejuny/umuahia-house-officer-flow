
export const createCalendarEvent = async (title: string, date: Date, description: string) => {
  try {
    // Create Google Calendar URL
    const startDate = new Date(date);
    const endDate = new Date(date);
    endDate.setHours(endDate.getHours() + 1); // 1 hour duration

    const formatDate = (date: Date) => {
      return date.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
    };

    const calendarUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(title)}&dates=${formatDate(startDate)}/${formatDate(endDate)}&details=${encodeURIComponent(description)}&location=FMC%20Umuahia,%20Department%20of%20Internal%20Medicine`;

    // Open Google Calendar in a new tab
    window.open(calendarUrl, '_blank');
    
    console.log("Calendar event created:", { title, date, description });
    
    return true;
  } catch (error) {
    console.error("Error creating calendar event:", error);
    throw error;
  }
};
