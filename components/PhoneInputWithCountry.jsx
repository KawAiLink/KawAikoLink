// components/PhoneInputWithCountry.jsx
"use client";

import { useEffect, useState } from "react";
import PhoneInput, { isValidPhoneNumber } from "react-phone-number-input";
import { getCountryCallingCode } from "libphonenumber-js";
import "react-phone-number-input/style.css";


export default function PhoneInputWithCountry({ mobileNumber, setMobileNumber }) {
    const [country, setCountry] = useState("US");
    const [overrideCountry, setOverrideCountry] = useState(false);

    const handleCountryChange = (newCountry) => {
        if (!newCountry) return;

       
        if (newCountry === country && !overrideCountry) {
            console.log("Ignored redundant country:", newCountry);
            return;
        }

        console.log("New country selected:", newCountry);
        setOverrideCountry(true);
        setCountry(newCountry);
        console.log("Mobile number cleared");

        const callingCode = `+${getCountryCallingCode(newCountry)}`;
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
            />
            {mobileNumber?.length > 3 && !isValidPhoneNumber(mobileNumber) && (
                <p style={{ color: "red" }}>Invalid phone number format.</p>
            )}
        </>
    );
};
