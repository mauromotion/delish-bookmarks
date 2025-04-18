const CancelButton = ({ onclick }) => {
  return (
    <div>
      <button type="button" onClick={onclick}>
        Cancel
      </button>
    </div>
  );
};

export default CancelButton;
