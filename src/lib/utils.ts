import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const mediaQueryWidths: {
  [key: string]: number;
} = {
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
};

export function getErrorMessage(
  error: Error | string | unknown | null
): string {
  if (!error) return "An error occurred";

  if (error instanceof Error) {
    return error.message;
  }
  // else if (isAxiosError(error)) {
  //   return error.response?.data || "An error occurred";
  // }
  else {
    return typeof error === "object" ? JSON.stringify(error) : String(error);
  }
}
