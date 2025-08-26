import { DollarSign, IndianRupee, LucideProps } from "lucide-react";
import { ForwardRefExoticComponent, RefAttributes } from "react";

export const CurrencyShortIcon: {
  [key: string]: ForwardRefExoticComponent<
    Omit<LucideProps, "ref"> & RefAttributes<SVGSVGElement>
  >;
} = {
  INR: IndianRupee,
  USD: DollarSign,
};
