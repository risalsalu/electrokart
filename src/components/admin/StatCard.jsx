import React from 'react';
import { Card, CardContent } from '@/components/ui/card'; // Adjust if you're not using shadcn/ui
import { ArrowUpRight, ArrowDownRight } from 'lucide-react'; // Optional icons

const StatCard = ({ title, value, icon: Icon, change, isPositive }) => {
  return (
    <Card className="bg-white dark:bg-gray-900 shadow-md rounded-2xl p-4 w-full">
      <CardContent className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-500 dark:text-gray-400">{title}</p>
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white">{value}</h2>
          {change !== undefined && (
            <p className={`text-sm flex items-center mt-1 ${isPositive ? 'text-green-500' : 'text-red-500'}`}>
              {isPositive ? <ArrowUpRight className="h-4 w-4 mr-1" /> : <ArrowDownRight className="h-4 w-4 mr-1" />}
              {change}
            </p>
          )}
        </div>
        {Icon && <Icon className="h-10 w-10 text-blue-500 opacity-80" />}
      </CardContent>
    </Card>
  );
};

export default StatCard;
