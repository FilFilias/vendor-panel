import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "~/components/ui/card";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { ClipboardCheck, Clipboard, Edit, Save } from "lucide-react";
import { useLoaderData } from "react-router";
import { Button } from "../ui/button";

export const ApiKeyBlock = () => {

    let {apiKey} = useLoaderData();

    const [show, setShow] = useState(false);
    const [copyText, setCopyText] = useState("Copy");

    const onShowClick = (e: React.FormEvent) => {
        setShow(prevState => !prevState)
    }

    const onCopyClick = () => {
        const valueToCopy = show ? apiKey.token : apiKey.redacted;
        navigator.clipboard.writeText(valueToCopy)
            .then(() => {
                setCopyText("Copied"); // Change button text to "Copied"
                setTimeout(() => {
                    setCopyText("Copy"); // Revert back to "Copy" after 5 seconds
                }, 3000);
            })
            .catch((err) => {
                console.error("Failed to copy: ", err);
            });
    };

    return (
        <Card className="dark:bg-gray-800 dark:text-white">
            <CardHeader>
                <CardTitle>Api Key</CardTitle>
                <CardDescription></CardDescription>
            </CardHeader>
            <CardContent>
                <Label htmlFor="company-name">Api Key</Label>
                <div className="flex items-center">
                    {show ?
                        <Input key={apiKey.token} readOnly={true} name="companyName" id="company-name" defaultValue={apiKey.token}  />
                    :
                        <Input key={apiKey.redacted} readOnly={true} name="companyName" id="company-name" defaultValue={apiKey.redacted}  />
                    }
                    <Button variant='secondary' onClick={onCopyClick}>
                        {copyText == 'Copy' ? 
                            <Clipboard />
                        :       
                            <ClipboardCheck />
                        }
                    </Button>
                    <Button className='ml-4' onClick={onShowClick}>{show ? "Hide" : "Show"}</Button>
                </div>
                </CardContent>
        </Card>
    );
}