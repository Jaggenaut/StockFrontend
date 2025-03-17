"use client";
import Dashboard from "@/components/dashboard";
import Sidebar from "@/components/sidebar";
import { useEffect, useState } from "react";
import axios from "axios";

export default function Home() {
  const [activeComponent, setActiveComponent] = useState("one");

  const renderComponent = () => {
    if (activeComponent == "one") {
      return <Dashboard />;
    } else {
      return <></>;
    }
  };

  useEffect(() => {
    const handleLogin = async () => {
      const email = "adi@gmail.com";
      const password = "pass";
      try {
        const response = await axios.post(
          "https://stocks-backend-teal.vercel.app/login",
          {
            email,
            password,
          }
        );

        const { access_token } = response.data;
        localStorage.setItem("token", access_token);
        console.log("Login successful");
      } catch (error) {
        console.error("Login failed:", error);
      }
    };

    handleLogin();
  }, []);

  return (
    <div className="flex flex-row">
      <Sidebar
        activeComponent={activeComponent}
        onComponentChange={setActiveComponent}
      />
      <div className="w-full">{renderComponent()}</div>
    </div>
  );
}
