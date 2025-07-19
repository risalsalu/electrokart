import React from "react";

const StatCard = ({ title, value, icon }) => {
  return (
    <div className="bg-white rounded-2xl shadow p-4 flex items-center gap-4 hover:shadow-md transition duration-300">
      <div className="text-blue-600 text-3xl">{icon}</div>
      <div>
        <h4 className="text-gray-500 text-sm">{title}</h4>
        <p className="text-xl font-semibold text-gray-800">{value}</p>
      </div>
    </div>
  );
};

export default StatCard;
