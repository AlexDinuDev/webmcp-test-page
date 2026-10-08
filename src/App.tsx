import { useState } from "react";
import ContactForm, { type FormData } from "./components/ContactForm";
import WebMCPStatus from "./components/WebMCPStatus";
import { useStartHereTool } from "./webmcp";
import { APP_VERSION } from "./version";

const initialFormData: FormData = {
  firstName: "",
  lastName: "",
  dob: "",
  addressLine: "",
  city: "",
  zip: "",
  state: "",
  phone: "",
  email: "",
  vin: "",
  make: "",
  model: "",
  year: "",
  hasAutoInsurance: "",
  gender: "",
  maritalStatus: "",
  militaryService: "",
  licenseAge: "",
  movingViolations: "",
  consent: false,
  ownership: "",
  parkedAtAddress: "",
  purchasedLast90Days: "",
  drivewiseInterest: "",
  buyingReason: "",
};

export default function App() {
  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [lastClickedLabel, setLastClickedLabel] = useState<string | null>(null);

  const updateField = <K extends keyof FormData>(field: K, value: FormData[K]) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = () => {
    console.log("Button clicked");
    setLastClickedLabel(
      `${formData.firstName || "(empty)"} ${formData.lastName || "(empty)"} at ${new Date().toLocaleTimeString()}`
    );
  };

  useStartHereTool({
    setField: updateField,
    getFormData: () => formData,
    clickButton: handleSubmit,
  });

  return (
    <main className="page">
      <h1>WebMCP Test Page</h1>
      <p className="muted">
        A minimal page for testing whether an AI agent can discover and invoke a WebMCP tool
        (<code>start_here</code>) exposed via <code>document.modelContext</code>.
      </p>

      <ContactForm
        formData={formData}
        onFieldChange={updateField}
        onSubmit={handleSubmit}
        lastClickedLabel={lastClickedLabel}
      />

      <WebMCPStatus />

      <footer className="version-footer">Version {APP_VERSION}</footer>
    </main>
  );
}

