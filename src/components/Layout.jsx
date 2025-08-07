import { Link, useLocation } from "react-router-dom";
import {
  HomeIcon,
  FilmIcon,
  PlusIcon,
  ArrowRightOnRectangleIcon,
  UserIcon,
} from "@heroicons/react/24/outline";
import { useAuth } from "../contexts/AuthContext";

function Layout({ children }) {
  const { user, logout } = useAuth();
  const location = useLocation();

  const navigation = [
    { name: "Dashboard", href: "/", icon: HomeIcon },
    { name: "Filmografías", href: "/films", icon: FilmIcon },
    { name: "Nueva Filmografía", href: "/films/new", icon: PlusIcon },
  ];

  const handleLogout = () => {
    logout();
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <nav className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex">
              <div className="flex-shrink-0 flex items-center">
                <h1 className="text-xl font-bold text-gray-900">
                  Gestión de Filmografías
                </h1>
              </div>
              <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
                {navigation.map((item) => {
                  const Icon = item.icon;
                  return (
                    <Link
                      key={item.name}
                      to={item.href}
                      className={`${
                        location.pathname === item.href
                          ? "border-indigo-500 text-gray-900"
                          : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                      } inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium`}
                    >
                      <Icon className="mr-2 h-4 w-4" />
                      {item.name}
                    </Link>
                  );
                })}
              </div>
            </div>
            <div className="flex items-center space-x-4">
              {/* User info */}
              <div className="flex items-center text-sm text-gray-700">
                <UserIcon className="h-4 w-4 mr-1" />
                <span className="font-medium">{user?.username}</span>
                <span className="ml-1 text-xs text-gray-500">
                  ({user?.role})
                </span>
              </div>

              {/* Logout button */}
              <button
                onClick={handleLogout}
                className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-gray-500 hover:text-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                <ArrowRightOnRectangleIcon className="mr-2 h-4 w-4" />
                Cerrar Sesión
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main content */}
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">{children}</main>
    </div>
  );
}

export default Layout;
