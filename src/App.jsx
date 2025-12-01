import React, { useState } from 'react';
import { 
  LayoutDashboard, HardHat, Users, FileText, TrendingUp, AlertTriangle, 
  CheckCircle2, Clock, ChevronRight, Menu, X, Camera, MapPin, IndianRupee, 
  Briefcase, ArrowRight, Download, Phone, MessageSquare, Plus, Image as ImageIcon, 
  Check, XCircle, Wallet, Calendar as CalendarIcon, Video, PieChart, Share2, 
  LogOut, Lock, Building2, Package, UploadCloud, Eye, Save, ClipboardList,
  UserPlus, ShieldAlert, Banknote, Store, ArrowLeft, Ruler
} from 'lucide-react';

// --- CONSTANTS & RULES ---

const CONSTRUCTION_TASKS = [
  "Brick Work", "Plastering", "POP / Wall Putty", "Painting", "Flooring", 
  "Bar Bending", "Shuttering", "Slab Casting", "Electrical - Wiring", 
  "Plumbing", "Carpentry", "Waterproofing", "Others"
];

const ROLES = ["Mason", "Helper", "Electrician", "Plumber", "Carpenter", "Supervisor"];

const CONSUMPTION_RULES = {
  "Brick Work": { material: "Cement", unit: "Bags", rate: 0.2 },
  "Plastering": { material: "Cement", unit: "Bags", rate: 0.1 }, 
  "Flooring":   { material: "Cement", unit: "Bags", rate: 0.15 },
  "Slab Casting": { material: "Cement", unit: "Bags", rate: 0.3 }
};

// --- MOCK DATA ---

const WORKERS = [
  { id: 1, name: "Ramesh Kumar", role: "Mason", wage: 900, status: "P", task: "Plastering", workLog: "Completed 200 sqft wall", projectId: 1, photos: { before: null, after: null } },
  { id: 2, name: "Suresh Yadav", role: "Mason", wage: 900, status: "P", task: "Flooring", workLog: "Leveling master bedroom", projectId: 1, photos: { before: null, after: null } },
  { id: 3, name: "Mohd. Aslam", role: "Helper", wage: 500, status: "P", task: "Material Shifting", workLog: "Moved 50 cement bags", projectId: 1, photos: { before: null, after: null } },
];

const VENDORS = [
  { id: 1, name: "Raja Bricks Co.", billed: 500000, paid: 350000, status: "Pending" },
  { id: 2, name: "UltraTech Supplier", billed: 1200000, paid: 1200000, status: "Clear" },
  { id: 3, name: "Local Sand Works", billed: 80000, paid: 40000, status: "Pending" },
];

// Core Estimation Data (BOQ)
const INITIAL_ESTIMATIONS = {
  1: { // Project ID 1
    materials: {
      "Cement": { estimated: 5000, used: 4200, unit: "Bags" },
      "Sand": { estimated: 8000, used: 6000, unit: "Cubic Ft" },
      "Steel": { estimated: 12000, used: 11500, unit: "Kg" },
      "Bricks": { estimated: 50000, used: 48000, unit: "Pcs" }
    },
    labor: { estimated: 2500, used: 2100, unit: "Man Days" }, // Total man days budget
    timeline: { estimated: 365, used: 280, unit: "Days" }
  }
};

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
  { id: 101, type: 'material', item: 'UltraTech Cement', quantity: '50 Bags', project: 'Green Valley', amount: 18500, status: 'pending', requester: 'Rahul S.', billUrl: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&q=80&w=300' },
  { id: 102, type: 'cash', item: 'Diesel for Generator', quantity: '20 Liters', project: 'Green Valley', amount: 2200, status: 'pending', requester: 'Amit S.', billUrl: null },
];

const INITIAL_GALLERY = [
  { id: 1, url: 'https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&q=80&w=300', title: 'Site Condition', type: 'before', date: 'Yesterday' },
  { id: 2, url: 'https://images.unsplash.com/photo-1541888946425-d81bb19240f5?auto=format&fit=crop&q=80&w=300', title: 'Slab Casting', type: 'after', date: 'Today' }
];

const INITIAL_MEETINGS = [
  { id: 1, title: 'Site Visit - Green Valley', date: 'Today', time: '2:00 PM', type: 'visit' },
  { id: 2, title: 'Client Meeting - Mr. Verma', date: 'Tomorrow', time: '11:00 AM', type: 'meeting' },
];

// --- COMPONENTS ---

const NotificationBadge = ({ count }) => count > 0 ? (
  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-bold animate-pulse">
    {count}
  </span>
) : null;

const ProgressBar = ({ value, color = "bg-blue-600", label }) => (
  <div className="w-full">
    {label && <div className="flex justify-between text-xs mb-1 text-slate-500"><span>{label}</span><span>{Math.min(100, Math.round(value))}%</span></div>}
    <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
      <div className={`h-full ${value > 100 ? 'bg-red-500' : color} rounded-full transition-all duration-500`} style={{ width: `${Math.min(100, value)}%` }} />
    </div>
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
  const [vendors, setVendors] = useState(VENDORS);
  const [estimations, setEstimations] = useState(INITIAL_ESTIMATIONS);
  const [pettyCash, setPettyCash] = useState(8500);
  const [leakageAlerts, setLeakageAlerts] = useState([]);
  const [toast, setToast] = useState(null);

  // UI State
  const [isProjectModalOpen, setIsProjectModalOpen] = useState(false);
  const [newProjectData, setNewProjectData] = useState({ name: '', location: '', budget: '' });
  const [selectedBill, setSelectedBill] = useState(null);
  
  // View States
  const [viewProject, setViewProject] = useState(null); 

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

  const handleTaskUpdate = (workerId, newTask) => {
    setWorkers(workers.map(w => w.id === workerId ? { ...w, task: newTask } : w));
  };

  const handleLogUpdate = (workerId, newLog) => {
    setWorkers(workers.map(w => w.id === workerId ? { ...w, workLog: newLog } : w));
  };

  const handleAttendance = (id, status) => {
    setWorkers(workers.map(w => w.id === id ? { ...w, status } : w));
  };

  const updateEstimation = (materialName, qty, projectId = 1) => {
    const est = estimations[projectId];
    if (!est || !est.materials[materialName]) return;

    const currentUsed = est.materials[materialName].used;
    const max = est.materials[materialName].estimated;
    const newUsed = currentUsed + parseFloat(qty);

    // Update State
    setEstimations(prev => ({
      ...prev,
      [projectId]: {
        ...prev[projectId],
        materials: {
          ...prev[projectId].materials,
          [materialName]: { ...prev[projectId].materials[materialName], used: newUsed }
        }
      }
    }));

    // Check Limit
    if (newUsed > max) {
      return { exceeded: true, diff: newUsed - max };
    }
    return { exceeded: false };
  };

  const checkLeakage = (task, quantity, consumed) => {
    // 1. Theoretical Check (Anti-Theft)
    const rule = CONSUMPTION_RULES[task];
    if (rule) {
      const allowed = quantity * rule.rate; 
      const actual = parseFloat(consumed);
      
      if (actual > allowed * 1.1) {
        const extra = (actual - allowed).toFixed(1);
        const alertMsg = `⚠️ LEAKAGE: ${task} used ${extra} ${rule.unit} excess!`;
        setLeakageAlerts(prev => [alertMsg, ...prev]);
        addActivity('alert', alertMsg, 'System');
        showToast("⚠️ Leakage Alert Sent");
      }
    }

    // 2. Estimation Check (Budget Control)
    // Map tasks to materials (Simplified for demo)
    let materialName = null;
    if (task.includes("Brick") || task.includes("Plaster") || task.includes("Flooring") || task.includes("Casting")) materialName = "Cement";
    
    if (materialName && consumed) {
      const status = updateEstimation(materialName, consumed);
      if (status?.exceeded) {
        // This is handled in the UI by requesting a reason
      }
    }
  };

  // --- SUB-APPS ---

  // 1. OWNER DESKTOP DASHBOARD
  const OwnerDashboard = () => (
    <div className="space-y-6 pb-20 animate-fadeIn">
      
      {/* Leakage Alerts */}
      {leakageAlerts.length > 0 && (
        <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-r-lg shadow-sm">
          <div className="flex items-start gap-3">
            <ShieldAlert className="text-red-600" size={24} />
            <div>
              <h3 className="font-bold text-red-800">Critical Material Alerts</h3>
              <ul className="list-disc pl-4 mt-1 text-sm text-red-700">
                {leakageAlerts.map((alert, i) => <li key={i}>{alert}</li>)}
              </ul>
              <button onClick={() => setLeakageAlerts([])} className="text-xs text-red-500 underline mt-2">Dismiss All</button>
            </div>
          </div>
        </div>
      )}

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

      {/* Main View OR Project Detail View */}
      {viewProject === null ? (
        <>
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
            <StatCard title="Vendor Dues" value="₹ 4.8L" subtext="3 Invoices Pending" icon={IndianRupee} />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              
              {/* Projects Grid */}
              <div className="bg-white rounded-xl border border-slate-100 shadow-sm overflow-hidden">
                <div className="p-5 border-b border-slate-100 flex justify-between items-center">
                  <h3 className="font-semibold text-slate-800">Live Projects</h3>
                  <span className="text-xs text-slate-400">{projects.length} Active Sites</span>
                </div>
                <div className="divide-y divide-slate-50">
                  {projects.map(project => (
                    <div 
                      key={project.id} 
                      onClick={() => setViewProject(project.id)}
                      className="p-5 hover:bg-slate-50 transition-colors cursor-pointer group"
                    >
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h4 className="font-medium text-slate-800 group-hover:text-blue-900 flex items-center gap-2">{project.name} <ArrowRight size={14} className="opacity-0 group-hover:opacity-100 transition-opacity text-blue-500"/></h4>
                          <p className="text-xs text-slate-500 flex items-center gap-1 mt-1"><MapPin size={12} /> {project.location}</p>
                        </div>
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

              {/* Vendor Ledger */}
              <div className="bg-white rounded-xl border border-slate-100 shadow-sm overflow-hidden">
                 <div className="p-5 border-b border-slate-100 flex justify-between items-center"><h3 className="font-semibold text-slate-800 flex items-center gap-2"><Store size={18}/> Vendor Ledger</h3></div>
                 <div className="divide-y divide-slate-50">
                   {vendors.map(v => (
                     <div key={v.id} className="p-4 flex justify-between items-center">
                       <div><p className="font-bold text-slate-700">{v.name}</p><p className="text-xs text-slate-500">Paid: ₹{(v.paid/100000).toFixed(1)}L / Billed: ₹{(v.billed/100000).toFixed(1)}L</p></div>
                       <div className="text-right"><p className="font-bold text-red-600 text-sm">Due: ₹{(v.billed - v.paid).toLocaleString()}</p></div>
                     </div>
                   ))}
                 </div>
              </div>
            </div>

            <div className="space-y-6">
               <div className="bg-white rounded-xl border border-slate-100 shadow-sm overflow-hidden">
                <div className="p-5 border-b border-slate-100 flex justify-between items-center bg-blue-50/50">
                  <h3 className="font-semibold text-slate-800 flex items-center gap-2"><CheckCircle2 size={18} className="text-blue-600"/> Approval Queue</h3>
                  <span className="text-xs font-bold bg-blue-100 text-blue-700 px-2 py-1 rounded-full">{requests.filter(r => r.status === 'pending').length} Pending</span>
                </div>
                <div className="divide-y divide-slate-50 max-h-[400px] overflow-y-auto">
                  {requests.filter(r => r.status === 'pending').map(req => (
                    <div key={req.id} className="p-4 flex items-center justify-between hover:bg-slate-50 transition-colors">
                      <div className="flex items-center gap-3">
                        <div className="bg-blue-100 p-2 rounded-lg text-blue-600"><Briefcase size={20}/></div>
                        <div><h4 className="font-medium text-slate-800">{req.item}</h4><p className="text-xs text-slate-500">{req.quantity} • {req.project}</p></div>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="font-bold text-slate-700">₹{req.amount.toLocaleString()}</span>
                        {req.billUrl && <button onClick={() => setSelectedBill({url: req.billUrl, amount: req.amount, id: req.id})} className="flex items-center gap-1 px-3 py-1.5 bg-purple-50 text-purple-700 rounded-lg text-xs font-bold hover:bg-purple-100 border border-purple-100"><Eye size={12} /> Bill</button>}
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
        </>
      ) : (
        // PROJECT DETAIL VIEW
        <div className="animate-fadeIn">
          {(() => {
            const project = projects.find(p => p.id === viewProject);
            const siteWorkers = workers.filter(w => w.projectId === viewProject);
            const est = estimations[viewProject] || estimations[1]; // Fallback for demo
            
            return (
              <div className="space-y-6">
                <button onClick={() => setViewProject(null)} className="flex items-center gap-2 text-slate-500 hover:text-slate-800 font-medium"><ArrowLeft size={18}/> Back to Dashboard</button>
                
                <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                  <div>
                    <h1 className="text-3xl font-bold text-slate-900">{project.name}</h1>
                    <p className="text-slate-500 flex items-center gap-2 mt-1"><MapPin size={16}/> {project.location} • <span className="bg-green-100 text-green-700 px-2 py-0.5 rounded text-xs font-bold">{project.status}</span></p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-slate-500">Supervisor</p>
                    <p className="font-bold text-slate-800">{project.supervisor}</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {/* ESTIMATION vs ACTUALS (CORE FEATURE) */}
                  <div className="lg:col-span-2 space-y-6">
                     <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5">
                        <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2"><Ruler size={18}/> Estimation vs Actuals</h3>
                        <div className="space-y-5">
                           {/* Material Estimation */}
                           {Object.entries(est.materials).map(([name, data]) => {
                              const percent = (data.used / data.estimated) * 100;
                              const isOver = percent > 100;
                              return (
                                 <div key={name}>
                                    <div className="flex justify-between text-sm mb-1">
                                       <span className="font-medium text-slate-700">{name}</span>
                                       <span className={`font-mono ${isOver ? 'text-red-600 font-bold' : 'text-slate-500'}`}>
                                          {data.used} / {data.estimated} {data.unit}
                                       </span>
                                    </div>
                                    <ProgressBar value={percent} color="bg-blue-600" />
                                    {isOver && <p className="text-[10px] text-red-500 mt-1 flex items-center gap-1"><AlertTriangle size={10}/> Exceeded by {data.used - data.estimated} {data.unit}</p>}
                                 </div>
                              );
                           })}
                           
                           <div className="grid grid-cols-2 gap-4 pt-2 border-t border-slate-100">
                              <div>
                                 <p className="text-xs text-slate-500 mb-1">Labour Days</p>
                                 <div className="flex items-end gap-2">
                                    <span className="text-xl font-bold text-slate-800">{est.labor.used}</span>
                                    <span className="text-xs text-slate-400 mb-1">/ {est.labor.estimated}</span>
                                 </div>
                                 <ProgressBar value={(est.labor.used/est.labor.estimated)*100} color="bg-purple-600"/>
                              </div>
                              <div>
                                 <p className="text-xs text-slate-500 mb-1">Timeline</p>
                                 <div className="flex items-end gap-2">
                                    <span className="text-xl font-bold text-slate-800">{est.timeline.used}</span>
                                    <span className="text-xs text-slate-400 mb-1">/ {est.timeline.estimated} Days</span>
                                 </div>
                                 <ProgressBar value={(est.timeline.used/est.timeline.estimated)*100} color="bg-orange-500"/>
                              </div>
                           </div>
                        </div>
                     </div>

                     {/* WORKFORCE LIST */}
                     <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                        <div className="p-5 border-b border-slate-100 bg-slate-50 flex justify-between items-center">
                           <h3 className="font-bold text-slate-800 flex items-center gap-2"><Users size={18}/> Site Workforce ({siteWorkers.length})</h3>
                        </div>
                        <div className="divide-y divide-slate-50">
                           {siteWorkers.length === 0 && <p className="p-8 text-center text-slate-400">No workers assigned to this site today.</p>}
                           {siteWorkers.map(worker => (
                           <div key={worker.id} className="p-4 hover:bg-slate-50">
                              <div className="flex justify-between items-start mb-2">
                                 <div>
                                 <p className="font-bold text-slate-800">{worker.name}</p>
                                 <p className="text-xs text-slate-500">{worker.role}</p>
                                 </div>
                                 <span className={`text-xs px-2 py-1 rounded font-bold ${worker.status === 'P' ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'}`}>
                                 {worker.status === 'P' ? 'Present' : 'Absent'}
                                 </span>
                              </div>
                              <div className="bg-slate-50 p-3 rounded border border-slate-100 mt-2">
                                 <p className="text-xs font-bold text-slate-500 uppercase mb-1">Task & Log</p>
                                 <p className="text-sm font-medium text-slate-800">{worker.task}</p>
                                 <p className="text-xs text-slate-600 italic">"{worker.workLog}"</p>
                              </div>
                           </div>
                           ))}
                        </div>
                     </div>
                  </div>

                  {/* STATS & ALERTS */}
                  <div className="space-y-6">
                    <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
                      <h3 className="font-bold text-slate-800 mb-4">Financials</h3>
                      <div className="space-y-4">
                        <div>
                          <div className="flex justify-between text-sm mb-1"><span>Budget Used</span><span className="font-bold">{(project.spent/project.budget*100).toFixed(0)}%</span></div>
                          <ProgressBar value={(project.spent/project.budget*100)} color="bg-blue-600" />
                          <p className="text-xs text-slate-500 mt-1">₹{(project.spent/100000).toFixed(1)}L / ₹{(project.budget/100000).toFixed(1)}L</p>
                        </div>
                        <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                          <span className="text-sm text-slate-600">Pending Issues</span>
                          <span className="bg-red-100 text-red-700 px-2 py-1 rounded text-xs font-bold">{project.issues}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })()}
        </div>
      )}
    </div>
  );

  // 2. OWNER MOBILE APP
  const OwnerMobileApp = () => {
    const [tab, setTab] = useState('home');
    const [viewProjectId, setViewProjectId] = useState(null); 

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
            {/* TAB: HOME */}
            {tab === 'home' && (
              <>
                {leakageAlerts.length > 0 && <div className="bg-red-500 text-white p-3 rounded-xl mb-4 text-xs font-bold shadow-lg flex items-center gap-2"><ShieldAlert size={16}/> {leakageAlerts.length} Critical Leakage Alerts!</div>}
                
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
            
            {/* TAB: PROJECTS (WITH DRILL-DOWN) */}
            {tab === 'projects' && (
               <div className="space-y-4 pt-2">
                  {!viewProjectId ? (
                     <>
                        <h3 className="font-bold text-slate-800 mb-2">Your Sites</h3>
                        {projects.map(p => (
                           <div key={p.id} onClick={() => setViewProjectId(p.id)} className="bg-white p-4 rounded-xl border border-slate-200 active:scale-95 transition-transform cursor-pointer shadow-sm">
                              <div className="flex justify-between items-start mb-2">
                                <h3 className="font-bold text-slate-800">{p.name}</h3>
                                <ArrowRight size={16} className="text-slate-400"/>
                              </div>
                              <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden mb-2"><div className="bg-blue-600 h-full" style={{width: `${p.progress}%`}}></div></div>
                              <div className="flex justify-between text-xs text-slate-500"><span>{p.progress}% Complete</span><span>{p.location}</span></div>
                           </div>
                        ))}
                     </>
                  ) : (
                     <div className="animate-fadeIn">
                        {(() => {
                           const p = projects.find(prj => prj.id === viewProjectId);
                           const siteWorkers = workers.filter(w => w.projectId === viewProjectId);
                           const est = estimations[viewProjectId] || estimations[1];

                           return (
                              <>
                                 <button onClick={() => setViewProjectId(null)} className="text-xs text-slate-500 mb-4 flex items-center gap-1 font-bold"><ArrowLeft size={14}/> Back to All Sites</button>
                                 
                                 {/* Project Header */}
                                 <div className="bg-blue-50 p-4 rounded-xl border border-blue-100 mb-4">
                                    <h3 className="font-bold text-blue-900 text-lg">{p.name}</h3>
                                    <p className="text-xs text-blue-600 flex items-center gap-1 mt-1"><MapPin size={12}/> {p.location}</p>
                                 </div>

                                 {/* ESTIMATION CARD (MOBILE) */}
                                 <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm mb-4">
                                    <h4 className="font-bold text-slate-800 mb-3 flex items-center gap-2 text-xs uppercase"><Ruler size={14}/> Estimations</h4>
                                    <div className="space-y-3">
                                       {Object.entries(est.materials).slice(0, 3).map(([name, data]) => {
                                          const percent = (data.used / data.estimated) * 100;
                                          return (
                                             <div key={name}>
                                                <div className="flex justify-between text-[10px] mb-1">
                                                   <span className="font-medium text-slate-700">{name}</span>
                                                   <span className="text-slate-500">{data.used} / {data.estimated}</span>
                                                </div>
                                                <ProgressBar value={percent} color="bg-blue-600" />
                                             </div>
                                          );
                                       })}
                                    </div>
                                 </div>

                                 {/* Daily Updates Section */}
                                 <h4 className="font-bold text-slate-800 mb-3 flex items-center gap-2"><ClipboardList size={16}/> Daily Site Updates</h4>
                                 <div className="space-y-3">
                                    {siteWorkers.length === 0 && <p className="text-center text-slate-400 text-xs py-4">No work logged today.</p>}
                                    {siteWorkers.map(w => (
                                       <div key={w.id} className="bg-white p-3 rounded-xl border border-slate-200 shadow-sm">
                                          <div className="flex justify-between items-center mb-2">
                                             <span className="font-bold text-slate-700 text-sm">{w.name} <span className="text-xs font-normal text-slate-400">({w.role})</span></span>
                                             <span className={`text-[10px] px-2 py-0.5 rounded font-bold ${w.status === 'P' ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'}`}>{w.status === 'P' ? 'Present' : 'Absent'}</span>
                                          </div>
                                          <div className="bg-slate-50 p-2 rounded text-xs border border-slate-100">
                                             <p className="font-bold text-slate-500 uppercase text-[9px] mb-1">Task Assigned</p>
                                             <p className="text-slate-800 mb-2">{w.task}</p>
                                             <p className="font-bold text-slate-500 uppercase text-[9px] mb-1">Work Log</p>
                                             <p className="text-slate-600 italic">"{w.workLog}"</p>
                                          </div>
                                       </div>
                                    ))}
                                 </div>
                              </>
                           );
                        })()}
                     </div>
                  )}
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

            {tab === 'finance' && (
               <div className="pt-2 space-y-4">
                  <h3 className="font-bold text-slate-800">Financial Overview</h3>
                  
                  {/* Summary Cards */}
                  <div className="grid grid-cols-2 gap-3">
                     <div className="bg-blue-900 text-white p-4 rounded-xl shadow-lg shadow-blue-900/20">
                        <p className="text-blue-200 text-xs mb-1">Total Spent</p>
                        <p className="text-xl font-bold">₹ 3.2 Cr</p>
                     </div>
                     <div className="bg-white p-4 rounded-xl border border-slate-200">
                        <p className="text-slate-400 text-xs mb-1">Pending Invoices</p>
                        <p className="text-xl font-bold text-slate-800">₹ 4.5 L</p>
                     </div>
                  </div>

                  <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
                     <p className="text-xs font-bold text-slate-400 uppercase">Vendor Ledger</p>
                     <div className="divide-y divide-slate-50 mt-2">
                        {vendors.map(v => (
                           <div key={v.id} className="py-2 flex justify-between text-sm">
                              <span>{v.name}</span>
                              <span className="text-red-600 font-bold">Due: ₹{(v.billed - v.paid).toLocaleString()}</span>
                           </div>
                        ))}
                     </div>
                  </div>
               </div>
            )}
         </div>
         <div className="absolute bottom-0 left-0 w-full bg-white border-t border-slate-200 flex py-1 z-20">
            <TabButton active={tab==='home'} onClick={()=>setTab('home')} icon={LayoutDashboard} label="Home" badge={requests.filter(r => r.status === 'pending').length} />
            <TabButton active={tab==='projects'} onClick={()=>setTab('projects')} icon={Briefcase} label="Sites" />
            <TabButton active={tab==='calendar'} onClick={()=>setTab('calendar')} icon={CalendarIcon} label="Calendar" />
            <TabButton active={tab==='finance'} onClick={()=>setTab('finance')} icon={IndianRupee} label="Finance" />
         </div>
      </div>
    );
  };

  // 3. SUPERVISOR APP
  const SupervisorApp = () => {
    const [tab, setTab] = useState('work');
    const [newRequest, setNewRequest] = useState({ item: '', qty: '', amount: '', bill: null });
    const [expense, setExpense] = useState({ item: '', cost: '' });
    
    // Add Worker State
    const [isAddWorkerOpen, setIsAddWorkerOpen] = useState(false);
    const [newWorkerData, setNewWorkerData] = useState({ name: '', role: 'Helper', wage: '' });
    
    // Audit State
    const [auditData, setAuditData] = useState({}); // Stores audit inputs for each worker
    
    // Exceed Logic State
    const [reasonModalOpen, setReasonModalOpen] = useState(false);
    const [currentAudit, setCurrentAudit] = useState(null); // { task, workerId, consumed, exceededAmount }
    const [excessReason, setExcessReason] = useState("");

    const handleFileUpload = (e, type, workerId = null) => {
       if (type === 'bill') { setNewRequest({ ...newRequest, bill: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&q=80&w=300' }); showToast("Bill Uploaded"); return; }
       if (workerId) {
          const newUrl = 'https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&q=80&w=300';
          setWorkers(workers.map(w => w.id === workerId ? { ...w, photos: { ...w.photos, [type]: newUrl } } : w));
          showToast("Photo saved");
       }
    };

    const handleAddWorker = () => {
       if(!newWorkerData.name || !newWorkerData.wage) return;
       const newId = workers.length + 1;
       setWorkers([...workers, { id: newId, name: newWorkerData.name, role: newWorkerData.role, wage: parseInt(newWorkerData.wage), status: 'P', task: '-', workLog: '', projectId: 1, photos: { before: null, after: null } }]);
       setIsAddWorkerOpen(false);
       setNewWorkerData({ name: '', role: 'Helper', wage: '' });
       showToast("Worker Added");
    };

    const handleAuditSubmit = (task, workerId) => {
       const data = auditData[workerId];
       if (!data) return;
       
       const rule = CONSUMPTION_RULES[task];
       if (rule) {
          const allowed = data.workQty * rule.rate;
          const actual = parseFloat(data.matConsumed);
          
          if (actual > allowed * 1.1) {
             // Trigger Reason Modal
             setCurrentAudit({ task, workerId, consumed: actual, allowed: allowed, unit: rule.unit });
             setReasonModalOpen(true);
          } else {
             // Normal Success
             showToast("Consumption Logged: Within Limits");
             setAuditData(prev => {
                const newState = { ...prev };
                delete newState[workerId];
                return newState;
             });
          }
       }
    };

    const submitExcessReason = () => {
        if (!excessReason) return showToast("Please enter a reason");
        
        // Log the alert with reason
        const extra = (currentAudit.consumed - currentAudit.allowed).toFixed(1);
        const alertMsg = `⚠️ LEAKAGE: ${currentAudit.task} used ${extra} ${currentAudit.unit} excess! Reason: "${excessReason}"`;
        
        setLeakageAlerts(prev => [alertMsg, ...prev]); // This updates Global State in a real app (context) but here simulating via prop/callback isn't setup so we do local + toast
        // In this single-file simul, we can't update Parent state easily from here without props, 
        // so we will show a success toast simulating the backend log.
        showToast("⚠️ Alert & Reason sent to Owner");
        
        setReasonModalOpen(false);
        setExcessReason("");
        setCurrentAudit(null);
    };

    const addExpense = () => {
       if(!expense.cost) return;
       setPettyCash(prev => prev - parseInt(expense.cost));
       setExpense({ item: '', cost: '' });
       showToast("Expense Logged from Wallet");
    };

    const submitProcurement = () => {
       setRequests(prev => [{ id: Date.now(), type: 'material', item: newRequest.item || 'New Item', quantity: newRequest.qty || '1 Unit', amount: newRequest.amount || 500, project: 'Green Valley', status: 'pending', billUrl: newRequest.bill }, ...prev]);
       setNewRequest({ item: '', qty: '', amount: '', bill: null });
       showToast("Request Sent");
    };

    return (
      <div className="max-w-md mx-auto bg-white h-[650px] rounded-xl shadow-2xl overflow-hidden border border-slate-200 flex flex-col relative">
         
         {/* Reason for Excess Modal */}
         <Modal isOpen={reasonModalOpen} onClose={()=>setReasonModalOpen(false)} title="Excess Consumption Alert">
            <div className="space-y-4">
                <div className="bg-red-50 p-3 rounded-lg border border-red-100 text-red-800 text-sm">
                    <strong>Limit Exceeded!</strong>
                    <p>Allowed: {currentAudit?.allowed.toFixed(1)} {currentAudit?.unit}</p>
                    <p>Used: {currentAudit?.consumed} {currentAudit?.unit}</p>
                </div>
                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Reason for Excess</label>
                    <textarea 
                        className="w-full p-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-red-500 outline-none" 
                        placeholder="e.g. Rain damage, Bad quality bricks..."
                        rows={3}
                        value={excessReason}
                        onChange={(e) => setExcessReason(e.target.value)}
                    />
                </div>
                <button onClick={submitExcessReason} className="w-full py-3 bg-red-600 text-white rounded-lg font-bold shadow-lg">Submit Explanation</button>
            </div>
         </Modal>

         <Modal isOpen={isAddWorkerOpen} onClose={()=>setIsAddWorkerOpen(false)} title="Add Daily Wager">
            <div className="space-y-4">
               <div><label className="block text-xs font-bold text-slate-500 uppercase mb-1">Worker Name</label><input type="text" className="w-full p-2 border border-slate-300 rounded-lg text-sm outline-none" value={newWorkerData.name} onChange={(e) => setNewWorkerData({...newWorkerData, name: e.target.value})} placeholder="e.g. Raju"/></div>
               <div><label className="block text-xs font-bold text-slate-500 uppercase mb-1">Role</label><select className="w-full p-2 border border-slate-300 rounded-lg text-sm outline-none" value={newWorkerData.role} onChange={(e) => setNewWorkerData({...newWorkerData, role: e.target.value})}>{ROLES.map(r => <option key={r} value={r}>{r}</option>)}</select></div>
               <div><label className="block text-xs font-bold text-slate-500 uppercase mb-1">Daily Wage (₹)</label><input type="number" className="w-full p-2 border border-slate-300 rounded-lg text-sm outline-none" value={newWorkerData.wage} onChange={(e) => setNewWorkerData({...newWorkerData, wage: e.target.value})} placeholder="500"/></div>
               <button onClick={handleAddWorker} className="w-full py-3 bg-blue-600 text-white rounded-lg font-bold shadow-lg mt-2">Add to List</button>
            </div>
         </Modal>

         <div className="bg-slate-900 text-white p-4 flex justify-between items-center shrink-0">
            <div><h2 className="font-bold text-lg">Site Ops</h2><p className="text-xs text-slate-400">Green Valley Heights</p></div>
            <div className="flex items-center gap-2 bg-slate-800 px-3 py-1 rounded-full border border-slate-700"><Wallet size={14} className="text-green-400"/><span className="text-xs font-mono">₹{pettyCash}</span></div>
         </div>
         <div className="flex-1 overflow-y-auto p-4 pb-20 bg-slate-50">
            
            {/* TAB: DAILY WORK */}
            {tab === 'work' && (
               <div className="space-y-6">
                  {/* Estimation Status Card (NEW) */}
                  <div className="bg-blue-50 p-4 rounded-xl border border-blue-100 shadow-sm">
                     <h3 className="font-bold text-blue-900 text-xs uppercase mb-3 flex items-center gap-2"><Ruler size={14}/> Site Estimates</h3>
                     <div className="space-y-3">
                        <div>
                           <div className="flex justify-between text-[10px] text-blue-800 mb-1"><span>Cement Used</span><span>4200 / 5000 Bags</span></div>
                           <div className="h-1.5 w-full bg-blue-200 rounded-full overflow-hidden"><div className="h-full bg-blue-600 w-[84%]"></div></div>
                        </div>
                        <div>
                           <div className="flex justify-between text-[10px] text-blue-800 mb-1"><span>Bricks Used</span><span>48k / 50k Pcs</span></div>
                           <div className="h-1.5 w-full bg-blue-200 rounded-full overflow-hidden"><div className="h-full bg-orange-500 w-[96%]"></div></div>
                        </div>
                     </div>
                  </div>

                  <div className="flex justify-between items-center"><h3 className="font-bold text-slate-800 flex items-center gap-2"><ClipboardList size={18}/> Workforce</h3><button onClick={() => setIsAddWorkerOpen(true)} className="text-xs bg-blue-100 text-blue-700 px-3 py-1.5 rounded-lg font-bold flex items-center gap-1 border border-blue-200"><UserPlus size={14}/> Add</button></div>
                  <div className="space-y-4">
                     {workers.filter(w => w.projectId === 1).map(worker => {
                        const isCustomTask = !CONSTRUCTION_TASKS.includes(worker.task) && worker.task !== "-";
                        const selectValue = isCustomTask ? "Others" : (CONSTRUCTION_TASKS.includes(worker.task) ? worker.task : "");
                        
                        return (
                           <div key={worker.id} className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
                              <div className="flex justify-between items-start mb-3 border-b border-slate-50 pb-3">
                                 <div><p className="font-bold text-slate-800">{worker.name}</p><p className="text-xs text-slate-500">{worker.role}</p></div>
                                 <div className="flex bg-slate-100 rounded p-1">{['P','A','HD'].map(s => (<button key={s} onClick={()=>handleAttendance(worker.id, s)} className={`text-[10px] px-2 py-0.5 rounded font-bold ${worker.status===s ? (s==='P'?'bg-emerald-500 text-white':s==='A'?'bg-red-500 text-white':'bg-orange-400 text-white') : 'text-slate-400'}`}>{s}</button>))}</div>
                              </div>
                              <div className="space-y-2 mb-4">
                                 <div>
                                    <label className="text-[10px] font-bold text-slate-400 uppercase">Task</label>
                                    <select className="w-full text-xs p-2 border border-slate-200 rounded bg-slate-50 outline-none mb-2" value={selectValue} onChange={(e) => { const val = e.target.value; if (val === "Others") handleTaskUpdate(worker.id, ""); else handleTaskUpdate(worker.id, val); }}>
                                       <option value="" disabled>Select Task</option>
                                       {CONSTRUCTION_TASKS.map(task => <option key={task} value={task}>{task}</option>)}
                                    </select>
                                    {(selectValue === "Others" || isCustomTask) && <input type="text" value={isCustomTask ? worker.task : ""} onChange={(e) => handleTaskUpdate(worker.id, e.target.value)} className="w-full text-xs p-2 border border-blue-200 rounded bg-blue-50 outline-none" placeholder="Type custom task..." />}
                                 </div>
                                 
                                 {/* ANTI-THEFT AUDIT UI (Only for matching tasks) */}
                                 {CONSUMPTION_RULES[worker.task] && (
                                    <div className="bg-orange-50 p-2 rounded border border-orange-100 animate-fadeIn">
                                       <p className="text-[9px] font-bold text-orange-700 uppercase mb-1 flex items-center gap-1"><ShieldAlert size={10}/> Material Audit</p>
                                       <div className="flex gap-2">
                                          <input type="number" placeholder="Work (sqft)" className="w-1/2 text-xs p-1 rounded border border-orange-200" onChange={e => setAuditData({...auditData, [worker.id]: { ...auditData[worker.id], workQty: e.target.value }})}/>
                                          <input type="number" placeholder={`Used ${CONSUMPTION_RULES[worker.task].unit}`} className="w-1/2 text-xs p-1 rounded border border-orange-200" onChange={e => setAuditData({...auditData, [worker.id]: { ...auditData[worker.id], matConsumed: e.target.value }})}/>
                                       </div>
                                       <button onClick={() => handleAuditSubmit(worker.task, worker.id)} className="w-full bg-orange-200 text-orange-800 text-[10px] font-bold mt-2 py-1 rounded hover:bg-orange-300">Verify Consumption</button>
                                    </div>
                                 )}

                                 <div><label className="text-[10px] font-bold text-slate-400 uppercase">Log</label><textarea defaultValue={worker.workLog} onChange={(e) => handleLogUpdate(worker.id, e.target.value)} rows={1} className="w-full text-xs p-2 border border-slate-200 rounded bg-slate-50 outline-none" placeholder="Work done..."></textarea></div>
                              </div>
                              <div className="bg-slate-50 p-3 rounded-lg border border-slate-100">
                                 <p className="text-[10px] font-bold text-slate-400 uppercase mb-2">Proof of Work</p>
                                 <div className="grid grid-cols-2 gap-3">
                                    <div onClick={(e) => handleFileUpload(e, 'before', worker.id)} className="aspect-video bg-white border border-dashed border-slate-300 rounded flex flex-col items-center justify-center cursor-pointer relative overflow-hidden">{worker.photos?.before ? <img src={worker.photos.before} className="w-full h-full object-cover"/> : <><Camera size={16} className="text-slate-300"/><span className="text-[9px] text-slate-400">Before</span></>}</div>
                                    <div onClick={(e) => handleFileUpload(e, 'after', worker.id)} className="aspect-video bg-white border border-dashed border-slate-300 rounded flex flex-col items-center justify-center cursor-pointer relative overflow-hidden">{worker.photos?.after ? <img src={worker.photos.after} className="w-full h-full object-cover"/> : <><CheckCircle2 size={16} className="text-slate-300"/><span className="text-[9px] text-slate-400">After</span></>}</div>
                                 </div>
                              </div>
                           </div>
                        );
                     })}
                  </div>
                  <button onClick={() => showToast("Daily Report Saved")} className="w-full py-3 bg-blue-600 text-white rounded-xl font-bold shadow-lg flex items-center justify-center gap-2"><Save size={16}/> Submit Daily Log</button>
               </div>
            )}

            {/* TAB: PETTY CASH (NEW) */}
            {tab === 'cash' && (
               <div className="space-y-4">
                  <h3 className="font-bold text-slate-800 flex items-center gap-2"><Banknote size={18}/> Digital Petty Cash</h3>
                  <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm text-center">
                     <p className="text-slate-400 text-xs uppercase mb-1">Current Balance</p>
                     <p className="text-3xl font-bold text-slate-800">₹ {pettyCash}</p>
                  </div>
                  <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm space-y-3">
                     <p className="text-xs font-bold text-slate-400 uppercase">Log Expense</p>
                     <input type="text" placeholder="Item (e.g. Tea for Staff)" className="w-full p-2 border border-slate-200 rounded-lg text-sm outline-none" value={expense.item} onChange={e => setExpense({...expense, item: e.target.value})} />
                     <input type="number" placeholder="Amount (₹)" className="w-full p-2 border border-slate-200 rounded-lg text-sm outline-none" value={expense.cost} onChange={e => setExpense({...expense, cost: e.target.value})} />
                     <button onClick={addExpense} className="w-full py-3 bg-slate-800 text-white rounded-lg font-bold shadow-md">Deduct from Wallet</button>
                  </div>
               </div>
            )}

            {/* TAB: BILLS */}
            {tab === 'requests' && (
               <div className="space-y-4">
                  <h3 className="font-bold text-slate-800">Raise Request & Upload Bill</h3>
                  <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm space-y-3">
                     <input type="text" placeholder="Item Name" className="w-full p-2 border border-slate-200 rounded-lg text-sm outline-none" value={newRequest.item} onChange={e => setNewRequest({...newRequest, item: e.target.value})} />
                     <div className="flex gap-2"><input type="text" placeholder="Qty" className="w-1/2 p-2 border border-slate-200 rounded-lg text-sm outline-none" value={newRequest.qty} onChange={e => setNewRequest({...newRequest, qty: e.target.value})} /><input type="number" placeholder="Amount (₹)" className="w-1/2 p-2 border border-slate-200 rounded-lg text-sm outline-none" value={newRequest.amount} onChange={e => setNewRequest({...newRequest, amount: e.target.value})} /></div>
                     <div onClick={(e) => handleFileUpload(e, 'bill')} className={`border-2 border-dashed rounded-lg p-4 flex flex-col items-center justify-center cursor-pointer transition-colors ${newRequest.bill ? 'border-emerald-400 bg-emerald-50' : 'border-slate-300 hover:bg-slate-50'}`}>{newRequest.bill ? <><CheckCircle2 size={20} className="text-emerald-500 mb-1" /><span className="text-xs font-bold text-emerald-600">Bill Uploaded</span></> : <><UploadCloud size={20} className="text-slate-400 mb-1" /><span className="text-xs text-slate-500">Tap to Upload Bill/Invoice</span></>}</div>
                     <button onClick={submitProcurement} className="w-full py-3 bg-blue-600 text-white rounded-lg font-bold shadow-md">Submit for Approval</button>
                  </div>
               </div>
            )}
         </div>
         <div className="absolute bottom-0 left-0 w-full bg-white border-t border-slate-200 flex py-1 z-20">
            <TabButton active={tab==='work'} onClick={()=>setTab('work')} icon={ClipboardList} label="Work" />
            <TabButton active={tab==='cash'} onClick={()=>setTab('cash')} icon={Wallet} label="Petty Cash" />
            <TabButton active={tab==='requests'} onClick={()=>setTab('requests')} icon={Store} label="Vendor/Bills" />
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
        <div className="p-4 border-t border-slate-800 text-xs text-center text-slate-500">v12.0 • Connected</div>
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