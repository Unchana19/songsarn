import React from "react";
import { Card, CardBody, CardFooter } from "@nextui-org/card";
import { Button } from "@nextui-org/button";
import { SelectedComponent } from "@/interfaces/select-component";
import { Component } from "@/interfaces/component.interface";

interface Props {
  selectedComponent: SelectedComponent;
  componentDetails: Component | undefined;
  onRemove: () => void;
}

const SelectedComponentDetails: React.FC<Props> = ({
  selectedComponent,
  componentDetails,
  onRemove,
}) => {
  return (
    <Card shadow="none" className="w-full border-primary border-1">
      <CardBody>
        <div className="flex justify-between items-center">
          <div>
            <h4 className="text-lg font-bold">
              {componentDetails?.name || "Unknown Component"}
            </h4>
          </div>
          <div className="flex items-center space-x-2">
            <div
              className="w-6 h-6 rounded-full border-2 border-gray-300"
              style={{
                backgroundColor:
                  selectedComponent.primary_color?.color || "transparent",
              }}
              title={
                selectedComponent.primary_color?.name ||
                "No primary color selected"
              }
            />
            <div
              className="w-6 h-6 rounded-full border-2 border-gray-300"
              style={{
                backgroundColor:
                  selectedComponent.pattern_color?.color || "transparent",
              }}
              title={
                selectedComponent.pattern_color?.name ||
                "No pattern color selected"
              }
            />
          </div>
        </div>
      </CardBody>
      <CardFooter>
        <Button color="danger" variant="light" onPress={onRemove}>
          Remove
        </Button>
      </CardFooter>
    </Card>
  );
};

export default SelectedComponentDetails;
