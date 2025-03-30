import {Card, CardHeader, CardBody, Image} from "@heroui/react";


const FinancialCard = ({ emoji, title, value }) => {
    return (
      <Card className="py-4 w-60 text-center border border-gray-300 shadow-lg rounded-xl">
        <CardHeader className="pb-0 pt-2 px-4 flex-col items-center">
          <p className="text-3xl">{emoji}</p>
          <h4 className="font-bold text-lg mt-2">{title}</h4>
        </CardHeader>
        <CardBody className="py-2">
          <p className="text-2xl font-semibold text-gray-700">{value}</p>
        </CardBody>
      </Card>
    );
  };

  export default FinancialCard;