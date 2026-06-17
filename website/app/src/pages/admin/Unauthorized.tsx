import { Link } from 'react-router-dom';
import { ShieldX } from 'lucide-react';

export default function Unauthorized() {
  return (
    <div className="flex flex-col items-center justify-center py-24 text-center">
      <div className="w-16 h-16 rounded-full bg-red-500/15 flex items-center justify-center mb-6">
        <ShieldX size={32} className="text-red-400" />
      </div>
      <h1 className="text-2xl font-bold text-white mb-2">Access Denied</h1>
      <p className="text-white/40 text-sm mb-6 max-w-sm">
        You don't have permission to access this page. Contact your administrator if you believe this is an error.
      </p>
      <Link to="/admin/dashboard" className="px-4 py-2 bg-brand-blue text-white text-sm rounded-lg hover:bg-brand-blue/90 transition">
        Back to Dashboard
      </Link>
    </div>
  );
}
