import { Subject } from "./subject.model";

export class User {
  id?: any;
  firstName?: string;
  middleName?: string;
  lastName?: string;
  email?: string;
  password?: string;
  subjectIds?: string[]
}