import React from "react";
import { Home, LibraryBig, ChartPie, LogOut, Settings, X, Crown } from "lucide-react";

const sidebarNav = [
    { name: "Home", link: "/dashboard/", icon: Home },
    { name: "Library", link: "/dashboard/library", icon: LibraryBig },
    { name: "Sessions", link: "/dashboard/sessions", icon: ChartPie },
    { name: "Pricing", link: "/pricing", icon: Crown },

];

const Sidebar = ({ open, setOpen }) => {
    return (
        <>
            {/* BACKDROP for mobile */}
            {open && (
                <div
                    onClick={() => setOpen(false)}
                    className="md:hidden fixed inset-0 bg-black/50 z-40"
                ></div>
            )}

            {/* Sidebar */}
            <div
                className={`h-screen w-56 bg-[#1a0024]/80 backdrop-blur-xl border-r border-white/10 
          flex flex-col justify-between p-4 text-white shadow-2xl z-50 fixed md:static 
          transition-transform duration-300
          ${open ? "translate-x-0" : "-translate-x-full md:translate-x-0"}
        `}
            >

                {/* Close button (only mobile) */}
                <button
                    onClick={() => setOpen(false)}
                    className="md:hidden self-end mb-3"
                >
                    <X size={28} />
                </button>

                {/* Logo */}
                <div>
                    <div className="mb-10">
                        <h1 className="text-3xl font-bold text-center tracking-wide bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent">
                            Quizzy
                        </h1>
                    </div>

                    {/* Navigation */}
                    <nav className="flex flex-col gap-3 items-center">
                        {sidebarNav.map((item) => {
                            const Icon = item.icon;
                            return (
                                <a
                                    key={item.name}
                                    href={item.link}
                                    className="flex items-center gap-3 px-4 py-3 rounded-xl 
                           hover:bg-white/10 transition-all group"
                                >
                                    <Icon className="text-purple-300 group-hover:scale-110 transition" />
                                    <span className="text-sm font-medium">{item.name}</span>
                                </a>
                            );
                        })}
                    </nav>
                </div>


                {/* Bottom Profile */}
                <div>
                    <ProgressBar current={2} total={10} />
                    <div className="border-t border-white/10 pt-4 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="rounded-full bg-gradient-to-br from-pink-600 to-purple-600 
                            w-11 h-11 flex items-center justify-center text-lg font-bold shadow-lg">
                                P
                            </div>
                            <div>
                                <p className="text-sm font-semibold">Prathmesh</p>
                                <p className="text-xs text-gray-300">View Profile</p>
                            </div>
                        </div>

                        <div className="flex flex-col items-center gap-3 text-gray-300">
                            <Settings className="hover:text-white cursor-pointer" size={20} />
                            <LogOut className="hover:text-white cursor-pointer" size={20} />
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Sidebar;

const ProgressBar = ({ current, total = 10 }) => {
    const percent = (current / total) * 100;

    return (
        <div className="w-full">
            {/* Text */}
            <div className="flex items-center gap-2 mb-1">
                <p className="text-sm font-medium">
                    {current} / {total} activities
                </p>
                <div className="w-4 h-4 flex items-center justify-center">
                    <span className="text-gray-400 text-xs">ⓘ</span>
                </div>
            </div>

            {/* Progress background */}
            <div className="w-full h-2 bg-gray-200 rounded-full relative">

                {/* Pink round dot (starting point) */}
                {/* <div className="w-3 h-3 bg-pink-500 rounded-full absolute -top-0.5 left-0"></div> */}

                {/* Filled progress */}
                <div
                    className="h-2 bg-pink-500 rounded-full transition-all duration-1000"
                    style={{ width: `${percent}%` }}
                ></div>
            </div>
        </div>
    );
};
