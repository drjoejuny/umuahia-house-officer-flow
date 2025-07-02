
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { HouseOfficer } from "@/types/HouseOfficer";
import { toast } from "@/hooks/use-toast";
import { formSchema, units } from "./HouseOfficerForm/formSchema";
import DatePickerField from "./HouseOfficerForm/DatePickerField";
import FormButtons from "./HouseOfficerForm/FormButtons";
import { useCalendarHandler } from "./HouseOfficerForm/useCalendarHandler";

interface HouseOfficerFormProps {
  onSubmit: (officer: HouseOfficer) => void;
}

const HouseOfficerForm = ({ onSubmit }: HouseOfficerFormProps) => {
  const [lastRegisteredOfficer, setLastRegisteredOfficer] = useState<HouseOfficer | null>(null);
  const { handleAddToCalendar } = useCalendarHandler();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  });

  const handleSubmit = (values: z.infer<typeof formSchema>) => {
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

    // Save locally and reset form
    onSubmit(newOfficer);
    setLastRegisteredOfficer(newOfficer);
    form.reset();
    
    toast({
      title: "Success!",
      description: "House officer registered successfully.",
    });
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
            <DatePickerField
              field={field}
              label="Date Signed In"
              disabled={(date) => date > new Date()}
            />
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
            <DatePickerField
              field={field}
              label="Clinical Presentation Date"
              disabled={(date) => {
                const signInDate = form.getValues("dateSignedIn");
                return signInDate ? date < signInDate : date < new Date();
              }}
            />
          )}
        />

        <FormButtons
          lastRegisteredOfficer={lastRegisteredOfficer}
          onAddToCalendar={() => handleAddToCalendar(lastRegisteredOfficer)}
        />
      </form>
    </Form>
  );
};

export default HouseOfficerForm;
