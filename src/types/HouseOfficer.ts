
export interface HouseOfficer {
  id: string;
  fullName: string;
  gender: 'Male' | 'Female';
  dateSignedIn: Date;
  unitAssigned: string;
  clinicalPresentationTopic: string;
  clinicalPresentationDate: Date;
  expectedSignOutDate: Date;
}
