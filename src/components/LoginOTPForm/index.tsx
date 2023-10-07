import { useState } from "react";
import PhoneNumberForm from "./PhoneNumberForm";
import OTPForm from "./OTPForm";

const LoginOTPForm: React.FC<{ onMethodChange: () => void }> = (props) => {
    const [sentOTP, setSentOTP] = useState(false)
    const [phoneNumber, setPhoneNumber] = useState("")

    const handleFormToggle = (phoneNumber: string) => {
        setPhoneNumber(phoneNumber)
        setSentOTP((prev) => !prev)
    }
    return (<>
        {!sentOTP ? <PhoneNumberForm onMethodChange={props.onMethodChange} onFormChange={handleFormToggle} /> : <OTPForm phoneNumber={phoneNumber} />}
    </>);
}

export default LoginOTPForm