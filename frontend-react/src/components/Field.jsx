export function Field({ label, children }) {
  return (
    <div className="field">
      {label && <label className="field-label">{label}</label>}
      {children}
    </div>
  );
}

export function Input(props) {
  return (
    <input
      {...props}
      className="field-input"
    />
  );
}