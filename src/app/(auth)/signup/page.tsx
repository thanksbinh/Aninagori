import Header from "../login/components/Header"
import Signup from "./components/Signup"

export default function SignupPage() {
  return (
    <div className="flex justify-center h-screen w-full z-40 pt-10">
      <div className="w-2/5 h-fit bg-white p-10 rounded-2xl">
        <Header
          heading="Signup to create an account"
          paragraph="Already have an account? "
          linkName="Login"
          linkUrl="/"
        />
        <Signup />
      </div>
    </div>
  )
}