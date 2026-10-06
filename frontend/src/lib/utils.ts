import axios from "axios";
import { clsx, type ClassValue } from "clsx"
import { useEffect } from "react";
import { useQuery } from "react-query";
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function dateFromObjectId(objectId: string) {
  return new Date(parseInt(objectId.substring(0, 8), 16) * 1000);
}

export function getUserData(): any {
  const userDataString = localStorage.getItem("userData");
    try {
      const userData = userDataString ? JSON.parse(userDataString) : null;
      return(userData);
    }
    catch (e) {
      console.log("Error parsing user data, perhaps the token is invalid?");
      return null;
    }
}

export function convertToBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  });
}

export function convertMilesToDegrees(miles) {
  return parseFloat(miles * (1/69)).toFixed(2);
}

export function convertDegreesToMiles(degrees) {
  return parseFloat(degrees * 69).toFixed(2)
}