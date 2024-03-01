import React, { useEffect, useState } from "react";
import "./App.css";
import { Button, Header, Scale, Sidebar } from "./components";
import { useThemeContext } from "./contexts";
import Configuration from "./Configuration";
import { useConfigContext } from "./contexts/configContext";
import { Scale as ScaleType } from "./contexts/scaleContext";
import { Mode } from "./contexts/themeContext";
import { deleteScale, getScales, storeScale } from "./utils/scales";
import ImportDialog from "./components/ImportDialog/ImportDialog";
import { setLocalStorage } from "./utils/localStorage";
const huename = require("hue-name");

function App() {
  const { theme } = useThemeContext();
  const { config, setConfigObject } = useConfigContext();
  const [isOpen, setOpen] = useState(false);
  const [isImportDialogOpen, setImportDialogOpen] = useState(false);
  const [selectedStep, setSelectedStep] = useState<number | undefined>();
  const [scales, setScales] = useState<ScaleType[]>([]);

  useEffect(() => {
    setScales(getScales());
  }, []);

  const validateScales = (scales: unknown) => {
    if (
      !scales ||
      typeof scales !== "object" ||
      !("light" in scales) ||
      !("dark" in scales) ||
      !Array.isArray(scales.light) ||
      !Array.isArray(scales.dark)
    ) {
      throw new Error("Invalid scales data");
    }
    return true;
  };

  const importScales = (data: string) => {
    let parsedData = {};
    try {
      //@ts-ignore
      parsedData = JSON.parse(data);
    } catch (error) {
      console.error("Invalid JSON data provided", error);
      return { error: "Invalid JSON data provided" };
    }
    if (!("scales" in parsedData) || !("config" in parsedData)) {
      return {
        error: 'Invalid JSON object, must have "scales" and "config" property.',
      };
    }
    try {
      setConfigObject(parsedData.config);
      try {
        validateScales(parsedData.scales);
      } catch (e) {
        // @ts-ignore
        return { error: e.message };
      }

      const importedScales = [
        // @ts-ignore
        ...parsedData.scales.light,
        // @ts-ignore
        ...parsedData.scales.dark,
      ] as ScaleType[];
      setLocalStorage("SCALES", importedScales);
      setScales(importedScales);
    } catch (error) {
      console.error("Invalid JSON data provided", error);
      return { error: "Invalid JSON data provided" };
    }
    return {
      error: null,
    };
  };

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
          "--page-bg": config?.[theme as Mode]?.bg,
        } as React.CSSProperties
      }
    >
      <Header
        toggleSidebar={() => setOpen(!isOpen)}
        openImportDialog={() => setImportDialogOpen(true)}
      />
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
      <ImportDialog
        open={isImportDialogOpen}
        setOpen={setImportDialogOpen}
        runOnSubmit={importScales}
      />
    </div>
  );
}

export default App;
