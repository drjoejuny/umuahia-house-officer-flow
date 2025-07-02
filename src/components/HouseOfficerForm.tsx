
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { cn } from "@/lib/utils";
import { HouseOfficer } from "@/types/HouseOfficer";
import { toast } from "@/hooks/use-toast";
import { createCalendarEvent } from "@/utils/calendarUtils";

const formSchema = z.object({
  fullName: z.string().min(2, "Full name must be at least 2 characters"),
  gender: z.enum(["Male", "Female"]),
  dateSignedIn: z.date(),
  unitAssigned: z.string().min(1, "Please select a unit"),
  clinicalPresentationTopic: z.string().min(5, "Topic must be at least 5 characters"),
  clinicalPresentationDate: z.date(),
});

interface HouseOfficerFormProps {
  onSubmit: (officer: HouseOfficer) => void;
}

const units = [
  "Cardiology 1",
  "Cardiology 2",
  "Nephrology",
  "Neurology",
  "Endocrinology",
  "Pulmonology",
  "Gastroenterology",
  "Infectious Disease/Dermatology",
  "Rheumatology"
];

const HouseOfficerForm = ({ onSubmit }: HouseOfficerFormProps) => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  });

  const handleSubmit = async (values: z.infer<typeof formSchema>) => {
    // Calculate expected sign-out date (3 months after sign-in)
    const expectedSignOutDate = new Date(values.dateSignedIn);
    expectedSignOutDate.setMonth(expectedSignOutDate.getMonth() + 3);

    const newOfficer: HouseOfficer = {
      id: Math.random().toString(36).substr(2, 9),
      fullName: values.fullName,
      gender: values.gender,
      dateSignedIn: values.dateSignedIn,
      unitAssigned: values.unitAssigned,
      clinicalPresentationTopic: values.clinicalPresentationTopic,
      clinicalPresentationDate: values.clinicalPresentationDate,
      expectedSignOutDate,
    };

    try {
      // Create calendar events
      await createCalendarEvent(
        `Clinical Presentation: ${values.clinicalPresentationTopic}`,
        values.clinicalPresentationDate,
        `Clinical presentation by ${values.fullName} in ${values.unitAssigned} unit`
      );

      await createCalendarEvent(
        `Sign-out: ${values.fullName}`,
        expectedSignOutDate,
        `Expected sign-out date for ${values.fullName} from ${values.unitAssigned} unit`
      );

      onSubmit(newOfficer);
      form.reset();
      
      toast({
        title: "Success!",
        description: "House officer registered successfully and calendar events created.",
      });
    } catch (error) {
      console.error("Error creating calendar events:", error);
      onSubmit(newOfficer);
      form.reset();
      
      toast({
        title: "Registered",
        description: "House officer registered. Note: Calendar events require Google Calendar permission.",
        variant: "default",
      });
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="fullName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Full Name</FormLabel>
              <FormControl>
                <Input placeholder="Enter full name" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="gender"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Gender</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select gender" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="Male">Male</SelectItem>
                  <SelectItem value="Female">Female</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="dateSignedIn"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>Date Signed In</FormLabel>
              <Popover>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full pl-3 text-left font-normal",
                        !field.value && "text-muted-foreground"
                      )}
                    >
                      {field.value ? (
                        format(field.value, "PPP")
                      ) : (
                        <span>Pick a date</span>
                      )}
                      <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={field.value}
                    onSelect={field.onChange}
                    disabled={(date) => date > new Date()}
                    initialFocus
                    className={cn("p-3 pointer-events-auto")}
                  />
                </PopoverContent>
              </Popover>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="unitAssigned"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Unit Assigned</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select unit" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {units.map((unit) => (
                    <SelectItem key={unit} value={unit}>
                      {unit}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="clinicalPresentationTopic"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Clinical Presentation Topic</FormLabel>
              <FormControl>
                <Input placeholder="Enter presentation topic" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="clinicalPresentationDate"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>Clinical Presentation Date</FormLabel>
              <Popover>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full pl-3 text-left font-normal",
                        !field.value && "text-muted-foreground"
                      )}
                    >
                      {field.value ? (
                        format(field.value, "PPP")
                      ) : (
                        <span>Pick a date</span>
                      )}
                      <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={field.value}
                    onSelect={field.onChange}
                    disabled={(date) => date < new Date()}
                    initialFocus
                    className={cn("p-3 pointer-events-auto")}
                  />
                </PopoverContent>
              </Popover>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700">
          Register House Officer
        </Button>
      </form>
    </Form>
  );
};

export default HouseOfficerForm;
