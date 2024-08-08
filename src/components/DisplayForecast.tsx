import { WeatherData } from "../types/dataTypes";

interface DisplayForecastProps {
  weatherData: WeatherData;
}

const DisplayForecast = ({ weatherData }: DisplayForecastProps) => {
  return (
    <div className="flex flex-wrap justify-center items-center gap-8 p-4">
      {weatherData.items[0].forecasts.map((data, key) => (
        <span
          key={key}
          className="flex-1 min-w-[200px] bg-white/20 backdrop-blur-md rounded-lg p-4 shadow-lg text-center flex flex-col justify-center items-center"
        >
          <p className="text-lg font-semibold">{data.area}</p>
          <p className="text-md">{data.forecast}</p>
        </span>
      ))}
    </div>
  );
};

export default DisplayForecast;
