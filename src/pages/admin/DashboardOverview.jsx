import React, { useState, useEffect } from 'react';
import { 
  Users, 
  Calendar, 
  GraduationCap, 
  Image as ImageIcon,
  TrendingUp,
  ArrowUpRight
} from 'lucide-react';
import { fetchData } from '../../lib/supabase';

const StatCard = ({ label, value, icon: Icon, color }) => (
  <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
    <div className="flex items-center justify-between mb-4">
      <div className={`p-3 rounded-xl bg-opacity-10 ${color.bg} ${color.text}`}>
        <Icon className="w-6 h-6" />
      </div>
      <div className="flex items-center gap-1 text-green-600 text-sm font-medium">
        <ArrowUpRight className="w-4 h-4" />
        <span>Live</span>
      </div>
    </div>
    <h3 className="text-gray-500 text-sm font-medium">{label}</h3>
    <p className="text-2xl font-bold text-gray-800">{value}</p>
  </div>
);

const DashboardOverview = () => {
  const [stats, setStats] = useState({
    events: 0,
    team: 0,
    alumni: 0,
    gallery: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadStats = async () => {
      try {
        const [ev, tm, al, gl] = await Promise.all([
          fetchData('events'),
          fetchData('team_members'),
          fetchData('alumini'),
          fetchData('gallery')
        ]);
        setStats({
          events: ev.length,
          team: tm.length,
          alumni: al.length,
          gallery: gl.length
        });
      } catch (err) {
        console.error("Error loading stats:", err);
      } finally {
        setLoading(false);
      }
    };
    loadStats();
  }, []);

  const statConfig = [
    { label: 'Upcoming Events', value: stats.events, icon: Calendar, color: { bg: 'bg-blue-500', text: 'text-blue-500' } },
    { label: 'Team Members', value: stats.team, icon: Users, color: { bg: 'bg-indigo-500', text: 'text-indigo-500' } },
    { label: 'Alumni Network', value: stats.alumni, icon: GraduationCap, color: { bg: 'bg-emerald-500', text: 'text-emerald-500' } },
    { label: 'Gallery Collections', value: stats.gallery, icon: ImageIcon, color: { bg: 'bg-amber-500', text: 'text-amber-500' } },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-black text-gray-800">Dashboard Overview</h1>
        <p className="text-gray-500">Welcome back! Here's what's happening today.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statConfig.map((stat, idx) => (
          <StatCard key={idx} {...stat} />
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-6">
            <h2 className="font-bold text-gray-800">System Activity</h2>
            <button className="text-sm text-primary-600 font-medium font-medium">View detailed logs</button>
          </div>
          <div className="space-y-6">
            {[1, 2, 3].map((_, i) => (
              <div key={i} className="flex gap-4">
                <div className="w-1 bg-gray-100 rounded-full h-12 self-center"></div>
                <div>
                  <p className="text-sm font-bold text-gray-800">Updated Team Directory</p>
                  <p className="text-xs text-gray-500">2 hours ago • Admin</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-primary-600 p-6 rounded-2xl shadow-lg relative overflow-hidden">
          <div className="relative z-10 text-white space-y-4">
            <h2 className="text-xl font-bold">Manage Website</h2>
            <p className="opacity-90 max-w-xs text-sm">Update your public facing identity easily from here. Use the sidebar to navigate through modules.</p>
            <div className="pt-4">
              <button className="bg-white text-primary-600 px-6 py-2 rounded-lg text-sm font-bold hover:bg-gray-50 transition-colors">
                Quick Guide
              </button>
            </div>
          </div>
          <ImageIcon className="absolute -bottom-10 -right-10 w-48 h-48 text-white opacity-10 rotate-12" />
        </div>
      </div>
    </div>
  );
};

export default DashboardOverview;
