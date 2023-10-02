import React, { useState, useEffect, useContext } from "react";
import { Store } from "../Store";
import "../index.css";

function Theme() {
  const { state, dispatch: ctxDispatch } = useContext(Store);
  const { toggleState } = state;
  const theme = toggleState ? "dark" : "light";
  console.log(toggleState);
  const [isToggled, setIsToggled] = useState(toggleState);

  const handleToggle = () => {
    setIsToggled(!isToggled);
    if (isToggled) {
      // window.alert("Light theme activated");
    } else {
      // window.alert("Dark theme activated");
    }
  };
  useEffect(() => {
    ctxDispatch({ type: "TOGGLE_BTN", payload: isToggled });
    localStorage.setItem("toggleState", JSON.stringify(isToggled));
  }, [isToggled]);

  return (
    <>
      <div class="form-check form-switch">
        <input
          class="form-check-input"
          type="checkbox"
          id="flexSwitchCheckDefault"
          onClick={handleToggle}
          checked={isToggled}
        />
        <label class="form-check-label" for="flexSwitchCheckDefault"></label>
      </div>
    </>
  );
}

export default Theme;