import {
  GeolocationPosition,
  GeolocationPositionError,
  GeolocationPositionErrorCode,
} from "./types/geolocationTypes";
import { useState, useEffect, useRef, useMemo } from "react";
import { fetchWeatherData } from "./api/weatherService";
import dayjs from "dayjs";
import { WeatherData } from "./types/dataTypes";
import findClosestLocation from "./geolocation/findClosest";
import AutoComplete from "./components/AutoComplete";
import { Option } from "./types/dataTypes";
import DisplayForecast from "./components/DisplayForecast";

function App() {
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const myPosition = useRef<{ value: GeolocationPosition }>({ value: null! });
  const [region, setRegion] = useState<string>("");
  const [geoError, setGeoError] = useState<GeolocationPositionError | null>(
    null
  );
  const [apiError, setApiError] = useState<string>("");

  useEffect(() => {
    const currentDate = dayjs().format("YYYY-MM-DDTHH:mm:ss"); // Format the current date

    const getData = async () => {
      const data = await fetchWeatherData(currentDate);
      if (data) {
        setWeatherData(data.data);
      } else {
        setApiError("Failed to fetch data.");
      }
    };

    getData();
  }, []);

  const getLocation = () => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position: GeolocationPosition) => {
          myPosition.current.value = position;
          console.log("Closest location");
          console.dir(
            findClosestLocation(
              { latitude: 1.4221312, longitude: 103.8024704 },
              weatherData!.area_metadata
            )
          );
          setRegion(
            findClosestLocation(
              {
                latitude: position.coords.latitude,
                longitude: position.coords.longitude,
              },
              weatherData!.area_metadata
            )!.name
          );
        },
        (error: GeolocationPositionError) => {
          setGeoError(error);
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 0,
        }
      );
    } else {
      setGeoError({
        code: GeolocationPositionErrorCode.POSITION_UNAVAILABLE,
        message: "Geolocation is not supported by this browser.",
      } as GeolocationPositionError);
    }
  };

  const options: Option[] = useMemo(() => {
    if (weatherData) {
      return weatherData.area_metadata.map((item) => ({ name: item.name }));
    } else {
      return [];
    }
  }, [weatherData]);

  if (!weatherData) {
    return (
      <div className="flex flex-col items-center justify-center">
        <h1>Will it Rain?</h1>
        {apiError ? <p>{apiError}</p> : <p>...loading</p>}
      </div>
    );
  }

  const selectArea = (option: Option) => {
    setRegion(option.name);
  };

  let forecast;
  if (region) {
    forecast = weatherData.items[0].forecasts.find(
      (forecast) => forecast.area == region
    )?.forecast;
  }

  return (
    <div className="flex flex-col items-center justify-center">
      <h1 className="text-4xl font-extrabold text-blue-800 mb-4 text-center leading-tight">
        Will it Rain?
      </h1>
      <div className="flex flex-row justify-center items-end gap-8 my-2">
        <div>
          {myPosition.current.value && (
            <div className="mb-2">
              <p>Latitude: {myPosition.current.value.coords.latitude}</p>
              <p>Longitude: {myPosition.current.value.coords.longitude}</p>
            </div>
          )}
          {"geolocation" in navigator ? (
            <button
              onClick={getLocation}
              className="bg-blue-500 text-white font-semibold py-2 px-4 rounded-lg shadow-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition duration-200 ease-in-out"
            >
              Get My Location
            </button>
          ) : (
            <h3>Geolocation is not supported by this browser</h3>
          )}
          <p>{geoError?.message}</p>
        </div>
        <div>
          <AutoComplete options={options} onSelect={selectArea} />
        </div>
      </div>
      {region ? (
        <div>
          <p className="font-bold text-2xl">Closest Location: {region}</p>
          <p className="font-bold text-2xl">
            Expected Forecast: {forecast}
          </p>
        </div>
      ) : null}

      <p className="font-bold">
        Data for: {weatherData.items[0].valid_period.text} SGT
      </p>
      <DisplayForecast weatherData={weatherData} />
    </div>
  );
}

export default App;
