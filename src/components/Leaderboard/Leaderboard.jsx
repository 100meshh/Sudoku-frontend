import React, { useState } from "react";

const tabList = [
  { key: "Scores", label: "Rank by Scores" },
  { key: "Games", label: "No. of Games" },
  { key: "Times", label: "Rank by Speed" },
];

const Leaderboard = (props) => {
  const [activeTab, setActiveTab] = useState("Scores");

  const getTableData = () => {
    if (activeTab === "Scores") return props.Scores || [];
    if (activeTab === "Games") return props.Games || [];
    if (activeTab === "Times") return props.Times || [];
    return [];
  };

  const getValueKey = () => {
    if (activeTab === "Scores") return "Score";
    if (activeTab === "Games") return "Games";
    if (activeTab === "Times") return "Time";
    return "Value";
  };

  const getValueHeader = () => {
    if (activeTab === "Scores") return "Score";
    if (activeTab === "Games") return "Games Solved";
    if (activeTab === "Times") return "Time (s)";
    return "Value";
  };

  return (
    <div className="p-5 text-lg">
      {/* Tabs */}
      <div className="flex mb-3 border-b border-blue-800">
        {tabList.map((tab) => (
          <button
            key={tab.key}
            className={`px-4 py-2 font-bold text-blue-800 focus:outline-none transition border-b-2 ${activeTab === tab.key
                ? "border-blue-800 bg-blue-100"
                : "border-transparent bg-transparent hover:bg-blue-50"
              }`}
            onClick={() => setActiveTab(tab.key)}
            type="button"
          >
            {tab.label}
          </button>
        ))}
      </div>
      {/* Table */}
      <div>
        <table className="w-full border border-blue-800 rounded overflow-hidden">
          <thead className="bg-blue-200 text-blue-800">
            <tr>
              <th className="py-2 px-3 font-bold">Rank</th>
              <th className="py-2 px-3 font-bold">Name</th>
              <th className="py-2 px-3 font-bold">{getValueHeader()}</th>
            </tr>
          </thead>
          <tbody className="text-blue-900">
            {getTableData().map((ele, i) => (
              <tr key={i} className="even:bg-blue-50">
                <td className="py-1 px-3">{i + 1}</td>
                <td className="py-1 px-3">{ele.username}</td>
                <td className="py-1 px-3">{ele[getValueKey()]}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Leaderboard; 