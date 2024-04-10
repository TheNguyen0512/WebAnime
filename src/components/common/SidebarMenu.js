import React, { useState } from 'react';
import logo from "../assets/images/logo.svg";
import '../assets/css/admin1.css';

const SidebarMenu = () => {
  const [sidebarToggle, setSidebarToggle] = useState(false);
  const [selected, setSelected] = useState('Dashboard');

  const handleSidebarToggle = () => {
    setSidebarToggle(!sidebarToggle);
  };

  return (
    <aside className={`absolute left-0 top-0 z-9999 flex h-screen w-72.5 flex-col overflow-y-hidden bg-black duration-300 ease-linear dark:bg-boxdark lg:static lg:translate-x-0 ${sidebarToggle ? 'translate-x-0' : '-translate-x-full'}`}>
      <div className="flex items-center justify-between gap-2 px-6 py-5.5 lg:py-6.5">
        <a href="">
          <img src={logo} alt="Logo" />
        </a>
      </div>
      <div className="no-scrollbar flex flex-col overflow-y-auto duration-300 ease-linear">
        <nav className="mt-5 px-4 py-4 lg:mt-9 lg:px-6">
          <div>
            <h3 className="mb-4 ml-4 text-sm font-medium text-bodydark2">MENU</h3>

            <ul className="mb-6 flex flex-col gap-1.5">
              <li>
                <a className={`group relative flex items-center gap-2.5 rounded-sm px-4 py-2 font-medium text-bodydark1 duration-300 ease-in-out hover:bg-graydark dark:hover:bg-meta-4 ${selected === 'Dashboard' && 'bg-graydark dark:bg-meta-4'}`} href="index.html" onClick={() => setSelected(selected === 'Dashboard' ? '' : 'Dashboard')}>
                  Dashboard
                </a>
              </li>
              <li>
                <a className={`group relative flex items-center gap-2.5 rounded-sm py-2 px-4 font-medium text-bodydark1 duration-300 ease-in-out hover:bg-graydark dark:hover:bg-meta-4 ${selected === 'Tables' && 'bg-graydark dark:bg-meta-4'}`} href="tables.html" onClick={() => setSelected(selected === 'Tables' ? '' : 'Tables')}>
                  Tables
                </a>
              </li>
              <li>
                <a className={`group relative flex items-center gap-2.5 rounded-sm py-2 px-4 font-medium text-bodydark1 duration-300 ease-in-out hover:bg-graydark dark:hover:bg-meta-4 ${selected === 'Settings' && 'bg-graydark dark:bg-meta-4'}`} href="settings.html" onClick={() => setSelected(selected === 'Settings' ? '' : 'Settings')}>
                  Settings
                </a>
              </li>
            </ul>
          </div>
        </nav>
      </div>
    </aside>
  );
};

export default SidebarMenu;
