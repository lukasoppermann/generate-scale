import { Config } from '../contexts/configContext';
import { Mode } from '../contexts/themeContext';
import { ScaleConfig, ScaleStep, generateScale } from './generateScale';
import { getLocalStorage } from './localStorage';
import clipboard from './saveToClipboard';
import save from 'save-file'
import { Scale } from './scales';

type ExportFormat = "json" | "primitives" | "figma"

type GeneratedScale = {
  name: string;
  id: string;
  config: ScaleConfig;
  steps: ScaleStep[];
};

const buildScale = (scales: Scale[], config: Config): Record<Mode, GeneratedScale[]> => {
  let result = {} as Record<Mode, GeneratedScale[]>;
  for (const themeName of ['light', 'dark']) {
    // generate scales for current theme in loop
    result[themeName as Mode] = scales.filter(scale => scale.theme === themeName).map((scale) => {
      const { name, id, ...rest } = scale

      const scaleConfig: ScaleConfig = {
        ...rest,
        theme: themeName as Mode,
        bg: config[themeName as Mode].bg,
        steps: config[themeName as Mode].steps
      }

      return {
        name,
        id,
        config: scaleConfig,
        steps: generateScale(scale.hue, scale.saturation, scaleConfig)
      }
    })
  }

  return result;
}

type Formatter = (scales: Record<Mode, GeneratedScale[]>) => string

const formatToJson: Formatter = (scales) => {
  return JSON.stringify(scales, null, 2)
}
const formatToPrimitives: Formatter = (scales) => {
  let result = {} as Record<Mode, unknown>;
  for (const themeName in scales) {
    result[themeName as Mode] = Object.fromEntries(scales[themeName as Mode].map((scale) => {
      const { name, steps } = scale
      return [
        name.toLowerCase(), {
          ...Object.fromEntries(steps.map((step) => ([step.index, {
            $value: step.hex,
            $type: 'color',
            $extensions: {
              'org.primer.figma': {
                "collection": `base/color/${themeName}`,
              },
            },
          }])))
        }
      ]
    }))
  }
  return JSON.stringify(result, null, 2)
}
const formatToFigma: Formatter = (scales) => {
  return Object.entries(scales).map(([themeName, scales]) => {
    return scales.reduce((acc, scale) => {
      const { name, steps } = scale
      acc += `name: ${name}\n`
        + `${steps.map((step) => step.hex).join("\n")}`
        + `\n\n`
      return acc
    }, "")
  }).join("")
}

const formatScales = (format: ExportFormat, scales: Record<Mode, GeneratedScale[]>) => {
  const formatter: Record<ExportFormat, Formatter> = {
    json: formatToJson,
    primitives: formatToPrimitives,
    figma: formatToFigma
  }
  // return result
  return formatter[format](scales)
}

export const exportScales = (format: ExportFormat) => {
  const config = getLocalStorage<Config>("CONFIG")!
  const scales = getLocalStorage<Scale[]>("SCALES")!
  // build scales
  const generatedScales = buildScale(scales, config);
  console.log(generatedScales)
  // format
  const result = formatScales(format, generatedScales);
  console.log(result)
  // save to clipboard
  clipboard.copy(result);
}

export const exportToFile = async (format: ExportFormat) => {
  const config = getLocalStorage<Config>("CONFIG")!
  const scales = getLocalStorage<Scale[]>("SCALES")!
  // build scales
  const generatedScales = buildScale(scales, config);
  // format
  const result = formatScales(format, generatedScales);
  // save file
  await save(result, `colorScales-${new Date().toLocaleDateString("en-US", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false
  })}.json`)
}