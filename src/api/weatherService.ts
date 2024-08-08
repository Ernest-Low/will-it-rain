import { ApiResponse } from "../types/dataTypes";
import axios from "axios";

const fetchWeatherData = async (date: string): Promise<ApiResponse | null> => {
  try {
    const response = await axios.get<ApiResponse>(
      "https://api-open.data.gov.sg/v2/real-time/api/two-hr-forecast",
      {
        params: {
          date, // Use the provided date string as a parameter
        },
      }
    );

    if (response.data.code === 0) {
      return response.data;
    } else {
      console.error("API Error:", response.data.errorMsg);
      return null;
    }
  } catch (err) {
    console.error("Failed to fetch data:", err);
    return null;
  }
};

export { fetchWeatherData };
