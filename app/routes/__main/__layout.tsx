
import {Outlet} from "react-router";
import { Sidebar } from "~/components/layout/Sidebar";
import { TopBar } from "~/components/layout/TopBar";

export default function Layout() {

    return (
        <div className="flex overflow-hidden dark:bg-gray-800">
            <Sidebar />
            <TopBar />

            <div className="flex flex-1 flex-col overflow-hidden transition-all duration-300 pl-16 lg:pl-64 pb-4">
                <main className="min-h-screen flex-1 overflow-y-auto overflow-x-hidden">
                    <div className="h-16" />
                <div className="container mx-auto px-4 py-6 max-w-6xl">
                    <Outlet />
                </div>
                </main>
            </div>
        </div>
    );
}

