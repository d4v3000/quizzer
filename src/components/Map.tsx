import { maps } from "@constants/maps";
import { useQuizStore } from "@utils/zustand/quizStore";
import { useEffect, useState } from "react";
import {
  ComposableMap,
  Geographies,
  Geography,
  Marker,
  ZoomableGroup,
} from "react-simple-maps";

const Map = () => {
  const currentQuestion = useQuizStore(
    (state) => state.questions[state.currentQuestion]!.locationAnswer!
  );
  const mapName = useQuizStore(
    (state) => state.questions[state.currentQuestion]!.locationAnswer!.mapName
  );

  const [currentMap, setCurrentMap] = useState(
    maps.find((item) => item.text === mapName)!
  );

  useEffect(() => {
    setCurrentMap(maps.find((item) => item.text === mapName)!);
  }, [mapName]);

  return (
    <ComposableMap
      className="aspect-video rounded-md bg-zinc-800"
      projection="geoMercator"
    >
      <ZoomableGroup
        maxZoom={currentMap.maxZoom}
        minZoom={currentMap.minZoom}
        center={currentMap.center as [number, number]}
        zoom={currentMap.minZoom}
      >
        <Geographies geography={currentMap.url}>
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
                      stroke: currentQuestion.withOutlines ? "#000" : "#fff",
                      strokeWidth: currentMap.minZoom >= 4 ? 0.1 : 0.5,
                    },
                    hover: {
                      stroke: currentQuestion.withOutlines ? "#000" : "#fff",
                      strokeWidth: currentMap.minZoom >= 4 ? 0.1 : 0.5,
                    },
                  }}
                />
              );
            })
          }
        </Geographies>
        {currentQuestion.lat && currentQuestion.lon && (
          <Marker coordinates={[currentQuestion.lon, currentQuestion.lat]}>
            <circle r={currentMap.minZoom >= 4 ? 0.3 : 1} fill="#6d28d9" />
            <text
              textAnchor="end"
              fill="#6d28d9"
              fontSize={`${currentMap.minZoom >= 4 ? "0.1em" : "0.4em"}`}
              dx={-1}
              fontWeight={500}
            >
              {currentQuestion.placeName}
            </text>
          </Marker>
        )}
      </ZoomableGroup>
    </ComposableMap>
  );
};

export default Map;
