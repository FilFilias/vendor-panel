import { useRef, useState } from "react";
import { toast } from "sonner";
import { Button } from "~/components/ui/button";
import { Upload } from "lucide-react";

type ProductImageProps = {
    imageUrl?: string;
}

export const ProductImage = ({imageUrl}: ProductImageProps) => {

    const fileInputRef = useRef<HTMLInputElement>(null);
    const [newImg, setNewImg] = useState<string | null>(null)

    const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
          // Check file type
          if (!file.type.startsWith('image/')) {
            toast.error("Please select an image file");
            return;
          }
    
          // Check file size (5MB limit)
          if (file.size > 5 * 1024 * 1024) {
            toast.error("Image size must be less than 5MB");
            return;
          }
    
          // Create a temporary URL for the uploaded image
          const imageUrl = URL.createObjectURL(file);
          setNewImg(imageUrl)
        }
    };

    const handleUploadClick = () => {
        fileInputRef.current?.click();
    };

    return (
        <>
            <div className="relative inline-block">
                {(imageUrl || newImg) ?
                        <img
                            src={newImg ?? imageUrl}
                            alt="Product preview"
                            className="w-32 h-32 object-cover rounded-lg border border-border"
                            onError={(e) => {
                            e.currentTarget.src = "/ventor_placeholder.png";
                            }}
                        />
                    :
                        <img
                            src='/ventor_placeholder.png'
                            alt="Product preview"
                            className="w-32 h-32 object-cover rounded-lg border border-border"
                        />
                }
            </div>
            <div className="flex gap-2">
                <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={handleUploadClick}
                    className="flex items-center gap-2"
                >
                    <Upload className="h-4 w-4" />
                    Replace Image
                </Button>
                <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                />
            </div>
        </>
    )
}