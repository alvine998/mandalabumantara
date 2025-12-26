import AdminLayout from "@/components/AdminLayout";

export default function Dashboard() {
    const stats = [
        {
            label: "Total Users",
            value: "1,234",
            change: "+12%",
            trend: "up",
            icon: (
                <svg className="w-6 h-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
            ),
            bg: "bg-indigo-50"
        },
        {
            label: "Revenue",
            value: "$45,200",
            change: "+8%",
            trend: "up",
            icon: (
                <svg className="w-6 h-6 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
            ),
            bg: "bg-emerald-50"
        },
        {
            label: "Active Sessions",
            value: "432",
            change: "-3%",
            trend: "down",
            icon: (
                <svg className="w-6 h-6 text-cyan-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
            ),
            bg: "bg-cyan-50"
        },
        {
            label: "Support Tickets",
            value: "12",
            change: "0%",
            trend: "neutral",
            icon: (
                <svg className="w-6 h-6 text-rose-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                </svg>
            ),
            bg: "bg-rose-50"
        },
    ];

    return (
        <AdminLayout>
            <div className="mb-8">
                <h1 className="text-2xl font-bold text-slate-900">Statistics Overview</h1>
                <p className="text-slate-500 mt-1">Welcome back, here's what's happening today.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                {stats.map((stat, index) => (
                    <div key={index} className="bg-white p-6 rounded-xl shadow-[0_2px_10px_-3px_rgba(6,81,237,0.1)] border border-slate-100 hover:shadow-lg transition-shadow duration-300 group">
                        <div className="flex items-start justify-between mb-4">
                            <div className={`p-3 rounded-lg ${stat.bg} group-hover:scale-110 transition-transform duration-300`}>
                                {stat.icon}
                            </div>
                            <span
                                className={`flex items-center text-xs font-semibold px-2.5 py-0.5 rounded-full ${stat.trend === "up"
                                    ? "bg-green-100 text-green-700"
                                    : stat.trend === "down"
                                        ? "bg-red-100 text-red-700"
                                        : "bg-slate-100 text-slate-700"
                                    }`}
                            >
                                {stat.trend === "up" && (
                                    <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                                    </svg>
                                )}
                                {stat.trend === "down" && (
                                    <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 17h8m0 0V9m0 8l-8-8-4 4-6-6" />
                                    </svg>
                                )}
                                {stat.change}
                            </span>
                        </div>
                        <h3 className="text-slate-500 text-sm font-medium">{stat.label}</h3>
                        <p className="text-2xl font-bold text-slate-900 mt-1">{stat.value}</p>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 bg-white p-6 rounded-xl shadow-sm border border-slate-200">
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="text-lg font-bold text-slate-900">Engagement Analytics</h3>
                        <select className="text-sm border-slate-200 rounded-lg text-slate-600 focus:ring-indigo-500 focus:border-indigo-500">
                            <option>Last 7 Days</option>
                            <option>Last 30 Days</option>
                            <option>This Year</option>
                        </select>
                    </div>

                    <div className="h-80 w-full flex items-end justify-between space-x-2 px-4 pb-4 border-b border-l border-slate-100">
                        {[40, 65, 45, 80, 55, 70, 40, 65, 45, 80, 55, 75].map((h, i) => (
                            <div key={i} className="group relative w-full flex flex-col items-center justify-end h-full">
                                <div
                                    className="w-full bg-indigo-500/10 rounded-t-sm group-hover:bg-indigo-500 transition-all duration-300"
                                    style={{ height: `${h}%` }}
                                ></div>
                                <div className="absolute -top-8 opacity-0 group-hover:opacity-100 transition-opacity bg-slate-900 text-white text-xs py-1 px-2 rounded mb-2 whitespace-nowrap z-10">
                                    {h}% Engagement
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className="flex justify-between mt-4 text-xs text-slate-400 px-4">
                        <span>Jan</span>
                        <span>Feb</span>
                        <span>Mar</span>
                        <span>Apr</span>
                        <span>May</span>
                        <span>Jun</span>
                        <span>Jul</span>
                        <span>Aug</span>
                        <span>Sep</span>
                        <span>Oct</span>
                        <span>Nov</span>
                        <span>Dec</span>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="text-lg font-bold text-slate-900">Recent Activity</h3>
                        <button className="text-sm text-indigo-600 hover:text-indigo-700 font-medium">View All</button>
                    </div>

                    <div className="space-y-6">
                        {[
                            { user: "Sarah Smith", action: "Created a new project", time: "2 min ago", type: "project" },
                            { user: "John Doe", action: "Commented on task #452", time: "15 min ago", type: "comment" },
                            { user: "Mike Johnson", action: "Uploaded file 'design.fig'", time: "1 hour ago", type: "upload" },
                            { user: "Emily Davis", action: "Completed milestone", time: "3 hours ago", type: "milestone" },
                            { user: "Alex Wilson", action: "Updated profile settings", time: "5 hours ago", type: "settings" }
                        ].map((activity, i) => (
                            <div key={i} className="flex items-start space-x-3 group">
                                <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 
                                    ${activity.type === 'project' ? 'bg-indigo-100 text-indigo-600' :
                                        activity.type === 'comment' ? 'bg-yellow-100 text-yellow-600' :
                                            activity.type === 'upload' ? 'bg-blue-100 text-blue-600' :
                                                activity.type === 'milestone' ? 'bg-green-100 text-green-600' : 'bg-slate-100 text-slate-600'
                                    }`}>
                                    {activity.type === 'project' && "📁"}
                                    {activity.type === 'comment' && "💬"}
                                    {activity.type === 'upload' && "📎"}
                                    {activity.type === 'milestone' && "🏁"}
                                    {activity.type === 'settings' && "⚙️"}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-medium text-slate-900 truncate">
                                        <span className="font-bold">{activity.user}</span>
                                    </p>
                                    <p className="text-sm text-slate-500 truncate">{activity.action}</p>
                                    <p className="text-xs text-slate-400 mt-0.5">{activity.time}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}
