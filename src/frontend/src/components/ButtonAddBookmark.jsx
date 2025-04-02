const ButtonAddBookmark = () => {
  const handleClick = () => {
    console.log("Clicked!");
  };
  return <button onClick={handleClick}>Add bookmark</button>;
};

export default ButtonAddBookmark;
