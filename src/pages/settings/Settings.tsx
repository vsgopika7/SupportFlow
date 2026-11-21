import PageHeader from '../../components/common/PageHeader'
import { useAuth } from '../../context/useAuth'
import { UserRound, Mail, ShieldCheck, Info, Code2, Database, Layers } from 'lucide-react'

function Settings() {
  const { user } = useAuth()

  return (
    <div>
      <PageHeader
        title="Settings"
        description="Manage your application preferences."
      />

      {/* My Profile */}
      <div className="card p-4 mb-4">
        <h5 className="mb-1">My Profile</h5>
        <p className="text-muted mb-4">
          View your account information.
        </p>

        {/* Profile Header */}
        <div className="d-flex align-items-center gap-3 mb-4">
          <div
            className="rounded-circle bg-primary text-white d-flex align-items-center justify-content-center"
            style={{ width: '65px', height: '65px', fontSize: '24px' }}
          >
            {user?.name?.charAt(0).toUpperCase()}
          </div>

          <div>
            <h4 className="mb-1">{user?.name}</h4>
            <span className="badge bg-primary-subtle text-primary">
              {user?.role}
            </span>
          </div>
        </div>

        <hr />

        {/* Profile Information */}
        <div className="row g-4">
          <div className="col-md-6">
            <label className="text-muted mb-2">Full Name</label>
            <div className="d-flex align-items-center gap-2">
              <UserRound size={18} />
              <span>{user?.name}</span>
            </div>
          </div>

          <div className="col-md-6">
            <label className="text-muted mb-2">Email Address</label>
            <div className="d-flex align-items-center gap-2">
              <Mail size={18} />
              <span>{user?.email}</span>
            </div>
          </div>

          <div className="col-md-6">
            <label className="text-muted mb-2">Account Role</label>
            <div className="d-flex align-items-center gap-2">
              <ShieldCheck size={18} />
              <span>{user?.role}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Application Information */}
      <div className="card p-4">
        <h5 className="mb-1">Application Information</h5>
        <p className="text-muted mb-4">
          Information about SupportFlow application.
        </p>

        <div className="row g-4">
          <div className="col-md-6">
            <label className="text-muted mb-2">Application Name</label>
            <div className="d-flex align-items-center gap-2">
              <Info size={18} />
              <span>SupportFlow</span>
            </div>
          </div>

          <div className="col-md-6">
            <label className="text-muted mb-2">Application Type</label>
            <div className="d-flex align-items-center gap-2">
              <Layers size={18} />
              <span>Customer Support Management System</span>
            </div>
          </div>

          <div className="col-md-6">
            <label className="text-muted mb-2">Version</label>
            <div className="d-flex align-items-center gap-2">
              <Info size={18} />
              <span>1.0.0</span>
            </div>
          </div>

          <div className="col-md-6">
            <label className="text-muted mb-2">Frontend Technologies</label>
            <div className="d-flex align-items-center gap-2">
              <Code2 size={18} />
              <span>React, TypeScript, Bootstrap</span>
            </div>
          </div>

          <div className="col-md-6">
            <label className="text-muted mb-2">Data Storage</label>
            <div className="d-flex align-items-center gap-2">
              <Database size={18} />
              <span>Browser Local Storage</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Settings