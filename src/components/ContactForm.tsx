interface ContactFormProps {
  firstName: string;
  lastName: string;
  onFirstNameChange: (value: string) => void;
  onLastNameChange: (value: string) => void;
  onSubmit: () => void;
  lastClickedLabel: string | null;
}

export default function ContactForm({
  firstName,
  lastName,
  onFirstNameChange,
  onLastNameChange,
  onSubmit,
  lastClickedLabel,
}: ContactFormProps) {
  return (
    <section className="card">
      <h2>Contact form</h2>
      <div className="field">
        <label htmlFor="first-name">First name</label>
        <input
          id="first-name"
          type="text"
          value={firstName}
          onChange={(e) => onFirstNameChange(e.target.value)}
          placeholder="Ada"
        />
      </div>
      <div className="field">
        <label htmlFor="last-name">Last name</label>
        <input
          id="last-name"
          type="text"
          value={lastName}
          onChange={(e) => onLastNameChange(e.target.value)}
          placeholder="Lovelace"
        />
      </div>
      <button type="button" onClick={onSubmit}>
        Submit
      </button>
      {lastClickedLabel && <p className="muted">Last clicked: {lastClickedLabel}</p>}
    </section>
  );
}
