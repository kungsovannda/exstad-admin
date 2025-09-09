"use client";
import React, { useEffect, useState } from "react";

export default function Me() {
  const [user, setUser] = useState<string>("");
  useEffect(() => {
    fetch("http://localhost:8080/api/v1/users/me")
      .then((res) => res.json())
      .then((data) => console.log(data));
  }, []);
  return <div></div>;
}
