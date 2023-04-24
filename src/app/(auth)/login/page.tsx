import Header from "./components/Header";
import Login from "./components/Login";

export default function LoginPage() {
  return (
    <div className="flex justify-center h-screen w-full z-40 pt-20">
      <div className="sm:max-w-[500px] w-full h-fit bg-white p-10 rounded-2xl">
        <Header
          heading="Login to your account"
          paragraph="Don't have an account yet? "
          linkName="Signup"
          linkUrl="/signup"
        />
        <Login />
      </div>
    </div>
  );
}
