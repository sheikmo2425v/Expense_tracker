const Loading = () => {
  return (
    <>
      <div className="loading">
        <div className="center">
          <div
            class="spinner-border"
            role="status"
            style={{ marginTop: "20%" }}
          >
            <span class="visually-hidden">Loading...</span>{" "}
          </div>
        </div>
      </div>
    </>
  );
};

export default Loading;
