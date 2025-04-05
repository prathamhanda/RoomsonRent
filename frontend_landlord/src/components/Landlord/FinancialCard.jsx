import React from 'react';
import { Card, CardHeader, CardBody } from "@heroui/react";

const FinancialCard = ({ emoji, title, value }) => {
    return (
      <Card className="p-6 w-full h-full text-center border border-gray-200 shadow-md rounded-xl bg-white transition-all duration-300 ease-in-out hover:shadow-lg hover:border-gray-300 hover:-translate-y-1 flex flex-col justify-center">
        <CardHeader className="flex-col items-center mb-3">
          <p className="text-4xl mb-2" role="img" aria-hidden="true">{emoji}</p>
          <h3 className="font-semibold text-lg text-gray-800 leading-tight">{title}</h3>
        </CardHeader>
        <CardBody className="p-0">
          <center>
          <p className="text-xl font-bold text-gray-900">{value}</p>
          </center>
        </CardBody>
      </Card>
    );
  };

export default FinancialCard;