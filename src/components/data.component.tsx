type DataProps = {
  data: unknown;
  color: 'alert-danger' | 'alert-info' | 'alert-secondary';
};

// Data is a dumb display component that accepts anything in the form
// of an object or array and displays a neatly printed JSON
// representation if it's not empty
const Data: React.FC<DataProps> = ({ data, color }) => {
  if (
    (Array.isArray(data) && data.length !== 0) ||
    (typeof data === 'object' && data !== null && Object.keys(data).length !== 0)
  ) {
    return (
      <>
        <div className={`alert ${color}`} role="alert">
          <pre data-testid="json-data">{JSON.stringify(data, null, 2)}</pre>
        </div>
      </>
    );
  }
  return <div data-testid="div-empty" />;
};

export default Data;
