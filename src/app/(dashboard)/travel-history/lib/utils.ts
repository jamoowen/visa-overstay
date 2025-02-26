import {InsertTrip, SelectTrip} from "@/db/schema";

export const optimisticallyUpdateTripState = (newTrip: InsertTrip, setTripsList: React.Dispatch<React.SetStateAction<SelectTrip[]>>) => {
  const tripToAddToState: SelectTrip = {...newTrip, id: -1, updatedAt: new Date(), departureDate: null};

  setTripsList((previousTrips: SelectTrip[]) => {
    return [...previousTrips, tripToAddToState].sort((a, b) => {
      const dateA = new Date(a.arrivalDate).getTime();
      const dateB = new Date(b.arrivalDate).getTime();
      return dateB - dateA;
    });
  });
};
