import { useFetchers, useNavigation } from "react-router"

export const GlobalLoader = () => {

    let navigation = useNavigation()
    let fetcher = useFetchers()

    let isLoading = navigation.state !== 'idle' || fetcher.some(f => f.state !== "idle" && f.formAction !== '/actions/set-theme'  && f.formAction !== '/actions/set-view-mode')

    if (isLoading) {
        return (
            <div className="fixed h-full w-full flex items-center justify-center  min-h-svh left-0 right-0 bottom-0 bg-foreground z-[110] opacity-80 top-0"  >
                <div className="w-16 h-16 rounded-full animate-spin border-8 border-secondary dark:border-orange-500 border-t-transparent" />
            </div>
        )
    }

    return null;
}