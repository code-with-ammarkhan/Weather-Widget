"use client";
import { useState, ChangeEvent, FormEvent } from "react";
import { Card, CardTitle, CardHeader, CardDescription, CardContent } from "@/components/ui/card";
import {Input} from "@/components/ui/input"
import { Button } from "@/components/ui/button";
import { CloudIcon, MapPinIcon, ThermometerIcon } from "lucide-react";//lucide icon library

interface WeatherData{
    temprature: number;
    description:string;
    location:string;
    unit:string;

}

export default function WeatherWidget(){//
    const [location,setlocation] = useState<string>("");//users location name will save here . first location will be empty
    const [weather, setWeather] = useState<WeatherData | null>(null);//in weather : store api data , setweather :it will update api data ,until unless it gets data from api it will remain null
    const [error, setError] = useState<string | null>(null);
    const[isLoading, setIsLoading] = useState<boolean>(false);

    const handleSearchc= async(e: FormEvent<HTMLFormElement>)=>{
        e.preventDefault();

        const trimmedLocation = location.trim();//to remove space in given input
        if(trimmedLocation ===""){//if location is null or with spaces
            setError("please Enter a Valid Location");
            setWeather(null);
            return;
        }
        setIsLoading(true);
        setError(null);

        try{
            const response = await fetch (
                `https://api.weatherapi.com/v1/current.json?key=${process.env.NEXT_PUBLIC_WEATHER_API_KEY}&q=${trimmedLocation}`
            );
            if(!response.ok){//if response is not ok it will show this error
                throw new Error('city not found.');
            }
            const data= await response.json();//api data converts it all in json form
            const weatherData: WeatherData={//its an object and it stores all api data 
                temprature : data.current.temp_c,
                description: data.current.condition.text,
                location:data.location.name,
                unit:"C",
            };
              setWeather(weatherData);

        }catch(error){
            setError('City not found.Please try again');
            setWeather(null);

        }finally{
            setIsLoading(false)//it will keep loading till search or error
        }

    };
    function getTempratureMessage(temprature:number,unit:string): string {
        if(unit=="C"){
            if(temprature <0){
                return  `It's freezing at ${temprature}°C! Bundle up`;

            }else if(temprature <10){
                return `its quite cold at ${temprature}°C .Wear warm Clothes.`;
            }else if (temprature <20){
                return `aThe temprature is  ${temprature}°C . Comfortable for a light jacket.`;
            }else if(temprature <30){
                return `Its is a pleasant ${temprature}°C. Enjoy the nice weather!.`;
            }else {
                return `Its hot at ${temprature}°C .Stay hydrated!`;
            }
        }else{
            //placeholders for other temprature units(eg. fahreheit)
            return `${temprature}°${unit}`;
        }
    }

    function getWeatherMessage (description : string) : string{
        switch (description.toLocaleLowerCase()) {
            case"sunny":
             return "Its a beautiful sunny day !";
            case "partly cloudy":
                return "Expect some clouds and sunshine.";
            case "overcast":
                return "The sky is overcast.";
            case "rain":
                return "Dont forget your umbrella! its raining.";
            case "thunderstrom":
                return "Thunderstroms are expected today";
            case "snow":
                return "Bundle up! it's snowing.";
            case "mist":
                return "its misty outside.";
            case "fog":
                return "Be careful, there's fog outside.";
            default:
                return description; //default to returning the descriptionas-is

        }
    }

    function getLocationMessage (location: string):string{
        const currentHour = new Date().getHours();
        const isNight = currentHour >= 18 || currentHour <6;
        return `${location} ${isNight ? "at Night" : "During the Day"}`
    }

    return (//div is a html basic tag which works as a container
        <div className="flex jutify-center items-center h-screen">
            <Card className="w-full max-w-md mx-auto text-center"> 
                 <CardHeader>
                    <CardTitle>Weather Widget</CardTitle>
                    <CardDescription>Search for the current weather conditions in your city</CardDescription>
                 </CardHeader>
                 <CardContent>
                 <form onSubmit={handleSearchc} className="flex items-center gap-2">
                    <Input
                     type="text"
                     placeholder="Enter a city name"
                     value={location}
                     onChange={(e) => setlocation(e.target.value)}
                    />
                    <Button type="submit" disabled={isLoading}>
                        {isLoading ? "loading..." : "Search"}
                         </Button>
                     </form>
                     {error && <div className="mt-4 text-read-500">{error}</div>}
                    {weather && (
                        <div className="mt-4 grid gap-2"> 
                            <div className="flex item-center gap-2">
                                <ThermometerIcon className="w-6 h-6"/>
                                {getTempratureMessage(weather.temprature, weather.unit)}
                                 </div>
                            <div className="flex item-center gap-2">
                                <CloudIcon className="w-6 h-6"/>
                                {getWeatherMessage(weather.description )}
                                 </div>
                            <div className="flex item-center gap-2">
                                <MapPinIcon className="w-6 h-6"/>
                                {getLocationMessage(weather.location)}
                                 </div>
                        </div>
                    )}
                  </CardContent>
                {/* Copyright Text */}
                <p className="mt-6 text-sm text-black dark:text-gray-4 text-center font-bold">
                    ©Code With Ammar
                </p>
            </Card>
        </div>
    );
};
