"use client";

// React and Next.js Imports
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
// Third-Party Libraries
import { format, parseISO, fromUnixTime } from "date-fns";
// Utility Functions
import { convertKelvinToFarenheit } from "@/utils/convertKelvinToFarenheit";
import { getDayOrNightIcon } from "@/utils/getDayOrNightIcon";
import { metersToMiles } from "@/utils/convertMetersToMiles";
import { convertWindSpeedToMph } from "@/utils/convertWindSpeed";
// Components
import Container from "@/components/Container";
import Navbar from "@/components/Navbar";
import WeatherIcon from "@/components/WeatherIcon";
import WeatherDetails from "@/components/WeatherDetails";
import ForecastWeatherDetail from "@/components/ForecastWeatherDetail";
// Styles - Note: Usually global styles are imported in _app.tsx, not in individual pages.
import "./globals.css";

interface WeatherDetail {
  city: any;
  dt: number;
  main: {
    temp: number;
    feels_like: number;
    temp_min: number;
    temp_max: number;
    pressure: number;
    sea_level: number;
    grnd_level: number;
    humidity: number;
    temp_kf: number;
  };
  weather: {
    id: number;
    main: string;
    description: string;
    icon: string;
  }[];
  clouds: {
    all: number;
  };
  wind: {
    speed: number;
    deg: number;
    gust: number;
  };
  visibility: number;
  pop: number;
  sys: {
    pod: string;
  };
  dt_txt: string;
}
interface WeatherData {
  cod: string;
  message: number;
  cnt: number;
  list: WeatherDetail[];
  city: {
    id: number;
    name: string;
    coord: {
      lat: number;
      lon: number;
    };
    country: string;
    population: number;
    timezone: number;
    sunrise: number;
    sunset: number;
  };
}

export default function Home() {
  const { isPending, error, data } = useQuery<WeatherData>({
    queryKey: ["repoData"],
    queryFn: async () => {
      const { data } = await axios.get(
        `https://api.openweathermap.org/data/2.5/forecast?q=keyport&appid=${process.env.NEXT_PUBLIC_API_KEY}`
      );

      return data;
    },
  });

  if (isPending)
    return (
      <div className="flex items-center min-h-screen justify-center">
        <p className="animate-bounce">Loading...</p>
      </div>
    );

  const uniqueDates = [
    ...new Set(
      data?.list.map(
        (entry: { dt: number }) =>
          new Date(entry.dt * 1000).toISOString().split("T")[0]
      )
    ),
  ];

  // Filtering data to get the first entry after 6 AM for each unique date
  const weatherDataForEachDate = uniqueDates.map((date) => {
    return data?.list.find((entry: { dt: number }) => {
      const entryDate = new Date(entry.dt * 1000).toISOString().split("T")[0];
      const entryTime = new Date(entry.dt * 1000).getHours();
      return entryDate === date && entryTime >= 6;
    });
  });

  const mostCurrentData = data?.list[0];

  return (
    <div className="flex flex-col gap-4 bg-gray-100 min-h-screen">
      <Navbar />
      <main className="px-3 max-w-7xl mx-auto flex flex-col gap-9 w-full pb-10 pt-4">
        {/* today's data */}
        <section className="space-y-4">
          <div className="space-y-2">
            <h2 className="flex gap-4 text-2xl items-end">
              <p>{format(parseISO(mostCurrentData?.dt_txt ?? ""), "EEEE")}</p>
              <p className="text-lg">
                {format(
                  parseISO(mostCurrentData?.dt_txt ?? ""),
                  "MMMM dd, yyyy"
                )}
              </p>
            </h2>
            <Container className="gap-10 px-6 items-center">
              <div className="flex flex-col px-4">
                <span className="text-5xl">
                  {convertKelvinToFarenheit(
                    mostCurrentData?.main.temp ?? 296.37
                  )}
                  °
                </span>
                <p className="text-xs space-x-1 whitespace-nowrap">
                  <span>Feels like</span>
                  <span>
                    {convertKelvinToFarenheit(
                      mostCurrentData?.main.feels_like ?? 296.37
                    )}
                    °
                  </span>
                </p>
                <p className="text-xs space-x-2">
                  <span>
                    {convertKelvinToFarenheit(
                      mostCurrentData?.main.temp_min ?? 0
                    )}
                    °↓
                  </span>
                  <span>
                    {convertKelvinToFarenheit(
                      mostCurrentData?.main.temp_max ?? 0
                    )}
                    °↑
                  </span>
                </p>
              </div>
              <div className="flex gap-10 sm:gap-16 overflow-x-auto w-full justify-between pr-3">
                {data?.list.map((data, index) => (
                  <div
                    key={index}
                    className="flex flex-col justify-between gap-2 items-center text-xs font-semibold pb-5"
                  >
                    <p className="whitespace-nowrap">
                      {format(parseISO(data.dt_txt), "h:mm a")}
                    </p>

                    <WeatherIcon
                      iconName={getDayOrNightIcon(
                        data.weather[0].icon,
                        data.dt_txt
                      )}
                    />
                    <p>{convertKelvinToFarenheit(data.main.temp ?? 0)}°</p>
                  </div>
                ))}
              </div>
            </Container>
          </div>
          <div className="flex gap-4 items-center">
            {/* left */}
            <Container className="w-fit justify-center flex-col px-4 items-center">
              <p className="capitalize text-center">
                {mostCurrentData?.weather[0].description}
              </p>
              <WeatherIcon
                iconName={getDayOrNightIcon(
                  mostCurrentData?.weather[0].icon ?? "",
                  mostCurrentData?.dt_txt ?? ""
                )}
              />
            </Container>
            {/* right */}
            <Container className="bg-yellow-300/80 px-6 gap-4 justify-between">
              <WeatherDetails
                visibility={metersToMiles(mostCurrentData?.visibility ?? 10000)}
                airPressure={`${mostCurrentData?.main.pressure} hPa`}
                humidity={`${mostCurrentData?.main.humidity}%`}
                sunrise={format(
                  fromUnixTime(data?.city.sunrise ?? 1702517657),
                  "h:mm a"
                )}
                sunset={format(
                  fromUnixTime(data?.city.sunset ?? 1702517657),
                  "h:mm a"
                )}
                windSpeed={convertWindSpeedToMph(
                  mostCurrentData?.wind.speed ?? 1.64
                )}
              />
            </Container>
          </div>
        </section>
        {/* 7 day forecast */}
        <section className="flex w-full flex-col gap-4">
          <p className="text-2xl">Forecast (7 Days)</p>
          {weatherDataForEachDate.map((data, index) => (
            <ForecastWeatherDetail
              key={index}
              description={data?.weather[0].description ?? "Clear"}
              weatherIcon={data?.weather[0].icon ?? "02d"}
              date={format(parseISO(data?.dt_txt ?? ""), "MMMM dd")}
              day={format(parseISO(data?.dt_txt ?? ""), "EEEE")}
              feelsLike={data?.main.feels_like ?? 0}
              temp={data?.main.temp ?? 0}
              tempMax={data?.main.temp_max ?? 0}
              tempMin={data?.main.temp_min ?? 0}
              airPressure={`${data?.main.pressure} hPa `}
              humidity={`${data?.main.humidity}% `}
              sunrise={format(
                fromUnixTime(data?.city?.sunrise ?? 1702517657),
                "H:mm"
              )}
              sunset={format(
                fromUnixTime(data?.city?.sunset ?? 1702517657),
                "H:mm"
              )}
              visibility={`${metersToMiles(data?.visibility ?? 10000)} `}
              windSpeed={`${convertWindSpeedToMph(data?.wind.speed ?? 1.64)} `}
            />
          ))}
        </section>
      </main>
    </div>
  );
}
