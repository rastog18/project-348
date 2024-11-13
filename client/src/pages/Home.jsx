import { Link } from "react-router-dom";

export default function Home() {
  return (
    <div className="container mx-auto py-8 px-4 ">
      <h1 className="text-2xl font-semibold">Main Page</h1>
      <p className="mt-2 text-base">
        Welcome! Feel free to check out the demo page to learn about interacting with the server:
      </p>
      <div className="mt-8">
        <h2 className="text-lg font-medium">Demos</h2>
        <ul className="list-disc list-inside mt-2">
          <li>
            <Link to="/axios" className="text-blue-500 hover:underline">
              Axios
            </Link>
          </li>
        </ul>
      </div>
    </div>
  );
}
