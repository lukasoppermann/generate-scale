import { paste } from '@testing-library/user-event/dist/paste';

const saveToClipboard = (text: string) => {
  navigator.clipboard
    .writeText(text)
    .then(() => {
      console.log("JSON copied to clipboard");
    })
    .catch((err) => {
      console.error("Failed to copy JSON: ", err);
    });
};

const pasteFromClipboard = () => {
  navigator.clipboard
    .readText()
    .then((text) => {
      console.log("JSON pasted from clipboard");
      return text;
    })
    .catch((err) => {
      console.error("Failed to paste JSON: ", err);
    });
}

const clipboard = {
  copy: saveToClipboard,
  paste: pasteFromClipboard
};

export default clipboard