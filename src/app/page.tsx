"use client";

import Container from "@/components/Container";
import Navbar from "@/components/Navbar";
import { convertKelvinToFahrenheit } from "@/utils/convertKelvinToFarenheit";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { format, fromUnixTime, parseISO } from "date-fns";

// https://api.openweathermap.org/data/2.5/forecast?q=keyport&appid=0bf1bddb1098291128c414cdb6eec85c
interface WeatherDetail {
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
  const { isPending, error, data } = useQuery({
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

  const mostCurrentData = data.list[0];

  return (
    <div className="flex flex-col gap-4 bg-gray-100 min-h-screen">
      <Navbar />
      <main className="px-3 max-w-7xl mx-auto flex flex-col gap-9 w-full pb-10 pt-4">
        {/* today's data */}
        <section className="space-y-4">
          <div className="space-y-2">
            <h2 className="flex gap-1 text-2xl items-end">
              <p>{format(parseISO(mostCurrentData.dt_txt ?? ""), "EEEE")}</p>
              <p className="text-lg">
                {format(parseISO(mostCurrentData.dt_txt ?? ""), "dd.mm.yyyy")}
              </p>
            </h2>
            <Container className="gap-10 px-6 items-center">
              <div className="flex flex-col px-4">
                <span className="text-5xl">
                  {convertKelvinToFahrenheit(
                    mostCurrentData?.main.temp ?? 296.37
                  )}
                  °
                </span>
                <p className="text-xs space-x-1 whitespace-nowrap">
                  <span>Feels like</span>
                  <span>
                    {convertKelvinToFahrenheit(
                      mostCurrentData?.main.feels_like ?? 296.37
                    )}
                    °
                  </span>
                </p>
                <p className="text-xs space-x-2">
                  <span>
                    {convertKelvinToFahrenheit(
                      mostCurrentData?.main.temp_min ?? 0
                    )}
                    °↓
                  </span>
                  <span>
                    {convertKelvinToFahrenheit(
                      mostCurrentData?.main.temp_max ?? 0
                    )}
                    °↑
                  </span>
                </p>
              </div>
              <div className="flex gap-10 sm:gap-16 overflow-x-auto w-full justify-between pr-3">
                {data.list.map((data: WeatherDetail, index: number) => (
                  <div key={index} className="flex flex-col justify-between gap-2 items-center text-xs font-semibold"></div>
                ))}
              </div>
            </Container>
          </div>
        </section>
        {/* 7 day forecast */}
        <section></section>
      </main>
    </div>
  );
}
