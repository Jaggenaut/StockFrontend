"use client";
import Dashboard from "@/components/dashboard";
import Sidebar from "@/components/sidebar";
import { useEffect, useState } from "react";
import axios from "axios";

export default function Home() {
  const [activeComponent, setActiveComponent] = useState("one");

  const renderComponent = () => {
    switch (activeComponent) {
      case "one":
        return <Dashboard />;
      default:
        return (
          <div className="text-gray-400 p-4">
            Select an option from the sidebar
          </div>
        );
    }
  };

  useEffect(() => {
    const handleLogin = async () => {
      try {
        const response = await axios.post(
          `${process.env.NEXT_PUBLIC_API_URL}/login`, // Use environment variable for API URL
          {
            email: process.env.NEXT_PUBLIC_EMAIL, // Use environment variable for email
            password: process.env.NEXT_PUBLIC_PASSWORD, // Use environment variable for password
          }
        );

        const { access_token } = response.data.data;
        console.log(access_token);
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
