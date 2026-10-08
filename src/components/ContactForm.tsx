import type { FormEvent } from "react";

export interface FormData {
  firstName: string;
  lastName: string;
  dob: string;
  addressLine: string;
  city: string;
  zip: string;
  state: string;
  phone: string;
  email: string;
  vin: string;
  make: string;
  model: string;
  year: string;
  hasAutoInsurance: "" | "yes" | "no";
  gender: "" | "male" | "female";
  maritalStatus: "" | "single" | "married" | "widowed";
  militaryService: "" | "yes" | "no";
  licenseAge: string;
  movingViolations: "" | "yes" | "no";
  consent: boolean;
  ownership: "" | "own" | "finance" | "lease";
  parkedAtAddress: "" | "yes" | "no";
  purchasedLast90Days: "" | "yes" | "no";
  drivewiseInterest: "" | "yes" | "no";
}

interface ContactFormProps {
  formData: FormData;
  onFieldChange: <K extends keyof FormData>(field: K, value: FormData[K]) => void;
  onSubmit: () => void;
  lastClickedLabel: string | null;
}

const YES_NO_OPTIONS = [
  { value: "yes", label: "Yes" },
  { value: "no", label: "No" },
];

interface TextFieldProps {
  id: string;
  label: string;
  type?: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

function TextField({ id, label, type = "text", value, onChange, placeholder }: TextFieldProps) {
  return (
    <div className="field">
      <label htmlFor={id}>
        {label} <span className="required-mark">*</span>
      </label>
      <input
        id={id}
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        required
      />
    </div>
  );
}

interface RadioGroupFieldProps {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: { value: string; label: string }[];
}

function RadioGroupField({ id, label, value, onChange, options }: RadioGroupFieldProps) {
  return (
    <div className="field">
      <span className="field-label">
        {label} <span className="required-mark">*</span>
      </span>
      <div className="radio-group">
        {options.map((option) => (
          <label key={option.value} className="radio-option" htmlFor={`${id}-${option.value}`}>
            <input
              id={`${id}-${option.value}`}
              type="radio"
              name={id}
              value={option.value}
              checked={value === option.value}
              onChange={(e) => onChange(e.target.value)}
              required
            />
            {option.label}
          </label>
        ))}
      </div>
    </div>
  );
}

export default function ContactForm({ formData, onFieldChange, onSubmit, lastClickedLabel }: ContactFormProps) {
  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    onSubmit();
  };

  return (
    <section className="card">
      <h2>Auto insurance quote form</h2>
      <form onSubmit={handleSubmit}>

      <TextField id="first-name" label="First name" value={formData.firstName} onChange={(v) => onFieldChange("firstName", v)} placeholder="Ada" />
      <TextField id="last-name" label="Last name" value={formData.lastName} onChange={(v) => onFieldChange("lastName", v)} placeholder="Lovelace" />
      <TextField id="dob" label="Date of birth" type="date" value={formData.dob} onChange={(v) => onFieldChange("dob", v)} />
      <TextField id="address-line" label="Address line" value={formData.addressLine} onChange={(v) => onFieldChange("addressLine", v)} placeholder="123 Main St" />
      <TextField id="city" label="City" value={formData.city} onChange={(v) => onFieldChange("city", v)} />
      <TextField id="zip" label="Zip" value={formData.zip} onChange={(v) => onFieldChange("zip", v)} />
      <TextField id="state" label="State" value={formData.state} onChange={(v) => onFieldChange("state", v)} placeholder="IL" />
      <TextField id="phone" label="Phone" type="tel" value={formData.phone} onChange={(v) => onFieldChange("phone", v)} placeholder="555-123-4567" />
      <TextField id="email" label="Email" type="email" value={formData.email} onChange={(v) => onFieldChange("email", v)} placeholder="ada@example.com" />
      <TextField id="vin" label="VIN" value={formData.vin} onChange={(v) => onFieldChange("vin", v)} />
      <TextField id="make" label="Make" value={formData.make} onChange={(v) => onFieldChange("make", v)} placeholder="Honda" />
      <TextField id="model" label="Model" value={formData.model} onChange={(v) => onFieldChange("model", v)} placeholder="Civic" />
      <TextField id="year" label="Year" type="number" value={formData.year} onChange={(v) => onFieldChange("year", v)} placeholder="2020" />

      <RadioGroupField
        id="has-auto-insurance"
        label="Do you currently have auto insurance?"
        value={formData.hasAutoInsurance}
        onChange={(v) => onFieldChange("hasAutoInsurance", v as FormData["hasAutoInsurance"])}
        options={YES_NO_OPTIONS}
      />

      <RadioGroupField
        id="gender"
        label="Gender"
        value={formData.gender}
        onChange={(v) => onFieldChange("gender", v as FormData["gender"])}
        options={[
          { value: "male", label: "Male" },
          { value: "female", label: "Female" },
        ]}
      />

      <RadioGroupField
        id="marital-status"
        label="Marital status"
        value={formData.maritalStatus}
        onChange={(v) => onFieldChange("maritalStatus", v as FormData["maritalStatus"])}
        options={[
          { value: "single", label: "Single" },
          { value: "married", label: "Married" },
          { value: "widowed", label: "Widowed" },
        ]}
      />

      <RadioGroupField
        id="military-service"
        label="Are you or were you in the US military?"
        value={formData.militaryService}
        onChange={(v) => onFieldChange("militaryService", v as FormData["militaryService"])}
        options={YES_NO_OPTIONS}
      />

      <TextField
        id="license-age"
        label="What age did you get your license?"
        type="number"
        value={formData.licenseAge}
        onChange={(v) => onFieldChange("licenseAge", v)}
      />

      <RadioGroupField
        id="moving-violations"
        label="Any moving violations in the last 5 years?"
        value={formData.movingViolations}
        onChange={(v) => onFieldChange("movingViolations", v as FormData["movingViolations"])}
        options={YES_NO_OPTIONS}
      />

      <div className="checkbox-field">
        <input
          id="consent"
          type="checkbox"
          checked={formData.consent}
          onChange={(e) => onFieldChange("consent", e.target.checked)}
          required
        />
        <label htmlFor="consent">
          By checking this box, I am providing express consent to receive marketing and/or promotional
          communications. <span className="required-mark">*</span>
        </label>
      </div>

      <RadioGroupField
        id="ownership"
        label="Do you own, finance or lease?"
        value={formData.ownership}
        onChange={(v) => onFieldChange("ownership", v as FormData["ownership"])}
        options={[
          { value: "own", label: "Own" },
          { value: "finance", label: "Finance" },
          { value: "lease", label: "Lease" },
        ]}
      />

      <RadioGroupField
        id="parked-at-address"
        label="Is it parked at your address when not driven?"
        value={formData.parkedAtAddress}
        onChange={(v) => onFieldChange("parkedAtAddress", v as FormData["parkedAtAddress"])}
        options={YES_NO_OPTIONS}
      />

      <RadioGroupField
        id="purchased-last-90-days"
        label="Did you purchase the car in the last 90 days?"
        value={formData.purchasedLast90Days}
        onChange={(v) => onFieldChange("purchasedLast90Days", v as FormData["purchasedLast90Days"])}
        options={YES_NO_OPTIONS}
      />

      <RadioGroupField
        id="drivewise-interest"
        label="Are you interested in Drivewise?"
        value={formData.drivewiseInterest}
        onChange={(v) => onFieldChange("drivewiseInterest", v as FormData["drivewiseInterest"])}
        options={YES_NO_OPTIONS}
      />

      <button type="submit">
        Submit
      </button>
      </form>
      {lastClickedLabel && <p className="muted">Last clicked: {lastClickedLabel}</p>}
    </section>
  );
}
