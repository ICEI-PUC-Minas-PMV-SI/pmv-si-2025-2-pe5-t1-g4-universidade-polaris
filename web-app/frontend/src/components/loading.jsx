export const Loading = () => {
  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '200px',
      }}
    >
      <div className="loading"></div>
      <span style={{ marginLeft: '1rem' }}>Loading...</span>
    </div>
  );
};
