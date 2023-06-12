import { Label, TextInput, TextInputProps } from "flowbite-react";
import { forwardRef } from "react"

interface TextValidInputProps extends TextInputProps {
    labelText?: string,
    errorMessage?: string
}

const TextValidInput = forwardRef<HTMLInputElement, TextValidInputProps>(
    (
        {
            labelText,
            errorMessage,
            ...props
        },
        ref
    ) => {
        return (
            <div className="w-full flex flex-col gap-y-2">
                <Label>{labelText}</Label>
                <TextInput
                    theme={{ field: { input: { base: "w-full " } } }}
                    color={errorMessage ? "failure" : "gray"} 
                    helperText={errorMessage}
                    {...props}
                    ref = {ref}
                />
            </div>
        )
    }
);

export default TextValidInput
