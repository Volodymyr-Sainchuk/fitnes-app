export default function Input({ label, id, error, as = "input", ...props }) {
  const Component = as;

  return (
    <div className="field">
      {label ? (
        <label htmlFor={id} className="field-label">
          {label}
        </label>
      ) : null}
      <Component id={id} className={`field-input ${error ? "field-input-error" : ""}`.trim()} {...props} />
      {error ? <p className="field-error">{error}</p> : null}
    </div>
  );
}
