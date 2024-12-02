import React, { useState, useEffect } from "react";

// Simulated API response based on dropdown selection
const getFormStructure = (selection) => {
  const apiResponses = {
    "User Information": {
      fields: [
        { name: "firstName", type: "text", label: "First Name", required: true },
        { name: "lastName", type: "text", label: "Last Name", required: true },
        { name: "age", type: "number", label: "Age", required: false },
      ],
    },
    "Address Information": {
      fields: [
        { name: "street", type: "text", label: "Street", required: true },
        { name: "city", type: "text", label: "City", required: true },
        {
          name: "state",
          type: "dropdown",
          label: "State",
          options: ["Andhra Pradesh", "Bihar", "Karnataka", "Maharashtra", "Rajasthan", "Tamil Nadu", "Uttar Pradesh", "West Bengal"],
          
          required: true,
        },
        { name: "zipCode", type: "text", label: "Zip Code", required: false },
      ],
    },
    "Payment Information": {
      fields: [
        { name: "cardNumber", type: "text", label: "Card Number", required: true },
        { name: "expiryDate", type: "date", label: "Expiry Date", required: true },
        { name: "cvv", type: "password", label: "CVV", required: true },
        { name: "cardholderName", type: "text", label: "Cardholder Name", required: true },
      ],
    },
  };
  return apiResponses[selection] || { fields: [] };
};

const DynamicForm = () => {
  const [formType, setFormType] = useState("");
  const [formStructure, setFormStructure] = useState([]);
  const [formData, setFormData] = useState({});
  const [errors, setErrors] = useState({});
  const [submittedData, setSubmittedData] = useState([]);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (formType) {
      const { fields } = getFormStructure(formType);
      setFormStructure(fields);
      setFormData({});
      setErrors({});
    }
  }, [formType]);

  // Handle field input changes
  const handleInputChange = (name, value) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    const validationErrors = {};
    let isValid = true;

    formStructure.forEach((field) => {
      if (field.required && !formData[field.name]) {
        validationErrors[field.name] = `${field.label} is required`;
        isValid = false;
      }
    });

    setErrors(validationErrors);

    if (isValid) {
      setSubmittedData((prev) => [...prev, { ...formData }]);
      setFormData({});
      alert("Form submitted successfully!");
    }
  };

  // Delete entry
  const handleDelete = (index) => {
    setSubmittedData((prev) => prev.filter((_, i) => i !== index));
    alert("Entry deleted successfully.");
  };

  // Calculate progress
  useEffect(() => {
    if (formStructure.length > 0) {
      const filledFields = formStructure.filter(
        (field) => formData[field.name]
      ).length;
      setProgress((filledFields / formStructure.length) * 100);
    }
  }, [formData, formStructure]);

  return (
    <div style={{ maxWidth: "600px", margin: "0 auto" }}>
      <h1>Dynamic Form</h1>
      <div>
        <label>Select Form Type:</label>
        <select value={formType} onChange={(e) => setFormType(e.target.value)}>
          <option value="">-- Select --</option>
          <option value="User Information">User Information</option>
          <option value="Address Information">Address Information</option>
          <option value="Payment Information">Payment Information</option>
        </select>
      </div>

      {formStructure.length > 0 && (
        <form onSubmit={handleSubmit}>
          {formStructure.map((field) => (
            <div key={field.name}>
              <label>{field.label}</label>
              {field.type === "dropdown" ? (
                <select
                  value={formData[field.name] || ""}
                  onChange={(e) => handleInputChange(field.name, e.target.value)}
                >
                  <option value="">-- Select --</option>
                  {field.options.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              ) : (
                <input
                  type={field.type}
                  value={formData[field.name] || ""}
                  onChange={(e) => handleInputChange(field.name, e.target.value)}
                />
              )}
              {errors[field.name] && (
                <span style={{ color: "red" }}>{errors[field.name]}</span>
              )}
            </div>
          ))}
          <button type="submit">Submit</button>
          <div>
            <label>Progress: </label>
            <progress value={progress} max="100" />
          </div>
        </form>
      )}

      {submittedData.length > 0 && (
        <div>
          <h2>Submitted Data</h2>
          <table border="1">
            <thead>
              <tr>
                {Object.keys(submittedData[0]).map((key) => (
                  <th key={key}>{key}</th>
                ))}
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {submittedData.map((data, index) => (
                <tr key={index}>
                  {Object.values(data).map((value, idx) => (
                    <td key={idx}>{value}</td>
                  ))}
                  <td>
                    <button onClick={() => handleDelete(index)}>Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default DynamicForm;
