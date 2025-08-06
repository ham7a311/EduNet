import Auth from "./AuthSteps"
import SignForm from "./SignForm"

export default function Authentication() {
    return (
        <section className="min-h-screen bg-black flex flex-col lg:flex-row items-center justify-center gap-6 lg:gap-10 px-6 py-10 lg:py-20" id="auth">
      {/* Left Side - Auth Steps */}
      <div className="w-full lg:w-1/2 flex justify-center">
        <Auth />
      </div>

      {/* Right Side - Sign Form */}
      <div className="w-full lg:w-1/2 flex justify-center">
        <SignForm />
      </div>
    </section>
    )
}