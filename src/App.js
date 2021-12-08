import { useLayoutEffect, useState } from "react";
import "./styles.css";
import clsx from "clsx";
import { Reorder } from "framer-motion";

const initialColumns = ["1", "2", "3"];
const initialSelected = {
  first: { value: null, index: null },
  second: { value: null, index: null }
};

export default function App() {
  const [columns, setColumns] = useState(initialColumns);
  const [selected, setSelected] = useState(initialSelected);

  useLayoutEffect(() => {
    if (!selected.second.value) return;
    setColumns((prevColumns) => {
      const columnsCopy = [...prevColumns];
      columnsCopy[selected.first.index] = selected.second.value;
      columnsCopy[selected.second.index] = selected.first.value;
      return columnsCopy;
    });
    resetSelected();
  }, [selected]);

  const resetSelected = () => {
    setSelected(initialSelected);
  };

  const select = ({ target }, i) => {
    const selectedItem = { value: target.getAttribute("data-key"), index: i };
    const key = !selected.first.value ? "first" : "second";
    return setSelected((prev) => ({
      ...prev,
      [key]: selectedItem
    }));
  };

  return (
    <div className="App">
      <Reorder.Group values={columns} className="container">
        {columns.map((key, i) => (
          <Reorder.Item
            as="div"
            onClick={(e) => select(e, i)}
            dragListener={false}
            className={clsx("block", {
              selected: selected.first.value === key
            })}
            key={key}
            data-key={key}
          >
            {key}
          </Reorder.Item>
        ))}
      </Reorder.Group>
    </div>
  );
}
