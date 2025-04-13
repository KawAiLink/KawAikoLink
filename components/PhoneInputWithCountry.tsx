"use client";

import { useEffect, useState } from "react";
import PhoneInput, { isValidPhoneNumber } from "react-phone-number-input";
import { getCountryCallingCode, CountryCode } from "libphonenumber-js";
import "react-phone-number-input/style.css";

type PhoneInputWithCountryProps = {
  mobileNumber: string;
  setMobileNumber: React.Dispatch<React.SetStateAction<string>>;
};

export default function PhoneInputWithCountry({
  mobileNumber,
  setMobileNumber,
}: PhoneInputWithCountryProps) {

  const [country, setCountry] = useState<CountryCode>("US");
  const [overrideCountry, setOverrideCountry] = useState<boolean>(false);

  const handleCountryChange = (newCountry: string) => {
    if (!newCountry) return;

  
    if (newCountry === country && !overrideCountry) {
      console.log("Ignored redundant country:", newCountry);
      return;
    }

    console.log("New country selected:", newCountry);
    setOverrideCountry(true);
    setCountry(newCountry as CountryCode);

    console.log("Mobile number cleared");
    const callingCode = `+${getCountryCallingCode(newCountry as CountryCode)}`;
    console.log("Setting calling code:", callingCode);

    setTimeout(() => {
      setMobileNumber(callingCode);
    }, 100);
  };

  return (
    <>
      <PhoneInput
        key={country}
        placeholder="Enter phone number"
        value={mobileNumber}
        country={country}
        defaultCountry="US"
        onCountryChange={handleCountryChange}
        onChange={(value) => {
          console.log("✍️ Phone changed to:", value);
          setMobileNumber(value || "");
        }}
        className="flex-row"
      />
      {mobileNumber?.length > 3 && !isValidPhoneNumber(mobileNumber) && (
        <p style={{ color: "red" }}>Invalid phone number format.</p>
      )}
    </>
  );
};
