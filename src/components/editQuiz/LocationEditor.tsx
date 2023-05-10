import { ChevronUpDownIcon } from "@heroicons/react/24/outline";
import { useQuizStore } from "@utils/zustand/quizStore";
import { useEffect } from "react";
import * as Switch from "@radix-ui/react-switch";
import Input from "@ui/Input";
import Button from "@ui/Button";
import Select from "@ui/Select";
import { SubmitHandler, useForm } from "react-hook-form";
import Map from "@components/Map";
import { maps } from "@constants/maps";
import { shallow } from "zustand/shallow";

interface IFormInputs {
  place: string;
  coordinates: string;
}

const LocationEditor = () => {
  const questions = useQuizStore((state) => state.questions, shallow);
  const currentQuestionIndex = useQuizStore((state) => state.currentQuestion);
  const currentQuestion = useQuizStore(
    (state) => state.questions[state.currentQuestion]!.locationAnswer!
  );
  const setQuestions = useQuizStore((state) => state.setQuestions);

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
    return { lat: latNumber, lon: longNumber };
  };

  const addMarker = (data: IFormInputs) => {
    const { lat, lon } = parseCoordinates(data.coordinates);
    const newQuestions = [...questions];
    newQuestions[currentQuestionIndex]!.locationAnswer!.lat = lat;
    newQuestions[currentQuestionIndex]!.locationAnswer!.lon = lon;
    newQuestions[currentQuestionIndex]!.locationAnswer!.placeName = data.place;
    setQuestions(newQuestions);
  };

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<IFormInputs>();
  const onSubmit: SubmitHandler<IFormInputs> = (data) => addMarker(data);

  useEffect(() => {
    setValue(
      "place",
      currentQuestion.placeName ? currentQuestion.placeName : ""
    );
    setValue(
      "coordinates",
      currentQuestion.lat && currentQuestion.lon
        ? `${
            currentQuestion.lat > 0
              ? `${currentQuestion.lat}° N`
              : `${-currentQuestion.lat}° S`
          }, ${
            currentQuestion.lon > 0
              ? `${currentQuestion.lon}° E`
              : `${-currentQuestion.lon}° W`
          }`
        : ""
    );
  }, [currentQuestion]);

  return (
    <div className="flex flex-col gap-3 py-4">
      <div className="flex items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-2 md:flex-nowrap">
          <div className="w-min text-base leading-none text-white">Map: </div>
          <div className="flex w-fit items-center gap-1 rounded-md bg-zinc-800 text-zinc-200">
            <Select
              value={
                maps.find((item) => item.text === currentQuestion.mapName)!.text
              }
              items={maps.map((map) => {
                return { text: map.text, value: map.text };
              })}
              onValueChange={(value) => {
                const newQuestions = [...questions];
                newQuestions[currentQuestionIndex]!.locationAnswer!.mapName =
                  value;
                setQuestions(newQuestions);
              }}
              icon={<ChevronUpDownIcon className="h-4 w-4" />}
              className="w-full"
            />
          </div>
          <div className="flex items-center gap-2">
            <label className="text-base leading-none text-white">
              Show Outlines:
            </label>
            <Switch.Root
              checked={currentQuestion.withOutlines}
              onCheckedChange={(value) => {
                const newQuestions = [...questions];
                newQuestions[
                  currentQuestionIndex
                ]!.locationAnswer!.withOutlines = value;
                setQuestions(newQuestions);
              }}
              className="relative h-[25px] w-[42px] cursor-pointer rounded-full bg-zinc-600 outline-none focus-visible:shadow-[0_0_0_2px] focus-visible:shadow-white data-[state=checked]:bg-violet-700"
            >
              <Switch.Thumb className="shadow-blackA7 block h-[21px] w-[21px] translate-x-0.5 rounded-full bg-white shadow-[0_2px_2px] transition-transform duration-100 will-change-transform data-[state=checked]:translate-x-[19px]" />
            </Switch.Root>
          </div>
        </div>
      </div>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="flex flex-wrap items-center gap-2 md:flex-nowrap">
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
          <Button className="w-full lg:w-1/2" intent="secondary" type="submit">
            Apply Place
          </Button>
        </div>
      </form>
      <Map />
    </div>
  );
};

export default LocationEditor;
