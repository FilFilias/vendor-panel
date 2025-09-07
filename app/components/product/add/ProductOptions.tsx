import { Switch } from "~/components/ui/switch";

type AddProductOptionsProps = {
    onOptionsSwitchClick:() => void;
    hasOptions:boolean;
    options: {Color:boolean,Size:boolean}
    setOptions: (k:any) => void;
}
export const AddProductOptions = ({onOptionsSwitchClick,hasOptions,options,setOptions}:AddProductOptionsProps) => {
    const onSwitchClick = () => {
        setOptions( (prevState) => ({
            ...prevState,
            Size: !prevState.Size
        }))
        onOptionsSwitchClick()
    }

    return (
        <div className="rounded-lg border py-4">
            <div className="p-6 space-y-8">
                <div className="space-y-4">
                    <div className="space-y-2">
                        <h2 className="dark:text-white text-lg font-semibold">Product Options</h2>
                        <p className="text-muted-foreground">Enable this if your product comes in multiple variations (e.g., sizes, colors)</p>
                    </div>
                    <div className="mb-2">
                        <Switch
                          checked={hasOptions}
                          onCheckedChange={onSwitchClick}
                        />
                    </div>
                </div>
            </div>
        </div>

    )
}