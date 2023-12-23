import React from "react";

export default function App() {
  const [count, setCount] = React.useState(0);

  return (
    <div>
      <h1>hello world</h1>
      <p>{count}</p>
      <button onClick={() => setCount((prevState) => prevState + 1)}>
        count++
      </button>
    </div>
  );
}
