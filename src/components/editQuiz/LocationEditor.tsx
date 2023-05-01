import { ChevronUpDownIcon } from "@heroicons/react/24/outline";
import { useQuizStore } from "@utils/zustand/quizStore";
import { useState } from "react";
import {
  ComposableMap,
  Geographies,
  Geography,
  ZoomableGroup,
  Annotation,
} from "react-simple-maps";
import * as Switch from "@radix-ui/react-switch";
import Input from "@ui/Input";
import Button from "@ui/Button";
import Select from "@ui/Select";
import { SubmitHandler, useForm } from "react-hook-form";

const maps = [
  {
    text: "World",
    value:
      "https://raw.githubusercontent.com/deldersveld/topojson/master/world-countries-sans-antarctica.json",
  },
  {
    text: "Europe",
    value:
      "https://raw.githubusercontent.com/deldersveld/topojson/master/continents/europe.json",
  },
  {
    text: "Dach",
    value:
      "https://raw.githubusercontent.com/deldersveld/topojson/master/countries/germany/dach-states.json",
  },
  {
    text: "USA",
    value:
      "https://raw.githubusercontent.com/deldersveld/topojson/master/countries/united-states/us-albers.json",
  },
  {
    text: "North America",
    value:
      "https://raw.githubusercontent.com/deldersveld/topojson/master/continents/north-america.json",
  },
];

interface IFormInputs {
  place: string;
  coordinates: string;
}

const LocationEditor = () => {
  const [coordinates, setCoordinates] = useState<{
    lat: number;
    lon: number;
  }>();
  const [placeName, setPlaceName] = useState("");
  const [showOutlines, setShowOutlines] = useState(false);
  const [geoUrl, setGeoUrl] = useState(
    "https://raw.githubusercontent.com/deldersveld/topojson/master/world-countries-sans-antarctica.json"
  );
  const questions = useQuizStore((state) => state.questions);
  const currentQuestion = useQuizStore((state) => state.currentQuestion);

  const parseCoordinates = (coords: string) => {
    // Split the string into two parts: the latitude and longitude
    const parts = coords.split(", ");

    // Parse the latitude
    const latString = parts[0]!.trim();
    const lat = parseFloat(latString);
    const isSouth = latString.endsWith("S");

    // Parse the longitude
    const longString = parts[1]!.trim();
    const long = parseFloat(longString);
    const isWest = longString.endsWith("W");

    // If the coordinate is south or west, negate the number
    const latNumber = isSouth ? -lat : lat;
    const longNumber = isWest ? -long : long;

    // Return the result as an object with the latitude and longitude properties
    setCoordinates({ lat: latNumber, lon: longNumber });
  };

  const addMarker = (data: IFormInputs) => {
    parseCoordinates(data.coordinates);
    setPlaceName(data.place);
  };

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<IFormInputs>();
  const onSubmit: SubmitHandler<IFormInputs> = (data) => addMarker(data);

  return (
    <div className="flex flex-col gap-3 py-4">
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <div className="w-min text-base leading-none text-white">Map: </div>
          <div className="flex w-fit items-center gap-1 rounded-md bg-zinc-800 text-zinc-200">
            <Select
              value={geoUrl}
              items={maps}
              onValueChange={(value) => setGeoUrl(value)}
              icon={<ChevronUpDownIcon className="h-4 w-4" />}
              className="w-full"
            />
          </div>
          <div className="flex items-center gap-2">
            <label className="text-base leading-none text-white">
              Show Outlines:
            </label>
            <Switch.Root
              checked={showOutlines}
              onCheckedChange={() => setShowOutlines(!showOutlines)}
              className="relative h-[25px] w-[42px] cursor-default rounded-full bg-zinc-600 outline-none focus-visible:shadow-[0_0_0_2px] focus-visible:shadow-white data-[state=checked]:bg-violet-700"
            >
              <Switch.Thumb className="shadow-blackA7 block h-[21px] w-[21px] translate-x-0.5 rounded-full bg-white shadow-[0_2px_2px] transition-transform duration-100 will-change-transform data-[state=checked]:translate-x-[19px]" />
            </Switch.Root>
          </div>
        </div>
      </div>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="flex items-center gap-2">
          <label
            htmlFor="place"
            className="w-min text-base leading-none text-white"
          >
            Place:
          </label>
          <Input
            type="text"
            id="place"
            {...register("place", {
              required: { value: true, message: "Place required" },
            })}
          />
          {errors.place && (
            <div className="text-red-400">{errors.place.message}</div>
          )}
          <label
            htmlFor="coordinates"
            className="w-min text-base leading-none text-white"
          >
            Coordinates:
          </label>
          <Input
            type="text"
            id="coordinates"
            {...register("coordinates", {
              required: { value: true, message: "Coordinates required" },
              pattern: {
                value:
                  /^([-+]?\d+(?:\.\d+)?)°\s*([NS]),\s*([-+]?\d+(?:\.\d+)?)°\s*([EW])$/,
                message: "invalid pattern",
              },
            })}
          />
          {errors.coordinates && (
            <div className="text-red-400">{errors.coordinates.message}</div>
          )}
          <Button className="w-1/2" intent="secondary" type="submit">
            Apply Place
          </Button>
        </div>
      </form>
      <ComposableMap
        className="aspect-video rounded-md bg-zinc-800"
        projection="geoMercator"
      >
        <ZoomableGroup maxZoom={30} minZoom={-10} scale={1}>
          <Geographies geography={geoUrl}>
            {({ geographies }) =>
              geographies.map((geo) => {
                return (
                  <Geography
                    key={geo.rsmKey}
                    geography={geo}
                    className="fill-white outline-none hover:outline-dotted"
                    tabIndex={-1}
                    style={{
                      default: {
                        stroke: showOutlines ? "#000" : "#fff",
                        strokeWidth: 0.5,
                      },
                      hover: {
                        stroke: showOutlines ? "#000" : "#fff",
                        strokeWidth: 0.5,
                      },
                    }}
                  />
                );
              })
            }
          </Geographies>
          {coordinates && (
            <>
              <Annotation
                subject={[coordinates.lon, coordinates.lat]}
                connectorProps={{
                  stroke: "#6d28d9",
                  strokeWidth: 0.5,
                  strokeLinecap: "round",
                }}
                dx={-45}
                dy={-15}
              >
                <text
                  x="-8"
                  textAnchor="end"
                  alignmentBaseline="middle"
                  fill="#6d28d9"
                >
                  {placeName}
                </text>
              </Annotation>
            </>
          )}
        </ZoomableGroup>
      </ComposableMap>
    </div>
  );
};

export default LocationEditor;
