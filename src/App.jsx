import React, { useState } from 'react';
import { 
  LayoutDashboard, HardHat, Users, FileText, TrendingUp, AlertTriangle, 
  CheckCircle2, Clock, ChevronRight, Menu, X, Camera, MapPin, IndianRupee, 
  Briefcase, ArrowRight, Download, Phone, MessageSquare, Plus, Image as ImageIcon, 
  Check, XCircle, Wallet, Calendar as CalendarIcon, Video, PieChart, Share2, 
  LogOut, Lock, Building2, Package, UploadCloud, Eye, Save
} from 'lucide-react';

// --- CONSTANTS ---

const CONSTRUCTION_TASKS = [
  "Brick Work", 
  "Plastering", 
  "POP / Wall Putty", 
  "Painting (Primer/Finish)",
  "Flooring (Tiles/Marble/Granite)", 
  "Bar Bending (Steel Work)", 
  "Shuttering / Formwork", 
  "Slab Casting", 
  "Concrete Curing", 
  "Material Shifting / Loading", 
  "Electrical - Chipping/Piping", 
  "Electrical - Wiring/Fitting", 
  "Plumbing - Piping", 
  "Plumbing - Sanitary Fixing", 
  "Carpentry (Doors/Windows)", 
  "False Ceiling", 
  "Waterproofing", 
  "Excavation / Digging", 
  "Site Cleaning / Debris Removal", 
  "Scaffolding",
  "Others"
];

// --- MOCK DATA ---

const WORKERS = [
  { id: 1, name: "Ramesh Kumar", role: "Mason", wage: 900, status: "P", task: "Plastering", workLog: "Completed 200 sqft wall" },
  { id: 2, name: "Suresh Yadav", role: "Mason", wage: 900, status: "P", task: "Flooring (Tiles/Marble/Granite)", workLog: "Leveling master bedroom" },
  { id: 3, name: "Mohd. Aslam", role: "Helper", wage: 500, status: "P", task: "Material Shifting / Loading", workLog: "Moved 50 cement bags" },
  { id: 4, name: "Pintu Singh", role: "Helper", wage: 500, status: "A", task: "-", workLog: "-" },
];

const INITIAL_PROJECTS = [
  {
    id: 1,
    name: "Green Valley Heights",
    location: "Sector 42, Gurgaon",
    progress: 68,
    status: "Active",
    budget: 45000000,
    spent: 28000000,
    deadline: "Dec 2025",
    issues: 2,
    supervisor: "Rahul Sharma",
    lastUpdate: "Today, 10:30 AM",
    clientName: "Mr. Verma"
  },
  {
    id: 2,
    name: "Koramangala Villa",
    location: "4th Block, Bangalore",
    progress: 32,
    status: "Active",
    budget: 12000000,
    spent: 4500000,
    deadline: "Aug 2025",
    issues: 0,
    supervisor: "Amit Singh",
    lastUpdate: "Yesterday, 5:00 PM",
    clientName: "Mrs. Reddy"
  }
];

const INITIAL_ACTIVITY = [
  { id: 1, type: 'report', text: 'Daily Report submitted for Green Valley', time: '10 mins ago', user: 'Rahul Sharma' },
  { id: 2, type: 'material', text: 'Cement (50 bags) delivery confirmed', time: '45 mins ago', user: 'Procurement' },
  { id: 3, type: 'alert', text: 'Plumbing delay reported at Villa', time: '2 hours ago', user: 'Amit Singh' },
];

const INITIAL_REQUESTS = [
  { 
    id: 101, 
    type: 'material', 
    item: 'UltraTech Cement', 
    quantity: '50 Bags', 
    project: 'Green Valley', 
    amount: 18500, 
    status: 'pending', 
    requester: 'Rahul S.',
    billUrl: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&q=80&w=300' // Mock Bill
  },
  { 
    id: 102, 
    type: 'cash', 
    item: 'Diesel for Generator', 
    quantity: '20 Liters', 
    project: 'Koramangala Villa', 
    amount: 2200, 
    status: 'pending', 
    requester: 'Amit S.',
    billUrl: null 
  },
];

const INITIAL_GALLERY = [
  { id: 1, url: 'https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&q=80&w=300', title: 'Site Condition', type: 'before', date: 'Yesterday', project: 'Green Valley' },
  { id: 2, url: 'https://images.unsplash.com/photo-1541888946425-d81bb19240f5?auto=format&fit=crop&q=80&w=300', title: 'Slab Casting', type: 'after', date: 'Today', project: 'Green Valley' }
];

const INITIAL_MEETINGS = [
  { id: 1, title: 'Site Visit - Green Valley', date: 'Today', time: '2:00 PM', type: 'visit' },
  { id: 2, title: 'Client Meeting - Mr. Verma', date: 'Tomorrow', time: '11:00 AM', type: 'meeting' },
];

// --- SHARED COMPONENTS ---

const NotificationBadge = ({ count }) => count > 0 ? (
  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-bold animate-pulse">
    {count}
  </span>
) : null;

const ProgressBar = ({ value, color = "bg-blue-600" }) => (
  <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
    <div className={`h-full ${color} rounded-full transition-all duration-500`} style={{ width: `${value}%` }} />
  </div>
);

const TabButton = ({ active, onClick, icon: Icon, label, badge }) => (
  <button 
    onClick={onClick}
    className={`flex-1 flex flex-col items-center justify-center py-3 text-[10px] font-medium transition-colors relative ${active ? 'text-blue-600 bg-blue-50' : 'text-slate-400 hover:bg-slate-50'}`}
  >
    <div className="relative">
      <Icon size={20} className="mb-1" />
      <NotificationBadge count={badge} />
    </div>
    {label}
  </button>
);

const StatCard = ({ title, value, subtext, icon: Icon, trend }) => (
  <div className="bg-white p-6 rounded-xl border border-slate-100 shadow-sm hover:shadow-md transition-all">
    <div className="flex justify-between items-start">
      <div>
        <p className="text-slate-500 text-sm font-medium mb-1">{title}</p>
        <h3 className="text-2xl font-bold text-slate-800">{value}</h3>
      </div>
      <div className={`p-2 rounded-lg ${trend === 'negative' ? 'bg-red-50 text-red-600' : 'bg-blue-50 text-blue-600'}`}>
        <Icon size={20} />
      </div>
    </div>
    {subtext && (
      <p className={`text-xs mt-3 font-medium ${trend === 'negative' ? 'text-red-500' : 'text-emerald-600'}`}>
        {subtext}
      </p>
    )}
  </div>
);

const Modal = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white rounded-xl shadow-2xl max-w-md w-full overflow-hidden flex flex-col max-h-[90vh] animate-fadeIn">
        <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50 shrink-0">
          <h3 className="font-bold text-slate-800">{title}</h3>
          <button onClick={onClose}><X size={20} className="text-slate-400 hover:text-slate-600"/></button>
        </div>
        <div className="p-4 overflow-y-auto">
          {children}
        </div>
      </div>
    </div>
  );
};

// --- MAIN APPLICATION ---

export default function ConstructionOS() {
  const [currentView, setCurrentView] = useState('dashboard');
  
  // --- STATE ---
  const [projects, setProjects] = useState(INITIAL_PROJECTS);
  const [activities, setActivities] = useState(INITIAL_ACTIVITY);
  const [requests, setRequests] = useState(INITIAL_REQUESTS);
  const [gallery, setGallery] = useState(INITIAL_GALLERY);
  const [meetings, setMeetings] = useState(INITIAL_MEETINGS);
  const [workers, setWorkers] = useState(WORKERS);
  const [toast, setToast] = useState(null);

  // UI State
  const [isProjectModalOpen, setIsProjectModalOpen] = useState(false);
  const [newProjectData, setNewProjectData] = useState({ name: '', location: '', budget: '' });
  const [selectedBill, setSelectedBill] = useState(null); // For view bill modal

  // --- HELPERS ---

  const showToast = (message) => {
    setToast(message);
    setTimeout(() => setToast(null), 3000);
  };

  const addActivity = (type, text, user) => {
    setActivities(prev => [{ id: Date.now(), type, text, time: 'Just now', user }, ...prev]);
  };

  const handleApproveRequest = (id) => {
    setRequests(prev => prev.map(req => req.id === id ? { ...req, status: 'approved' } : req));
    const req = requests.find(r => r.id === id);
    addActivity('payment', `Approved ₹${req.amount} for ${req.item}`, 'Owner');
    showToast(`Approved: ${req.item}`);
  };

  const handleRejectRequest = (id) => {
    setRequests(prev => prev.map(req => req.id === id ? { ...req, status: 'rejected' } : req));
    showToast('Request Rejected');
  };

  const handleAddProject = () => {
    if (!newProjectData.name) return;
    const newProject = {
      id: projects.length + 1,
      name: newProjectData.name,
      location: newProjectData.location || "New Location",
      progress: 0,
      status: "Active",
      budget: parseInt(newProjectData.budget) || 1000000,
      spent: 0,
      deadline: "TBD",
      issues: 0,
      supervisor: "Unassigned",
      lastUpdate: "Just now",
      clientName: "TBD"
    };
    setProjects(prev => [newProject, ...prev]);
    setIsProjectModalOpen(false);
    setNewProjectData({ name: '', location: '', budget: '' });
    addActivity('alert', `New Project Created: ${newProject.name}`, 'Admin');
    showToast('New Project Created Successfully');
  };

  // Helper to update worker tasks in state
  const handleTaskUpdate = (workerId, newTask) => {
    setWorkers(workers.map(w => w.id === workerId ? { ...w, task: newTask } : w));
  };

  // Helper to update worker logs
  const handleLogUpdate = (workerId, newLog) => {
    setWorkers(workers.map(w => w.id === workerId ? { ...w, workLog: newLog } : w));
  };

  // --- SUB-APPS ---

  // 1. OWNER DESKTOP DASHBOARD
  const OwnerDashboard = () => (
    <div className="space-y-6 pb-20 animate-fadeIn">
      
      {/* Modals */}
      <Modal isOpen={isProjectModalOpen} onClose={()=>setIsProjectModalOpen(false)} title="Start New Project">
        <div className="space-y-4">
          <div><label className="block text-sm font-medium text-slate-700 mb-1">Project Name</label><input type="text" className="w-full border border-slate-300 rounded-lg p-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none" value={newProjectData.name} onChange={(e) => setNewProjectData({...newProjectData, name: e.target.value})} /></div>
          <div><label className="block text-sm font-medium text-slate-700 mb-1">Location</label><input type="text" className="w-full border border-slate-300 rounded-lg p-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none" value={newProjectData.location} onChange={(e) => setNewProjectData({...newProjectData, location: e.target.value})} /></div>
          <div><label className="block text-sm font-medium text-slate-700 mb-1">Estimated Budget (₹)</label><input type="number" className="w-full border border-slate-300 rounded-lg p-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none" value={newProjectData.budget} onChange={(e) => setNewProjectData({...newProjectData, budget: e.target.value})} /></div>
          <button onClick={handleAddProject} className="w-full bg-blue-900 text-white py-2 rounded-lg font-medium hover:bg-blue-800 transition-colors">Create Project</button>
        </div>
      </Modal>

      <Modal isOpen={!!selectedBill} onClose={() => setSelectedBill(null)} title="Verify Bill">
        <div className="space-y-4">
          <img src={selectedBill?.url} alt="Bill" className="w-full rounded-lg border border-slate-200" />
          <div className="flex justify-between items-center text-sm text-slate-500"><span>Amount: ₹{selectedBill?.amount}</span><span>Date: Today</span></div>
          <div className="flex gap-3 pt-2">
             <button onClick={() => { handleRejectRequest(selectedBill.id); setSelectedBill(null); }} className="flex-1 py-2 border border-red-200 text-red-600 rounded-lg font-bold hover:bg-red-50">Reject</button>
             <button onClick={() => { handleApproveRequest(selectedBill.id); setSelectedBill(null); }} className="flex-1 py-2 bg-blue-600 text-white rounded-lg font-bold hover:bg-blue-700 shadow-lg">Approve & Pay</button>
          </div>
        </div>
      </Modal>

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div><h2 className="text-2xl font-bold text-slate-800">Command Center</h2><p className="text-slate-500">Overview of all active sites & pending actions.</p></div>
        <div className="flex gap-3">
          <button className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-lg text-slate-600 text-sm font-medium hover:bg-slate-50"><Download size={16} /> CA Report</button>
          <button onClick={() => setIsProjectModalOpen(true)} className="px-4 py-2 bg-blue-900 text-white rounded-lg text-sm font-medium hover:bg-blue-800 shadow-lg shadow-blue-900/20 flex items-center gap-2"><Plus size={16} /> New Project</button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Active Projects" value={projects.length} subtext="All on schedule" icon={Briefcase} />
        <StatCard title="Total Workforce" value={workers.length} subtext="Workers Today" icon={Users} />
        <StatCard title="Pending Approvals" value={requests.filter(r => r.status === 'pending').length} subtext="Requires attention" icon={AlertTriangle} trend="negative" />
        <StatCard title="This Month Billing" value="₹ 12.5L" subtext="+15% vs Last Month" icon={IndianRupee} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-xl border border-slate-100 shadow-sm overflow-hidden">
            <div className="p-5 border-b border-slate-100 flex justify-between items-center bg-blue-50/50">
              <h3 className="font-semibold text-slate-800 flex items-center gap-2"><CheckCircle2 size={18} className="text-blue-600"/> Approval Queue</h3>
              <span className="text-xs font-bold bg-blue-100 text-blue-700 px-2 py-1 rounded-full">{requests.filter(r => r.status === 'pending').length} Pending</span>
            </div>
            <div className="divide-y divide-slate-50 max-h-[300px] overflow-y-auto">
              {requests.filter(r => r.status === 'pending').map(req => (
                <div key={req.id} className="p-4 flex items-center justify-between hover:bg-slate-50 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="bg-blue-100 p-2 rounded-lg text-blue-600"><Briefcase size={20}/></div>
                    <div><h4 className="font-medium text-slate-800">{req.item}</h4><p className="text-xs text-slate-500">{req.quantity} • {req.project}</p></div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="font-bold text-slate-700">₹{req.amount.toLocaleString()}</span>
                    {req.billUrl && <button onClick={() => setSelectedBill({url: req.billUrl, amount: req.amount, id: req.id})} className="flex items-center gap-1 px-3 py-1.5 bg-purple-50 text-purple-700 rounded-lg text-xs font-bold hover:bg-purple-100 border border-purple-100"><Eye size={12} /> View Bill</button>}
                    <div className="flex gap-1">
                      <button onClick={() => handleRejectRequest(req.id)} className="p-2 hover:bg-red-100 text-red-500 rounded-lg"><X size={16}/></button>
                      <button onClick={() => handleApproveRequest(req.id)} className="p-2 bg-blue-50 hover:bg-blue-100 text-blue-600 rounded-lg"><Check size={16}/></button>
                    </div>
                  </div>
                </div>
              ))}
              {requests.filter(r => r.status === 'pending').length === 0 && <p className="p-5 text-slate-400 text-sm">No pending requests.</p>}
            </div>
          </div>
          <div className="bg-white rounded-xl border border-slate-100 shadow-sm overflow-hidden">
            <div className="p-5 border-b border-slate-100 flex justify-between items-center">
              <h3 className="font-semibold text-slate-800">Live Project Status</h3>
              <span className="text-xs text-blue-600 font-medium cursor-pointer">View All Details</span>
            </div>
            <div className="divide-y divide-slate-50">
              {projects.map(project => (
                <div key={project.id} className="p-5 hover:bg-slate-50 transition-colors cursor-pointer group">
                  <div className="flex justify-between items-start mb-2">
                    <div><h4 className="font-medium text-slate-800 group-hover:text-blue-900">{project.name}</h4><p className="text-xs text-slate-500 flex items-center gap-1 mt-1"><MapPin size={12} /> {project.location}</p></div>
                    <span className={`px-2 py-1 rounded text-xs font-medium ${project.issues > 0 ? 'bg-red-50 text-red-600' : 'bg-emerald-50 text-emerald-600'}`}>{project.issues > 0 ? `${project.issues} Issues` : 'On Track'}</span>
                  </div>
                  <div className="mt-3 flex items-center gap-4">
                    <div className="flex-1">
                      <div className="flex justify-between text-xs mb-1 text-slate-500"><span>Progress</span><span>{project.progress}%</span></div>
                      <ProgressBar value={project.progress} color={project.progress > 80 ? "bg-emerald-500" : "bg-blue-600"} />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-6">
           <div className="bg-white rounded-xl border border-slate-200 p-5">
              <div className="flex justify-between items-center mb-4">
                 <h3 className="font-semibold text-slate-800 flex items-center gap-2"><CalendarIcon size={16} /> Schedule</h3>
                 <span className="text-xs text-blue-600 cursor-pointer">+ Add</span>
              </div>
              <div className="space-y-3">
                 {meetings.map(meeting => (
                    <div key={meeting.id} className="flex gap-3 items-start p-3 bg-slate-50 rounded-lg border border-slate-100">
                       <div className="bg-white p-2 rounded border border-slate-200 text-center min-w-[50px]"><p className="text-[10px] text-slate-500 uppercase font-bold">{meeting.date.split(' ')[0]}</p><p className="text-sm font-bold text-slate-800">{meeting.time.split(':')[0]}</p></div>
                       <div><p className="text-sm font-medium text-slate-800">{meeting.title}</p><p className="text-xs text-slate-500">{meeting.type} • {meeting.time}</p></div>
                    </div>
                 ))}
              </div>
           </div>
           <div className="bg-slate-50 rounded-xl border border-slate-200 p-5 h-full overflow-y-auto max-h-[500px]">
             <h3 className="font-semibold text-slate-800 mb-4 flex items-center gap-2"><Clock size={16} /> Live Site Feed</h3>
             <div className="space-y-6">
               {activities.map((activity) => (
                 <div key={activity.id} className="relative pl-6 border-l-2 border-slate-200 last:border-0">
                   <div className={`absolute -left-[9px] top-0 w-4 h-4 rounded-full border-2 border-white ${activity.type === 'alert' ? 'bg-red-500' : 'bg-blue-500'}`} />
                   <div><p className="text-sm font-medium text-slate-800">{activity.text}</p><div className="flex justify-between mt-1"><span className="text-xs text-slate-500">{activity.user}</span><span className="text-xs text-slate-400">{activity.time}</span></div></div>
                 </div>
               ))}
             </div>
           </div>
        </div>
      </div>
    </div>
  );

  // 2. OWNER MOBILE APP
  const OwnerMobileApp = () => {
    const [tab, setTab] = useState('home');
    const [selectedProjectForMedia, setSelectedProjectForMedia] = useState(null);

    return (
      <div className="max-w-md mx-auto bg-slate-50 h-[650px] rounded-xl shadow-2xl overflow-hidden border border-slate-200 flex flex-col relative">
         <Modal isOpen={!!selectedBill} onClose={() => setSelectedBill(null)} title="Verify Bill">
            <div className="space-y-4">
               <img src={selectedBill?.url} alt="Bill" className="w-full rounded-lg border border-slate-200" />
               <div className="flex justify-between items-center text-sm text-slate-500"><span>Amount: ₹{selectedBill?.amount}</span><span>Date: Today</span></div>
               <button onClick={() => { handleApproveRequest(selectedBill.id); setSelectedBill(null); }} className="w-full py-3 bg-blue-600 text-white rounded-lg font-bold shadow-lg">Approve Request</button>
            </div>
         </Modal>

         <div className="bg-slate-900 text-white p-5 pb-8 rounded-b-3xl shadow-lg z-10 shrink-0">
            <div className="flex justify-between items-center mb-4">
              <div><h2 className="text-lg font-bold">Good Morning</h2><p className="text-blue-200 text-xs">Owner Dashboard</p></div>
              <button onClick={() => setIsProjectModalOpen(true)} className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center border border-slate-600 shadow-lg"><Plus size={18} /></button>
            </div>
            <div className="flex gap-4">
               <div className="bg-white/10 p-3 rounded-xl backdrop-blur-md flex-1"><p className="text-blue-200 text-[10px] uppercase">Approvals</p><p className="text-xl font-bold">{requests.filter(r => r.status === 'pending').length}</p></div>
               <div className="bg-white/10 p-3 rounded-xl backdrop-blur-md flex-1"><p className="text-blue-200 text-[10px] uppercase">Today's Spend</p><p className="text-xl font-bold">₹ 12.5k</p></div>
            </div>
         </div>

         <div className="flex-1 overflow-y-auto pt-4 px-4 pb-20 -mt-4 z-0">
            {tab === 'home' && (
              <>
                <h3 className="font-bold text-slate-800 mb-3">Pending Approvals</h3>
                <div className="space-y-3 mb-6">
                  {requests.filter(r => r.status === 'pending').map(req => (
                    <div key={req.id} className="bg-white p-4 rounded-xl shadow-sm border border-slate-100">
                      <div className="flex justify-between mb-2"><span className="text-xs font-bold bg-blue-50 text-blue-600 px-2 py-1 rounded uppercase tracking-wide">{req.type}</span><span className="text-sm font-bold">₹{req.amount.toLocaleString()}</span></div>
                      <h4 className="font-medium text-slate-800">{req.item}</h4><p className="text-xs text-slate-500 mb-3">{req.quantity} • {req.project}</p>
                      <div className="flex gap-2">
                         {req.billUrl && <button onClick={() => setSelectedBill({url: req.billUrl, amount: req.amount, id: req.id})} className="flex-1 py-2 border border-purple-200 text-purple-700 rounded-lg text-xs font-bold flex items-center justify-center gap-1"><Eye size={12}/> Bill</button>}
                         <button onClick={() => handleApproveRequest(req.id)} className="flex-1 py-2 bg-blue-600 text-white rounded-lg text-xs font-bold shadow-sm">Approve</button>
                      </div>
                    </div>
                  ))}
                  {requests.filter(r => r.status === 'pending').length === 0 && <div className="text-center p-6 bg-white rounded-xl border border-slate-200 text-slate-400 text-sm">All caught up!</div>}
                </div>
              </>
            )}
            {tab === 'projects' && (
               <div className="space-y-4 pt-2">
                  {!selectedProjectForMedia ? (
                     <>
                        <h3 className="font-bold text-slate-800 mb-2">Your Sites</h3>
                        {projects.map(p => (
                           <div key={p.id} className="bg-white p-4 rounded-xl border border-slate-200">
                              <div className="flex justify-between items-start mb-2"><h3 className="font-bold text-slate-800">{p.name}</h3><span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full">{p.status}</span></div>
                              <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden mb-2"><div className="bg-blue-600 h-full" style={{width: `${p.progress}%`}}></div></div>
                              <div className="flex justify-between text-xs text-slate-500 mb-3"><span>{p.progress}% Complete</span><span>{p.location}</span></div>
                              <button onClick={() => setSelectedProjectForMedia(p.name)} className="w-full py-2 bg-slate-50 text-slate-600 text-xs font-bold rounded-lg border border-slate-200 flex items-center justify-center gap-2 hover:bg-slate-100"><ImageIcon size={14} /> Gallery</button>
                           </div>
                        ))}
                     </>
                  ) : (
                     <div className="animate-fadeIn">
                        <button onClick={() => setSelectedProjectForMedia(null)} className="text-xs text-slate-500 mb-4 flex items-center gap-1"><ChevronRight className="rotate-180" size={12}/> Back</button>
                        <h3 className="font-bold text-lg mb-4 text-slate-800">{selectedProjectForMedia} Gallery</h3>
                        <div className="grid grid-cols-2 gap-3">
                           {gallery.map(media => (
                              <div key={media.id} className="relative aspect-square rounded-lg overflow-hidden bg-slate-200 shadow-sm border border-slate-100">
                                 <img src={media.url} alt={media.title} className="w-full h-full object-cover" />
                                 <div className="absolute top-2 left-2 bg-black/60 text-white text-[10px] px-2 py-0.5 rounded-full uppercase">{media.type}</div>
                              </div>
                           ))}
                        </div>
                     </div>
                  )}
               </div>
            )}
            {tab === 'finance' && (
               <div className="pt-2">
                  <h3 className="font-bold text-slate-800 mb-4">Financial Overview</h3>
                  <div className="grid grid-cols-2 gap-3 mb-6">
                     <div className="bg-blue-900 text-white p-4 rounded-xl shadow-lg shadow-blue-900/20"><p className="text-blue-200 text-xs mb-1">Total Spent</p><p className="text-xl font-bold">₹ 3.2 Cr</p></div>
                     <div className="bg-white p-4 rounded-xl border border-slate-200"><p className="text-slate-400 text-xs mb-1">Pending Invoices</p><p className="text-xl font-bold text-slate-800">₹ 4.5 L</p></div>
                  </div>
               </div>
            )}
            {tab === 'calendar' && (
               <div className="pt-2">
                  <h3 className="font-bold text-slate-800 mb-4">Upcoming Schedule</h3>
                  <div className="space-y-3">
                     {meetings.map(meeting => (
                        <div key={meeting.id} className="flex gap-4 items-center bg-white p-4 rounded-xl border border-slate-100 shadow-sm">
                           <div className="text-center min-w-[40px]"><p className="text-xs text-blue-600 font-bold">{meeting.time}</p></div>
                           <div className="h-8 w-1 bg-slate-100 rounded-full"></div>
                           <div><p className="text-sm font-bold text-slate-800">{meeting.title}</p><p className="text-xs text-slate-500">{meeting.type} • {meeting.date}</p></div>
                        </div>
                     ))}
                  </div>
               </div>
            )}
         </div>
         <div className="absolute bottom-0 left-0 w-full bg-white border-t border-slate-200 flex py-1 z-20">
            <TabButton active={tab==='home'} onClick={()=>setTab('home')} icon={LayoutDashboard} label="Home" badge={requests.filter(r => r.status === 'pending').length} />
            <TabButton active={tab==='projects'} onClick={()=>setTab('projects')} icon={Briefcase} label="Sites" />
            <TabButton active={tab==='calendar'} onClick={()=>setTab('calendar')} icon={CalendarIcon} label="Calendar" />
            <TabButton active={tab==='finance'} onClick={()=>setTab('finance')} icon={PieChart} label="Finance" />
         </div>
      </div>
    );
  };

  // 3. SUPERVISOR APP
  const SupervisorApp = () => {
    const [tab, setTab] = useState('report');
    
    // Feature States
    const [newRequest, setNewRequest] = useState({ item: '', qty: '', amount: '', bill: null });
    const [media, setMedia] = useState({ before: null, after: null });

    const handleFileUpload = (e, type) => {
       if (type === 'bill') setNewRequest({ ...newRequest, bill: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&q=80&w=300' });
       if (type === 'before') setMedia({ ...media, before: 'https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&q=80&w=300' });
       if (type === 'after') setMedia({ ...media, after: 'https://images.unsplash.com/photo-1541888946425-d81bb19240f5?auto=format&fit=crop&q=80&w=300' });
       showToast("File Uploaded (Simulated)");
    };

    const submitProcurement = () => {
       setRequests(prev => [{
          id: Date.now(),
          type: 'material',
          item: newRequest.item || 'New Item',
          quantity: newRequest.qty || '1 Unit',
          amount: newRequest.amount || 500,
          project: 'Green Valley',
          status: 'pending',
          billUrl: newRequest.bill
       }, ...prev]);
       setNewRequest({ item: '', qty: '', amount: '', bill: null });
       showToast("Request Sent to Owner");
    };

    return (
      <div className="max-w-md mx-auto bg-white h-[650px] rounded-xl shadow-2xl overflow-hidden border border-slate-200 flex flex-col relative">
         <div className="bg-slate-900 text-white p-4 flex justify-between items-center shrink-0">
            <div><h2 className="font-bold text-lg">Site Ops</h2><p className="text-xs text-slate-400">Green Valley Heights</p></div>
            <div className="h-8 w-8 rounded-full bg-slate-700 flex items-center justify-center border border-slate-600"><HardHat size={16}/></div>
         </div>
         <div className="flex-1 overflow-y-auto p-4 pb-20 bg-slate-50">
            {/* TAB: DAILY REPORT (MEDIA) */}
            {tab === 'report' && (
               <div className="space-y-5">
                  <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
                     <h3 className="text-sm font-bold text-slate-800 mb-3">Daily Progress Media</h3>
                     <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                           <p className="text-xs font-semibold text-slate-500 uppercase">Before Work</p>
                           <div onClick={(e) => handleFileUpload(e, 'before')} className="aspect-square bg-slate-50 border-2 border-dashed border-slate-300 rounded-xl flex flex-col items-center justify-center cursor-pointer hover:bg-blue-50 hover:border-blue-300 transition-colors relative overflow-hidden">
                              {media.before ? <img src={media.before} className="w-full h-full object-cover" /> : <><Camera size={24} className="text-slate-400 mb-1" /><span className="text-[10px] font-bold text-slate-500">Tap to Upload</span></>}
                           </div>
                        </div>
                        <div className="space-y-2">
                           <p className="text-xs font-semibold text-slate-500 uppercase">After Work</p>
                           <div onClick={(e) => handleFileUpload(e, 'after')} className="aspect-square bg-slate-50 border-2 border-dashed border-slate-300 rounded-xl flex flex-col items-center justify-center cursor-pointer hover:bg-blue-50 hover:border-blue-300 transition-colors relative overflow-hidden">
                              {media.after ? <img src={media.after} className="w-full h-full object-cover" /> : <><CheckCircle2 size={24} className="text-emerald-400 mb-1" /><span className="text-[10px] font-bold text-slate-500">Tap to Upload</span></>}
                           </div>
                        </div>
                     </div>
                  </div>
               </div>
            )}
            {/* TAB: WORKFORCE (ASSIGN TASKS) */}
            {tab === 'workers' && (
               <div className="space-y-4">
                  <h3 className="font-bold text-slate-800">Assign Tasks</h3>
                  {workers.map(worker => {
                     const isCustomTask = !CONSTRUCTION_TASKS.includes(worker.task) && worker.task !== "-";
                     const selectValue = isCustomTask ? "Others" : (CONSTRUCTION_TASKS.includes(worker.task) ? worker.task : "");

                     return (
                     <div key={worker.id} className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
                        <div className="flex justify-between items-start mb-2"><div><p className="font-bold text-slate-800">{worker.name}</p><p className="text-xs text-slate-500">{worker.role}</p></div><span className="bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded text-[10px] font-bold">Present</span></div>
                        <div className="space-y-2 mt-3">
                           <div>
                              <label className="text-[10px] font-bold text-slate-400 uppercase">Task Assigned</label>
                              <select 
                                 className="w-full text-xs p-2 border border-slate-200 rounded bg-slate-50 outline-none focus:border-blue-500 mb-2"
                                 value={selectValue}
                                 onChange={(e) => {
                                    const val = e.target.value;
                                    if (val === "Others") {
                                       handleTaskUpdate(worker.id, ""); // Clear task so input shows up empty or ready for type
                                    } else {
                                       handleTaskUpdate(worker.id, val);
                                    }
                                 }}
                              >
                                 <option value="" disabled>Select Task</option>
                                 {CONSTRUCTION_TASKS.map(task => (
                                    <option key={task} value={task}>{task}</option>
                                 ))}
                              </select>
                              
                              {(selectValue === "Others" || isCustomTask) && (
                                 <input 
                                    type="text" 
                                    value={isCustomTask ? worker.task : ""} 
                                    onChange={(e) => handleTaskUpdate(worker.id, e.target.value)}
                                    className="w-full text-xs p-2 border border-blue-200 rounded bg-blue-50 outline-none animate-fadeIn" 
                                    placeholder="Type custom task..." 
                                    autoFocus
                                 />
                              )}
                           </div>
                           <div>
                              <label className="text-[10px] font-bold text-slate-400 uppercase">Work Done (Log)</label>
                              <textarea 
                                 defaultValue={worker.workLog} 
                                 onChange={(e) => handleLogUpdate(worker.id, e.target.value)}
                                 rows={2} 
                                 className="w-full text-xs p-2 border border-slate-200 rounded bg-slate-50 outline-none focus:border-blue-500" 
                                 placeholder="Describe work done..."
                              ></textarea>
                           </div>
                        </div>
                     </div>
                     );
                  })}
                  <button onClick={() => showToast("Work Logs Saved")} className="w-full py-3 bg-blue-600 text-white rounded-xl font-bold shadow-lg flex items-center justify-center gap-2 active:scale-95 transition-transform"><Save size={16}/> Save Work Logs</button>
               </div>
            )}
            {/* TAB: PROCUREMENT (UPLOAD BILLS) */}
            {tab === 'requests' && (
               <div className="space-y-4">
                  <h3 className="font-bold text-slate-800">Raise Request & Upload Bill</h3>
                  <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm space-y-3">
                     <input type="text" placeholder="Item Name (e.g. Cement)" className="w-full p-2 border border-slate-200 rounded-lg text-sm outline-none focus:border-blue-500" value={newRequest.item} onChange={e => setNewRequest({...newRequest, item: e.target.value})} />
                     <div className="flex gap-2"><input type="text" placeholder="Qty" className="w-1/2 p-2 border border-slate-200 rounded-lg text-sm outline-none focus:border-blue-500" value={newRequest.qty} onChange={e => setNewRequest({...newRequest, qty: e.target.value})} /><input type="number" placeholder="Amount (₹)" className="w-1/2 p-2 border border-slate-200 rounded-lg text-sm outline-none focus:border-blue-500" value={newRequest.amount} onChange={e => setNewRequest({...newRequest, amount: e.target.value})} /></div>
                     <div onClick={(e) => handleFileUpload(e, 'bill')} className={`border-2 border-dashed rounded-lg p-4 flex flex-col items-center justify-center cursor-pointer transition-colors ${newRequest.bill ? 'border-emerald-400 bg-emerald-50' : 'border-slate-300 hover:bg-slate-50'}`}>
                        {newRequest.bill ? <><CheckCircle2 size={20} className="text-emerald-500 mb-1" /><span className="text-xs font-bold text-emerald-600">Bill Uploaded</span></> : <><UploadCloud size={20} className="text-slate-400 mb-1" /><span className="text-xs text-slate-500">Tap to Upload Bill/Invoice</span></>}
                     </div>
                     <button onClick={submitProcurement} className="w-full py-3 bg-blue-600 text-white rounded-lg font-bold shadow-md">Submit for Approval</button>
                  </div>
               </div>
            )}
         </div>
         <div className="absolute bottom-0 left-0 w-full bg-white border-t border-slate-200 flex py-1 z-20">
            <TabButton active={tab==='report'} onClick={()=>setTab('report')} icon={Camera} label="Media" />
            <TabButton active={tab==='workers'} onClick={()=>setTab('workers')} icon={Users} label="Workforce" />
            <TabButton active={tab==='requests'} onClick={()=>setTab('requests')} icon={Wallet} label="Bills" />
         </div>
      </div>
    );
  };

  // 4. CLIENT APP
  const ClientApp = () => {
     const [tab, setTab] = useState('feed');
     return (
      <div className="max-w-md mx-auto bg-white h-[650px] rounded-xl shadow-2xl overflow-hidden border border-slate-200 flex flex-col relative">
        <div className="bg-gradient-to-r from-blue-600 to-blue-800 p-6 text-white shrink-0">
          <div className="flex justify-between items-start mb-4"><div><h1 className="text-xl font-bold">Dream Home</h1><p className="text-blue-100 text-sm opacity-90">Sector 42, Gurgaon</p></div><div className="bg-white/20 p-2 rounded-lg backdrop-blur-sm"><IndianRupee size={20} /></div></div>
          <div className="mt-2"><div className="flex justify-between text-xs mb-1 opacity-90"><span>Overall Completion</span><span>{projects[0].progress}%</span></div><div className="h-2 bg-black/20 rounded-full overflow-hidden"><div className="h-full bg-white rounded-full transition-all duration-1000" style={{width: `${projects[0].progress}%`}}></div></div></div>
        </div>
        <div className="flex-1 overflow-y-auto bg-slate-50 pb-20">
           {tab === 'feed' && (
              <div className="p-4 space-y-6">
                 <div className="grid grid-cols-2 gap-4 mb-4"><div className="bg-white p-3 rounded-lg border border-slate-200 text-center"><p className="text-xs text-slate-500 uppercase">Next Milestone</p><p className="text-sm font-bold text-slate-800">Roofing Lvl 2</p><p className="text-xs text-blue-600">Due Dec 15</p></div><div className="bg-white p-3 rounded-lg border border-slate-200 text-center"><p className="text-xs text-slate-500 uppercase">Pending Due</p><p className="text-sm font-bold text-slate-800">₹ 2.5 Lakh</p><button onClick={()=>setTab('bills')} className="text-[10px] text-blue-600 underline">Pay Now</button></div></div>
                 <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider">Site Timeline</h3>
                 {gallery.map((item, idx) => (
                    <div key={idx} className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden"><div className="h-48 overflow-hidden relative"><img src={item.url} alt="construction" className="w-full h-full object-cover" /><div className="absolute top-3 left-3 bg-white/90 backdrop-blur px-3 py-1 rounded-full text-xs font-bold text-slate-800 shadow-sm">{item.date}</div></div><div className="p-4"><h4 className="font-bold text-slate-800">{item.title}</h4><p className="text-sm text-slate-500 mt-1">Work progress update from {item.project}</p></div></div>
                 ))}
              </div>
           )}
           {tab === 'bills' && (
              <div className="p-4 space-y-4">
                 <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider">Payments & Invoices</h3>
                 <div className="bg-white p-4 rounded-xl border border-l-4 border-l-emerald-500 shadow-sm"><div className="flex justify-between mb-2"><span className="font-bold text-slate-800">Booking Amount</span><span className="text-emerald-600 font-bold bg-emerald-50 px-2 py-0.5 rounded text-xs">PAID</span></div><p className="text-xs text-slate-500">Paid on Aug 12, 2024</p><p className="font-bold mt-2">₹ 5,00,000</p></div>
                 <div className="bg-white p-4 rounded-xl border border-l-4 border-l-orange-500 shadow-sm"><div className="flex justify-between mb-2"><span className="font-bold text-slate-800">Plinth Level Completion</span><span className="text-orange-600 font-bold bg-orange-50 px-2 py-0.5 rounded text-xs">PENDING</span></div><p className="text-xs text-slate-500">Due by Dec 15, 2025</p><p className="font-bold mt-2">₹ 8,50,000</p><button className="w-full mt-3 py-2 border border-blue-200 text-blue-600 rounded-lg text-sm font-medium">Download Invoice</button></div>
              </div>
           )}
        </div>
        <div className="absolute bottom-0 left-0 w-full bg-white border-t border-slate-200 flex py-1 z-20">
            <TabButton active={tab==='feed'} onClick={()=>setTab('feed')} icon={ImageIcon} label="Photos" />
            <TabButton active={tab==='bills'} onClick={()=>setTab('bills')} icon={FileText} label="Bills" />
            <TabButton active={tab==='chat'} onClick={()=>setTab('chat')} icon={MessageSquare} label="Chat" />
        </div>
      </div>
     );
  };

  // --- LAYOUT WRAPPER ---
  const NavButton = ({ id, label, icon: Icon }) => (
    <button onClick={() => setCurrentView(id)} className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors mb-1 ${currentView === id ? 'bg-blue-600 text-white shadow-md' : 'text-slate-400 hover:text-white hover:bg-slate-800'}`}>
      <Icon size={20} /><span>{label}</span>
    </button>
  );

  return (
    <div className="flex h-screen bg-slate-100 font-sans text-slate-900 overflow-hidden">
      {/* Toast Notification */}
      {toast && <div className="fixed top-6 right-6 z-50 bg-slate-900 text-white px-6 py-3 rounded-lg shadow-xl animate-bounce flex items-center gap-2"><CheckCircle2 size={18} className="text-emerald-400" /> {toast}</div>}

      {/* Sidebar */}
      <aside className="hidden md:flex w-64 bg-slate-900 text-white flex-col shrink-0">
        <div className="p-6 border-b border-slate-800"><div className="flex items-center gap-3"><div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center font-bold text-xl shadow-lg shadow-blue-900/50">C</div><div><h1 className="font-bold text-lg leading-tight">ConstructOS</h1><p className="text-xs text-slate-400">Firm Admin</p></div></div></div>
        <nav className="flex-1 p-4 overflow-y-auto">
          <p className="px-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-3 mt-2">Command Center</p>
          <NavButton id="dashboard" label="Owner Desktop" icon={LayoutDashboard} />
          <p className="px-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-3 mt-8">Mobile Apps (Simulation)</p>
          <NavButton id="ownerMobile" label="Owner Mobile App" icon={Briefcase} />
          <NavButton id="supervisor" label="Supervisor App" icon={HardHat} />
          <NavButton id="client" label="Client App" icon={Phone} />
        </nav>
        <div className="p-4 border-t border-slate-800 text-xs text-center text-slate-500">v5.0 • Connected</div>
      </aside>

      {/* Main Area */}
      <main className="flex-1 flex flex-col h-full overflow-hidden relative">
        <header className="md:hidden bg-slate-900 text-white p-4 flex justify-between items-center shrink-0"><div className="font-bold">ConstructOS</div><Menu /></header>
        <div className="flex-1 overflow-auto p-4 md:p-8 relative">
           <div className="mb-6 flex justify-center md:justify-end"><span className="bg-white border border-slate-200 text-slate-500 text-xs font-medium px-3 py-1 rounded-full shadow-sm">Current View: <span className="text-slate-900 font-bold">{currentView === 'dashboard' ? 'Owner Desktop Dashboard' : currentView === 'ownerMobile' ? 'Owner Mobile App' : currentView === 'supervisor' ? 'Supervisor Field App' : 'Client Mobile Portal'}</span></span></div>
           <div className="max-w-7xl mx-auto h-full">
              {currentView === 'dashboard' && <OwnerDashboard />}
              {currentView === 'ownerMobile' && <OwnerMobileApp />}
              {currentView === 'supervisor' && <SupervisorApp />}
              {currentView === 'client' && <ClientApp />}
           </div>
        </div>
      </main>
    </div>
  );
}