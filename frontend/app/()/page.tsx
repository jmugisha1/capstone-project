import Image from "next/image";
import "./page.css";
import { NavigationWebsite } from "../components/navigation/navigation-component";

export default function Home() {
  return (
    <div className="home-wrapper">
      <NavigationWebsite />
      <main className="home-wrapper-main">hello</main>
    </div>
  );
}
