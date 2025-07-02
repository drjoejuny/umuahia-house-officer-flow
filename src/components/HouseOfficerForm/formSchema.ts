
import { z } from "zod";

export const formSchema = z.object({
  fullName: z.string().min(2, "Full name must be at least 2 characters"),
  gender: z.enum(["Male", "Female"]),
  dateSignedIn: z.date(),
  unitAssigned: z.string().min(1, "Please select a unit"),
  clinicalPresentationTopic: z.string().min(5, "Topic must be at least 5 characters"),
  clinicalPresentationDate: z.date(),
});

export const units = [
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
