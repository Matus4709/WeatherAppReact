import React, { useState, useEffect } from "react";
import axios from "axios";
import Typography from "@mui/joy/Typography";
import Input from "@mui/joy/Input";
import "./App.css";
import { Box, Button } from "@mui/joy";

// React
import { motion } from "framer-motion";

const App = () => {
  const [weatherData, setWeatherData] = useState(null);
  const [location, setLocation] = useState("");
  const [error, setError] = useState(null);
  const API_KEY = "15af8fe03ada9f85c492f6afe564ef4d";
  useEffect(() => {
    fetchWeatherByGeolocation();
  }, []);

  //pobieranie pogody na podstawie lokalizacji
  const fetchWeather = async (lat = null, lon = null) => {
    try {
      let url;
      if (lat && lon) {
        url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric&lang=pl`;
      } else if (location) {
        url = `https://api.openweathermap.org/data/2.5/weather?q=${location}&appid=${API_KEY}&units=metric&lang=pl`;
      }

      if (url) {
        const response = await axios.get(url);
        setWeatherData(response.data);
        setError(null); // Wyczyść błędy, jeśli istnieją
      }
    } catch (err) {
      setError("Nie udało się pobrać danych pogodowych. Sprawdź lokalizację.");
    }
  };

  //pobieranie na podstawie geolokalizacji
  const fetchWeatherByGeolocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          fetchWeather(latitude, longitude);
        },
        (error) => {
          setError(
            "Nie udało się uzyskać lokalizacji. Spróbuj wpisać ręcznie."
          );
        }
      );
    } else {
      setError("Twoja przeglądarka nie wspiera geolokalizacji.");
    }
  };
  // Pobierz pogodę, kiedy użytkownik wpisze lokalizację
  const handleSubmit = (e) => {
    e.preventDefault();
    fetchWeather();
  };

  const container = {
    hidden: { opacity: 1, scale: 0 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        delayChildren: 0.3,
        staggerChildren: 0.2,
      },
    },
  };

  const item = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
    },
  };

  return (
    <div className="bg-gradient-to-r from-slate-900 to-zinc-800 ... w-full h-screen">
      <div className="container mx-auto flex justify-evenly items-center text-center text-white">
        <motion.div
          initial={{ opacity: 0, scale: 1, y: 0 }}
          animate={{ opacity: 1, scale: 1, y: 100 }}
          transition={{ ease: "easeInOut", duration: 1 }}
        >
          <div></div>
          <Box
            className="p-6 rounded-md shadow-lg"
            sx={{
              background: "rgba(0, 0, 0, 0.1)",
              borderRadius: "10px",
              border: "1px",
              width: "500px",
            }}
          >
            <div className="pb-4">
              <Typography color="white" level="h2" variant="plain">
                Aplikacja pogodowa
              </Typography>
            </div>
            <form onSubmit={handleSubmit}>
              <Input
                color="primary"
                type="text"
                size="lg"
                variant="soft"
                placeholder="Wpisz lokalizację (np. Warszawa)"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                style={{ padding: "10px", fontSize: "16px" }}
              />
              <div className="mt-2">
                <motion.div
                  whileHover={{
                    scale: 1.05,
                    boxShadow: "1px 3px 19px -7px rgba(13, 110, 253, 1)",
                  }}
                >
                  <Button
                    color="primary"
                    size="lg"
                    className="w-full mt-3"
                    type="submit"
                  >
                    Sprawdź pogodę
                  </Button>
                </motion.div>
              </div>
            </form>
            <div className="mt-2"></div>
            <motion.div
              whileHover={{
                scale: 1.05,
                boxShadow: "1px 3px 19px -7px rgba(13, 110, 253, 1)",
              }}
            >
              <Button
                color="neutral"
                size="lg"
                onClick={fetchWeatherByGeolocation}
                className="w-full mt-5"
              >
                Pobierz pogodę z geolokalizacji
              </Button>
            </motion.div>

            {error && <p style={{ color: "red" }}>{error}</p>}

            {weatherData && (
              <div style={{ marginTop: "20px" }}>
                <motion.ul
                  className="container font-normal"
                  variants={container}
                  initial="hidden"
                  animate="visible"
                >
                  {[0].map((index) => (
                    <motion.li key={0} className="item pb-1" variants={item}>
                      <b className="font-bold">Lokalizacja:</b>{" "}
                      {weatherData.name}
                    </motion.li>
                  ))}
                  {[1].map((index) => (
                    <motion.li key={0} className="item pb-1" variants={item}>
                      <div className="flex justify-center">
                        <b className="font-bold">Temperatura:</b>{" "}
                        {weatherData.main.temp} °C
                        <div className="-top-4 right-24 absolute">
                          <img
                            src={`https://openweathermap.org/img/wn/${weatherData.weather[0].icon}.png`}
                            alt="Weather Icon"
                          />
                        </div>
                      </div>
                    </motion.li>
                  ))}
                  {[2].map((index) => (
                    <motion.li key={0} className="item pb-1" variants={item}>
                      <b className="font-bold">Opis:</b>{" "}
                      {weatherData.weather[0].description}
                    </motion.li>
                  ))}
                  {[3].map((index) => (
                    <motion.li key={0} className="item pb-1" variants={item}>
                      {" "}
                      <b className="font-bold">Wilgotność:</b>{" "}
                      {weatherData.main.humidity}%
                    </motion.li>
                  ))}
                  {[4].map((index) => (
                    <motion.li key={0} className="item pb-1" variants={item}>
                      <b className="font-bold">Wiatr:</b>{" "}
                      {weatherData.wind.speed} m/s
                    </motion.li>
                  ))}
                </motion.ul>
              </div>
            )}
          </Box>
          <div></div>
        </motion.div>
      </div>
    </div>
  );
};
export default App;
