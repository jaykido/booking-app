import { FormProvider, useForm } from "react-hook-form";
import DetailsSection from "./DetailsSection";

export type HotelFormData = {
  name: string;
  city: string;
  country: string;
  description: string;
  type: string;
  adultCount: number;
  childCount: number;
  facilities: string[];
  pricePerNight: number;
  starRating: number;
  imageFiles: FileList;
};

const ManageHotelForm = () => {
  const formMethods = useForm<HotelFormData>();
  return (
    <FormProvider {...formMethods}>
      <form>
        <DetailsSection />
      </form>
    </FormProvider>
  );
};
export default ManageHotelForm;
