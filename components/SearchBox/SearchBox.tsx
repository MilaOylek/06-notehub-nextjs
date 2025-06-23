import React from "react";
import styles from "./SearchBox.module.css";

interface SearchBoxProps {
  value: string;
  onChange: (newValue: string) => void;
  placeholder?: string;
}

function SearchBox({
  value,
  onChange,
  placeholder = "Search notes",
}: SearchBoxProps) {
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      console.log("SearchBox: Input changed to:", event.target.value);
    onChange(event.target.value);
  };

  return (
    <input
      className={styles.input}
      type="text"
      placeholder={placeholder}
      value={value}
      onChange={handleChange}
    />
  );
}

export default SearchBox;