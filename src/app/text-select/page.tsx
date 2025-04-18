"use client";
import React, { useEffect } from "react";

function TextSelect() {
  const selectText = () => {
    console.log(document.getSelection()?.toString());
  };

  useEffect(() => {
    document.addEventListener("selectionchange", selectText);
    return () => {
      document.removeEventListener("selectionchange", selectText);
    };
  }, []);

  return (
    <div>
      Lorem ipsum dolor sit amet consectetur adipisicing elit. Voluptatem
      officia officiis quibusdam sapiente minima at dicta, necessitatibus enim
      sequi esse possimus nesciunt molestiae, facere dolorem ab reiciendis
      asperiores numquam nobis?
    </div>
  );
}

export default TextSelect;
