import React from "react";

const Notification = ({ message, status }) => {
  if (message === null) {
    return null;
  }

  const notificationStyle = {
    color: status === "success" ? "green" : "red",
    background: "lightgrey",
    fontSize: 20,
    borderStyle: "solid",
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
  };

  return (
    <div style={notificationStyle} className={status}>
      {message}
    </div>
  );
};

export default Notification;