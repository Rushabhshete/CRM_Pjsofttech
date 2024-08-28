// src/data/dropdownOptions.js

// Define dropdown options for different fields
export const typeOptions = [
  { value: "Income", label: "Income" },
  { value: "Expense", label: "Expense" },
];

export const billTypeOptions = [
  { value: "Invoice", label: "Invoice" },
  { value: "Receipt", label: "Receipt" },
  { value: "Other", label: "Other" },
];

export const paidByOptions = [
  { value: "Cash", label: "Cash" },
  { value: "Cheque", label: "Cheque" },
  { value: "UPI", label: "UPI" },
  { value: "Bank Transfer", label: "Bank Transfer" },
];

export const paymentMethodOption = [
  { value: "Partial", label: "Partial" },
  { value: "Pending", label: "Pending" },
  { value: "Complete", label: "Complete" },
];

export const studentManagementErrors = {
  requiredField: '"This field is required."',
  invalidFormat: '"The input format is invalid."',
  minLength: '"The input is too short."',
  maxLength: '"The input is too long."',
  email: '"The email address is invalid."',
  passwordMismatch: '"Passwords do not match."',
  invalidCredentials: '"The username or password is incorrect."',
  accountLocked:
    '"The account is locked due to multiple failed login attempts."',
  tokenExpired: '"The session token has expired."',
  unauthorizedAccess: '"You do not have permission to access this resource."',
  connectionFailed: '"Failed to connect to the database."',
  queryFailed: '"Database query failed."',
  recordNotFound: '"The requested record was not found."',
  duplicateRecord: '"A record with the same identifier already exists."',
  timeout: '"The request timed out."',
  offline: '"The system is currently offline."',
  serverUnavailable: '"The server is currently unavailable."',
  requestFailed: '"The request failed due to a network error."',
  unexpectedError: '"An unexpected error occurred."',
  featureUnavailable: '"This feature is currently unavailable."',
  dataProcessingError: '"An error occurred while processing the data."',
  configurationError: '"There is a configuration error in the system."',
  userNotFound: '"User not found."',
  accessDenied: '"User does not have the necessary permissions."',
  profileIncomplete: '"User profile is incomplete."',
  actionNotAllowed: '"User action is not allowed."',
};

export const systems = [
  { value: "student", label: "Student Management System" },
  { value: "employee", label: "Employee Management System" },
  { value: "inquiry", label: "Inquiry Management System" },
  { value: "Admission", label: "Admission Management System" },
  { value: "income & expense", label: "Income & Expense Management System" },
  { value: "fees", label: "Fees Management System" },
  { value: "inquiry", label: "Inquiry Management System" },

]