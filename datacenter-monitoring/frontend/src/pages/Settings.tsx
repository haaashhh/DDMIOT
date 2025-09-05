import React, { useState } from 'react';
import { 
  Save, 
  Settings as SettingsIcon, 
  Bell,
  Shield,
  Database,
  Globe,
  User,
  Palette,
  Zap,
  AlertCircle,
  CheckCircle,
  Eye,
  EyeOff
} from 'lucide-react';

interface SettingsSection {
  id: string;
  title: string;
  icon: React.ReactNode;
  description: string;
}

interface NotificationSettings {
  emailAlerts: boolean;
  smsAlerts: boolean;
  criticalAlerts: boolean;
  maintenanceNotifications: boolean;
  weeklyReports: boolean;
}

interface SecuritySettings {
  twoFactorAuth: boolean;
  sessionTimeout: number;
  passwordPolicy: string;
  ipWhitelist: string;
}

interface SystemSettings {
  dataRetention: number;
  backupFrequency: string;
  logLevel: string;
  timezone: string;
}

interface UserProfile {
  name: string;
  email: string;
  role: string;
  department: string;
  phone: string;
}

const Settings: React.FC = () => {
  const [activeSection, setActiveSection] = useState('profile');
  const [showPassword, setShowPassword] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  // Settings state
  const [userProfile, setUserProfile] = useState<UserProfile>({
    name: 'Administrateur Système',
    email: 'admin@datacenter.com',
    role: 'Administrateur',
    department: 'IT Infrastructure',
    phone: '+33 1 23 45 67 89'
  });

  const [notifications, setNotifications] = useState<NotificationSettings>({
    emailAlerts: true,
    smsAlerts: false,
    criticalAlerts: true,
    maintenanceNotifications: true,
    weeklyReports: true
  });

  const [security, setSecurity] = useState<SecuritySettings>({
    twoFactorAuth: false,
    sessionTimeout: 60,
    passwordPolicy: 'strong',
    ipWhitelist: '192.168.1.0/24\n10.0.0.0/8'
  });

  const [system, setSystem] = useState<SystemSettings>({
    dataRetention: 365,
    backupFrequency: 'daily',
    logLevel: 'info',
    timezone: 'Europe/Paris'
  });

  const sections: SettingsSection[] = [
    {
      id: 'profile',
      title: 'Profil Utilisateur',
      icon: <User className="h-5 w-5" />,
      description: 'Gérer les informations de votre compte'
    },
    {
      id: 'notifications',
      title: 'Notifications',
      icon: <Bell className="h-5 w-5" />,
      description: 'Configurer les alertes et notifications'
    },
    {
      id: 'security',
      title: 'Sécurité',
      icon: <Shield className="h-5 w-5" />,
      description: 'Paramètres de sécurité et authentification'
    },
    {
      id: 'system',
      title: 'Système',
      icon: <Database className="h-5 w-5" />,
      description: 'Configuration système et maintenance'
    },
    {
      id: 'appearance',
      title: 'Apparence',
      icon: <Palette className="h-5 w-5" />,
      description: 'Personnaliser l\'interface utilisateur'
    },
    {
      id: 'integrations',
      title: 'Intégrations',
      icon: <Globe className="h-5 w-5" />,
      description: 'Connecter avec des services externes'
    }
  ];

  const handleSave = async () => {
    setSaving(true);
    // Simulate API call
    setTimeout(() => {
      setSaving(false);
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    }, 1500);
  };

  const renderProfileSettings = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-4">Informations Personnelles</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Nom complet
            </label>
            <input
              type="text"
              value={userProfile.name}
              onChange={(e) => setUserProfile({ ...userProfile, name: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email
            </label>
            <input
              type="email"
              value={userProfile.email}
              onChange={(e) => setUserProfile({ ...userProfile, email: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Rôle
            </label>
            <select
              value={userProfile.role}
              onChange={(e) => setUserProfile({ ...userProfile, role: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="Administrateur">Administrateur</option>
              <option value="Opérateur">Opérateur</option>
              <option value="Lecture Seule">Lecture Seule</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Département
            </label>
            <input
              type="text"
              value={userProfile.department}
              onChange={(e) => setUserProfile({ ...userProfile, department: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Téléphone
            </label>
            <input
              type="tel"
              value={userProfile.phone}
              onChange={(e) => setUserProfile({ ...userProfile, phone: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>
      </div>

      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-4">Changer le Mot de Passe</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Mot de passe actuel
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2"
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Nouveau mot de passe
            </label>
            <input
              type="password"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>
      </div>
    </div>
  );

  const renderNotificationSettings = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-4">Préférences de Notification</h3>
        <div className="space-y-4">
          {Object.entries({
            emailAlerts: 'Alertes par email',
            smsAlerts: 'Alertes par SMS',
            criticalAlerts: 'Alertes critiques uniquement',
            maintenanceNotifications: 'Notifications de maintenance',
            weeklyReports: 'Rapports hebdomadaires'
          }).map(([key, label]) => (
            <div key={key} className="flex items-center justify-between">
              <label className="text-sm font-medium text-gray-700">{label}</label>
              <button
                onClick={() => setNotifications({ ...notifications, [key]: !notifications[key as keyof NotificationSettings] })}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  notifications[key as keyof NotificationSettings] ? 'bg-blue-600' : 'bg-gray-200'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    notifications[key as keyof NotificationSettings] ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderSecuritySettings = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-4">Paramètres de Sécurité</h3>
        
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <label className="text-sm font-medium text-gray-700">Authentification à deux facteurs</label>
              <p className="text-sm text-gray-500">Ajouter une couche de sécurité supplémentaire</p>
            </div>
            <button
              onClick={() => setSecurity({ ...security, twoFactorAuth: !security.twoFactorAuth })}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                security.twoFactorAuth ? 'bg-blue-600' : 'bg-gray-200'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  security.twoFactorAuth ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Timeout de session (minutes)
            </label>
            <select
              value={security.sessionTimeout}
              onChange={(e) => setSecurity({ ...security, sessionTimeout: Number(e.target.value) })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value={30}>30 minutes</option>
              <option value={60}>1 heure</option>
              <option value={120}>2 heures</option>
              <option value={240}>4 heures</option>
              <option value={480}>8 heures</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Politique de mot de passe
            </label>
            <select
              value={security.passwordPolicy}
              onChange={(e) => setSecurity({ ...security, passwordPolicy: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="basic">Basique (8 caractères min)</option>
              <option value="strong">Fort (12 caractères, mixte)</option>
              <option value="enterprise">Entreprise (16 caractères, complexe)</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Liste blanche IP
            </label>
            <textarea
              rows={4}
              value={security.ipWhitelist}
              onChange={(e) => setSecurity({ ...security, ipWhitelist: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="192.168.1.0/24&#10;10.0.0.0/8"
            />
            <p className="text-sm text-gray-500 mt-1">Une adresse IP ou réseau par ligne</p>
          </div>
        </div>
      </div>
    </div>
  );

  const renderSystemSettings = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-4">Configuration Système</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Rétention des données (jours)
            </label>
            <input
              type="number"
              value={system.dataRetention}
              onChange={(e) => setSystem({ ...system, dataRetention: Number(e.target.value) })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Fréquence de sauvegarde
            </label>
            <select
              value={system.backupFrequency}
              onChange={(e) => setSystem({ ...system, backupFrequency: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="hourly">Toutes les heures</option>
              <option value="daily">Quotidienne</option>
              <option value="weekly">Hebdomadaire</option>
              <option value="monthly">Mensuelle</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Niveau de log
            </label>
            <select
              value={system.logLevel}
              onChange={(e) => setSystem({ ...system, logLevel: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="debug">Debug</option>
              <option value="info">Info</option>
              <option value="warning">Warning</option>
              <option value="error">Error</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Fuseau horaire
            </label>
            <select
              value={system.timezone}
              onChange={(e) => setSystem({ ...system, timezone: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="Europe/Paris">Europe/Paris (CET)</option>
              <option value="Europe/London">Europe/London (GMT)</option>
              <option value="America/New_York">America/New_York (EST)</option>
              <option value="Asia/Tokyo">Asia/Tokyo (JST)</option>
              <option value="UTC">UTC</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );

  const renderAppearanceSettings = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-4">Personnalisation de l'Interface</h3>
        
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">Thème</label>
            <div className="grid grid-cols-3 gap-4">
              {['Clair', 'Sombre', 'Automatique'].map((theme) => (
                <div key={theme} className="relative">
                  <input
                    type="radio"
                    name="theme"
                    value={theme}
                    className="sr-only"
                    defaultChecked={theme === 'Clair'}
                  />
                  <div className="cursor-pointer border-2 border-gray-200 rounded-lg p-4 hover:border-blue-300 transition-colors">
                    <div className="text-sm font-medium text-gray-900">{theme}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Couleur d'accent
            </label>
            <div className="flex space-x-3">
              {['blue', 'green', 'purple', 'red', 'yellow'].map((color) => (
                <button
                  key={color}
                  className={`w-8 h-8 rounded-full bg-${color}-500 hover:scale-110 transition-transform`}
                />
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Densité de l'affichage
            </label>
            <select className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent">
              <option value="compact">Compacte</option>
              <option value="normal">Normale</option>
              <option value="comfortable">Confortable</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );

  const renderIntegrationsSettings = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-4">Services Externes</h3>
        
        <div className="space-y-4">
          {[
            { name: 'Slack', description: 'Notifications dans vos canaux Slack', connected: true },
            { name: 'Microsoft Teams', description: 'Intégration avec Teams', connected: false },
            { name: 'PagerDuty', description: 'Gestion des incidents', connected: true },
            { name: 'Grafana', description: 'Tableaux de bord avancés', connected: false },
            { name: 'Prometheus', description: 'Collecte de métriques', connected: true },
          ].map((integration) => (
            <div key={integration.name} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
              <div className="flex items-center space-x-3">
                <div className={`w-3 h-3 rounded-full ${integration.connected ? 'bg-green-500' : 'bg-gray-300'}`} />
                <div>
                  <h4 className="text-sm font-medium text-gray-900">{integration.name}</h4>
                  <p className="text-sm text-gray-500">{integration.description}</p>
                </div>
              </div>
              <button
                className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                  integration.connected
                    ? 'text-red-700 bg-red-100 hover:bg-red-200'
                    : 'text-blue-700 bg-blue-100 hover:bg-blue-200'
                }`}
              >
                {integration.connected ? 'Déconnecter' : 'Connecter'}
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderContent = () => {
    switch (activeSection) {
      case 'profile': return renderProfileSettings();
      case 'notifications': return renderNotificationSettings();
      case 'security': return renderSecuritySettings();
      case 'system': return renderSystemSettings();
      case 'appearance': return renderAppearanceSettings();
      case 'integrations': return renderIntegrationsSettings();
      default: return renderProfileSettings();
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Paramètres</h1>
          <p className="text-gray-600">
            Configuration et personnalisation de votre environnement
          </p>
        </div>
        
        <button
          onClick={handleSave}
          disabled={saving}
          className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md shadow-sm text-sm font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
        >
          {saving ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
              Sauvegarde...
            </>
          ) : saved ? (
            <>
              <CheckCircle className="w-4 h-4 mr-2" />
              Sauvegardé
            </>
          ) : (
            <>
              <Save className="w-4 h-4 mr-2" />
              Sauvegarder
            </>
          )}
        </button>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Settings Navigation */}
        <div className="lg:w-1/4">
          <nav className="space-y-2">
            {sections.map((section) => (
              <button
                key={section.id}
                onClick={() => setActiveSection(section.id)}
                className={`w-full text-left px-4 py-3 rounded-lg transition-colors ${
                  activeSection === section.id
                    ? 'bg-blue-50 text-blue-700 border-l-4 border-blue-500'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                }`}
              >
                <div className="flex items-center space-x-3">
                  {section.icon}
                  <div>
                    <div className="font-medium">{section.title}</div>
                    <div className="text-xs text-gray-500">{section.description}</div>
                  </div>
                </div>
              </button>
            ))}
          </nav>
        </div>

        {/* Settings Content */}
        <div className="lg:w-3/4">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            {renderContent()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;