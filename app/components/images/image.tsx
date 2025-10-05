export const Image = ({src, alt, className}: {src: string, alt: string, className: string}) => {
    return (
        <img
            src={src || "https://s3.ventor.gr/ventor_placeholder.png"}
            alt={alt}
            className={className}
            onError={(e) => {
                e.currentTarget.src = "https://s3.ventor.gr/ventor_placeholder.png";
            }}
        />
    )
}