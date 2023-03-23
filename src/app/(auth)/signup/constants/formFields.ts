const signupFields = [
  {
    labelText: "Username",
    labelFor: "username",
    id: "username",
    name: "username",
    type: "text",
    autoComplete: "username",
    isRequired: true,
    placeholder: "Username"
  },
  {
    labelText: "Email address",
    labelFor: "email_address",
    id: "email_address",
    name: "email",
    type: "email",
    autoComplete: "email",
    isRequired: true,
    placeholder: "Email address"
  },
  {
    labelText: "Password",
    labelFor: "password",
    id: "password",
    name: "password",
    type: "password",
    autoComplete: "current-password",
    isRequired: true,
    placeholder: "Password"
  },
  {
    labelText: "Confirm Password",
    labelFor: "confirm_password",
    id: "confirm_password",
    name: "confirm_password",
    type: "password",
    autoComplete: "confirm-password",
    isRequired: true,
    placeholder: "Confirm Password"
  }
]

export { signupFields }