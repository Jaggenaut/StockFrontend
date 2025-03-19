"use client";

type SidebarProps = {
  activeComponent: string;
  onComponentChange: (component: string) => void;
};

export default function Sidebar({
  activeComponent,
  onComponentChange,
}: SidebarProps) {
  const links = [
    { name: "PHA", count: "one" },
    { name: "Fund Analysis", count: "two" },
    { name: "Holdings", count: "three" },
    { name: "Transactions", count: "four" },
  ];

  const getButtonClass = (component: string) =>
    `w-full mb-4 px-4 py-2 rounded-lg transition text-left cursor-pointer ${
      activeComponent === component
        ? "bg-gray-600 text-white font-semibold"
        : "text-gray-300 hover:bg-gray-700 hover:text-white"
    }`;

  return (
    <div className="w-64 h-auto bg-[#1b1a1a] min-h-[calc(100vh-60px)] text-white p-4">
      {links.map((link) => (
        <div
          key={link.count}
          className={getButtonClass(link.count)}
          onClick={() => onComponentChange(link.count)}
        >
          {link.name}
        </div>
      ))}
    </div>
  );
}
