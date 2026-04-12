import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatPrice(price: number, currency: string = "MKD"): string {
  if (currency === "MKD") {
    return `${price.toLocaleString('mk-MK')} ден`;
  }
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: currency,
  }).format(price);
}

export function formatDiscount(percentage: number): string {
  return `${Math.round(percentage)}% OFF`;
}
