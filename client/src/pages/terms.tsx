import { Link } from "react-router-dom";
import Container from "../components/Container";

export default function Terms() {
  document.title = "Terms and Conditions";
  return (
    <Container>
      <div className="flex flex-col items-center desktop:w-[48rem] px-4 gap-2 py-8">
        <h1 className="desktop:text-4xl text-3xl font-semibold">
          Terms and Conditions
        </h1>
        <p className="desktop:text-xl text-base">
          Please read all terms and services carefully. By using appNote, you
          are agreeing to be bound by following terms and conditions in this
          agreement.
        </p>
        <h1 className="desktop:text-3xl text-2xl font-semibold">Basic Terms</h1>
        <ul className="desktop:text-xl text-lg">
          <li>
            1. You are responsible for keeping your username and password
            secure.
          </li>
          <li>
            2. The server, appNote, should not be used to store any sensitive
            information, such as passwords, bank information or credit card
            information
          </li>
          <li>
            3. appNote is not responsible for any data stored with the service.
          </li>
        </ul>
        <h1 className="desktop:text-3xl text-2xl font-semibold">General Terms</h1>
        <ul className="text-xl">
          <li>
            1. appNote reserves the right to terminate any account for any
            reason, at any time without prior notice.
          </li>
          <li>
            2. appNote reserves the right to change these terms and conditions
            at any time. Any change to these terms and conditions will be
            notified to the user.
          </li>
          <li>
            3. appNote reserves the right to refuse service to any user for any
            reason.
          </li>
        </ul>
        <Link to="/">
          <p className="text-white w-full bg-gradient-to-r from-blue-500 via-blue-600 to-indigo-600 hover:bg-gradient-to-br focus:outline-none shadow-sm shadow-blue-800/80 font-semibold rounded text-xl p-2 text-center">
            Back to Home
          </p>
        </Link>
      </div>
    </Container>
  );
}
