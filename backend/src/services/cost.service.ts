const DEFAULT_COST_PER_KM = 50;

export const calculateTransportCost = (
  distanceKm: number,
  costPerKm: number = DEFAULT_COST_PER_KM
): number => {
  if (distanceKm < 0) {
    throw new Error("Distance cannot be negative");
  }

  if (costPerKm < 0) {
    throw new Error("Cost per kilometer cannot be negative");
  }

  return Number((distanceKm * costPerKm).toFixed(2));
};

export const calculateEconomicBenefit = (
    quantity: number,
    estimatedUnitValue: number | null,
    transportCost: number,
    handlingCost: number = 0
): number | null => {
    if (estimatedUnitValue === null) {
        return null;
    }

    if (quantity < 0) {
        throw new Error("Quantity cannot be negative");
    }

    if (estimatedUnitValue < 0) {
        throw new Error(
            "Estimated unit value cannot be negative"
        );
    }

    if (transportCost < 0) {
        throw new Error(
            "Transport cost cannot be negative"
        );
    }

    if (handlingCost < 0) {
        throw new Error(
            "Handling cost cannot be negative"
        );
    }

    const newMaterialCost =
        quantity * estimatedUnitValue;

    const recoveredMaterialCost = 0;

    const economicBenefit =
        newMaterialCost -
        recoveredMaterialCost -
        transportCost -
        handlingCost;

    return Number(economicBenefit.toFixed(2));
};