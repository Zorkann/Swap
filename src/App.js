import { useEffect, useLayoutEffect, useState } from "react";
import "./styles.css";
import clsx from "clsx";

const initialColumns = [
  {
    key: "1"
  },
  {
    key: "2"
  },
  {
    key: "3"
  }
];

const getSelectedKeys = (...args) => {
  return args.map((ele) => ele?.getAttribute("data-key"));
};

const getCords = (...args) => {
  const [first, second] = args.map(
    (ele) => ele?.getBoundingClientRect().left || { left: 0 }
  );
  return first - second;
};
const getSelectedIndexes = (keys, columns) => {
  return keys.map((key, i) =>
    columns.findIndex(({ key: cKey }) => cKey === key)
  );
};

export default function App() {
  const [columns, setColumns] = useState(initialColumns);
  const [firstSelected, setFirstSelected] = useState(null);
  const [secondSelected, setSecondSelected] = useState(null);
  const selectedColumnsKeys = getSelectedKeys(firstSelected, secondSelected);
  const selectedColumnsIndexes = getSelectedIndexes(
    selectedColumnsKeys,
    columns
  );
  const changeInX = getCords(firstSelected, secondSelected);

  useLayoutEffect(() => {
    if (!firstSelected || !secondSelected) return;
    // Before the DOM paints, invert child to old position
    firstSelected.style.transform = `translateX(${changeInX}px)`;
    firstSelected.style.transition = "transform 0s";
    secondSelected.style.transform = `translateX(${-changeInX}px)`;
    secondSelected.style.transition = "transform 0s";

    requestAnimationFrame(() => {
      // After the previous frame, remove
      // the transistion to play the animation
      firstSelected.style.transform = "";
      firstSelected.style.transition = "transform 500ms";
      secondSelected.style.transform = "";
      secondSelected.style.transition = "transform 500ms";
    });
    const columnsCopy = [...columns];
    const [firstKey, secondKey] = selectedColumnsKeys;
    const [firstIdx, secondIdx] = selectedColumnsIndexes;
    if (columnsCopy[firstIdx] && columnsCopy[secondIdx]) {
      columnsCopy[firstIdx] = { key: secondKey };
      columnsCopy[secondIdx] = { key: firstKey };
    }

    setColumns(columnsCopy);
    resetSelected();
  }, [secondSelected]);

  const resetSelected = () => {
    setFirstSelected(null);
    setSecondSelected(null);
  };

  const select = (event) => {
    if (!firstSelected) {
      return setFirstSelected(event.target);
    }
    if (!secondSelected) {
      return setSecondSelected(event.target);
    }
  };

  return (
    <div className="App">
      {columns.map(({ key }) => (
        <div
          onClick={select}
          className={clsx("block", {
            selected: selectedColumnsKeys.includes(key)
          })}
          key={key}
          data-key={key}
        >
          {key}
        </div>
      ))}
    </div>
  );
}
