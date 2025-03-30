import React from "react";
import { Card, CardHeader, CardBody } from "@heroui/react";
import { Home, Plus, User } from "lucide-react";

const LandlordOptions = () => {
  return (
    <div className="flex justify-center gap-50 mt-8">
      {/* Home Dashboard */}
      <Card className="w-62 h-24 flex flex-col items-center justify-center hover:shadow-lg cursor-pointer">
        <CardHeader className="text-center">
          <Home size={32} />
        </CardHeader>
        <CardBody className="text-sm text-center">Home</CardBody>
      </Card>

      {/* Add New Listing */}
      <Card className="w-62 h-24 flex flex-col items-center justify-center hover:shadow-lg cursor-pointer">
        <CardHeader className="text-center">
          <Plus size={32} />
        </CardHeader>
        <CardBody className="text-sm text-center">Add Listing</CardBody>
      </Card>

      {/* Profile */}
      <Card className="w-62 h-24 flex flex-col items-center justify-center hover:shadow-lg cursor-pointer">
        <CardHeader className="text-center">
          <User size={32} />
        </CardHeader>
        <CardBody className="text-sm text-center">Profile</CardBody>
      </Card>
    </div>
  );
};

export default LandlordOptions;
