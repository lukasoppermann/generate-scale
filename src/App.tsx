import React, { useEffect, useState } from "react";
import "./App.css";
import { Button, Header, Scale, Sidebar } from "./components";
import { useThemeContext } from "./contexts";
import Configuration from "./Configuration";
import { useConfigContext } from "./contexts/configContext";
import { Scale as ScaleType } from "./contexts/scaleContext";
import { Mode } from "./contexts/themeContext";
import { deleteScale, getScales, storeScale } from "./utils/scales";
const huename = require("hue-name");

function App() {
  const { theme } = useThemeContext();
  const { config } = useConfigContext();
  const [isOpen, setOpen] = useState(false);
  const [selectedStep, setSelectedStep] = useState<number | undefined>();
  const [scales, setScales] = useState<ScaleType[]>([]);

  useEffect(() => {
    setScales(getScales());
  }, []);

  const addScale = () => {
    const uuid = Math.random().toString(36).substring(2, 15);
    const newHue = Math.floor(Math.random() * 360);
    const newScale = {
      id: uuid,
      name: huename(newHue),
      theme: theme,
      hue: newHue,
      hueChange: 0,
      saturation: 100,
      saturationChange: 0,
    };
    // add to local storage
    storeScale(newScale);
    // set state
    setScales([...scales, newScale]);
  };

  const updateScale = (
    id: string,
    key: keyof ScaleType,
    value: number | string
  ) => {
    const currentIndex = scales.findIndex((scale) => scale.id === id);
    const newScales = [...scales];
    // @ts-ignore
    newScales[currentIndex][key] = value;
    // update local storage
    storeScale(newScales[currentIndex]);
    // set state
    setScales(newScales);
  };

  const removeScale = (id: string) => {
    const newScales = scales.filter((scale) => scale.id !== id);
    // delete from local storage
    deleteScale(id);
    // set state
    setScales(newScales);
  };

  const scrollHorizontally = (event: React.WheelEvent<HTMLDivElement>) => {
    event.currentTarget.scrollLeft += event.deltaY;
  };

  return (
    <div
      className={`App mode-${theme}`}
      style={
        {
          "--page-bg": config[theme as Mode].bg,
        } as React.CSSProperties
      }
    >
      <Header toggleSidebar={() => setOpen(!isOpen)} />
      <Sidebar
        isOpen={isOpen}
        toggle={() => setOpen(!isOpen)}
        position="right"
        title="Configuration"
      >
        <Configuration />
      </Sidebar>
      <div className="scales-container" onWheel={scrollHorizontally}>
        <div className="scales">
          {scales
            .filter((scale) => scale.theme === theme)
            .map((scale) => (
              <Scale
                key={`scale-${theme}-${scale.id}`}
                onChange={updateScale}
                onRemove={removeScale}
                onSelectStep={(step?: number) => {
                  setSelectedStep(step);
                }}
                selectedStep={selectedStep}
                {...scale}
              />
            ))}
        </div>
      </div>
      <Button onClick={addScale}>Add Scale</Button>
    </div>
  );
}

export default App;
