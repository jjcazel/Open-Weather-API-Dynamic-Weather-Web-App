"use client";

import React, { useState } from "react";
import { MdOutlineLocationOn, MdWbSunny } from "react-icons/md";
import { MdOutlineMyLocation } from "react-icons/md";
import SearchBar from "./SearchBar";
import axios from "axios"; // Import the axios library
import { loadingCityAtom, placeAtom } from "@/app/atoms";
import { useAtom } from "jotai";

type Props = { location: string };

export default function Navbar({ location }: Props) {
  const [city, setCity] = useState("");
  const [error, setError] = useState("");
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  const [place, setPlace] = useAtom(placeAtom);
  const [_, setLoadingCity] = useAtom(loadingCityAtom);

  async function handleSearchCity(value: string) {
    setCity(value);
    if (value.length >= 3) {
      try {
        const response = await axios.get(
          // Use axios here
          `https://api.openweathermap.org/data/2.5/find?q=${value}&appid=${process.env.NEXT_PUBLIC_API_KEY}`
        );
        const suggestions = response.data.list.map((item: any) => `${item.name}, ${item.sys.country}`);
        setSuggestions(suggestions);
        setError("");
        setShowSuggestions(true);
        console.log(showSuggestions, "showSuggestions");
      } catch (error) {
        setSuggestions([]);
        setShowSuggestions(false);
      }
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  }

  function handleSearchSubmit(e: React.FormEvent<HTMLFormElement>) {
    setLoadingCity(true);
    e.preventDefault();
    if (suggestions.length < 1) {
      setError("No city found");
      setLoadingCity(false);
    } else {
      setError("");
      setTimeout(() => {
        setPlace(city);
        setLoadingCity(false);
        setShowSuggestions(false);
      }, 500);
    }
  }

  function handleSuggestionClick(suggestion: string) {
    setCity(suggestion);
    setShowSuggestions(false);
  }

  function handleCurrentLocationClick() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(async (position) => {
        const { latitude, longitude } = position.coords;
        try {
          setLoadingCity(true);
          const response = await axios.get(
            `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${process.env.NEXT_PUBLIC_API_KEY}`
          );
          setTimeout(() => {
            setLoadingCity(false);
            setPlace(response.data.name);
          }, 500);
        } catch (error) {
          setLoadingCity(false);
        }
      });
    }
  }

  return (
    <>
      <nav className="shadow-sm sticky top 0 left 0 z-50 bg-white">
        <div className="h-[80px] w-full flex justify-between items-center max-w-7xl px-3 mx-auto">
          <p className="flex items-center justify-center gap-2">
            <h2 className="text-gray-500 text-3xl">Weather</h2>
            <MdWbSunny className="text-3xl mt-1 text-yellow-300" />
          </p>
          <section className="flex gap-2 items-center">
            <MdOutlineMyLocation
              title="Your current location"
              onClick={handleCurrentLocationClick}
              className="text-2xl text-gray-400 hover:opacity-80 cursor-pointer"
            />
            <MdOutlineLocationOn className="text-3xl " />
            <p className="text-slate-900/90 text-sm"> {location} </p>
            <div className="relative hidden md:flex">
              <SearchBar
                value={city}
                onSubmit={handleSearchSubmit}
                onChange={(e) => handleSearchCity(e.target.value)}
              />
              <SuggestionBox
                {...{
                  suggestions,
                  showSuggestions,
                  handleSuggestionClick,
                  error,
                }}
              />
            </div>
          </section>
        </div>
      </nav>
      <section className="flex max-w-7xl px-3 md:hidden">
        <div className="relative">
          <SearchBar
            value={city}
            onSubmit={handleSearchSubmit}
            onChange={(e) => handleSearchCity(e.target.value)}
          />
          <SuggestionBox
            {...{
              suggestions,
              showSuggestions,
              handleSuggestionClick,
              error,
            }}
          />
        </div>
      </section>
    </>
  );
}

function SuggestionBox({
  suggestions,
  showSuggestions,
  handleSuggestionClick,
  error,
}: {
  suggestions: string[];
  showSuggestions: boolean;
  handleSuggestionClick: (item: string) => void;
  error: string;
}) {
  return (
    <div>
      {((showSuggestions && suggestions.length > 1) || error) && (
        <ul
          className="mb-4 bg-white absolute border top-[44px] left-0 border-gray-300 rounded-md min-w-[200px] 
      flex flex-col gap-1 py-2 px-2"
        >
          {error && suggestions.length < 1 && (
            <li className="text-red-500 p-1">{error}</li>
          )}
          {suggestions.map((suggestion, idx) => (
            <li
              key={idx}
              className="cursor-pointer p-1 rounded hover:bg-gray-200"
              onClick={() => handleSuggestionClick(suggestion)}
            >
              {suggestion}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
