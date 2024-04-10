import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faSearch, faChevronUp, faChevronDown, faSignOutAlt } from '@fortawesome/free-solid-svg-icons';
import '../assets/css/admin1.css';


const HeaderAdmin = () => {
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const handleDropdownToggle = () => {
    setDropdownOpen(!dropdownOpen);
  };

  return (
    <header className="sticky top-0 z-999 flex w-full bg-white drop-shadow-1 dark:bg-boxdark dark:drop-shadow-none">
      <div className="flex flex-grow items-center justify-between px-4 py-4 shadow-2 md:px-6 2xl:px-11">
        <div className="hidden sm:block">
          <form action="https://formbold.com/s/unique_form_id" method="POST">
            <div className="relative">
              <button className="absolute left-0 top-1/2 -translate-y-1/2">
                <FontAwesomeIcon icon={faSearch} className="fill-body hover:fill-primary dark:fill-bodydark dark:hover:fill-primary" />
              </button>
              <input type="text" placeholder="Type to search..." className="w-full bg-transparent pl-9 pr-4 focus:outline-none xl:w-125" />
            </div>
          </form>
        </div>

        <div className="flex items-center gap-3 2xsm:gap-7">
          <ul className="flex items-center gap-2 2xsm:gap-4">
            <li>
              <div className="relative" onClick={handleDropdownToggle}>

                <a className="flex items-center gap-4" href="#">
                  <span className="hidden text-right lg:block">
                    <span className="block text-sm font-medium text-black dark:text-white">Thomas Anree</span>
                    <span className="block text-xs font-medium">UX Designer</span>
                  </span>

                  <span className="h-12 w-12 rounded-full">
                    {/* <img src="" alt="User" /> */}
                  </span>

                  <FontAwesomeIcon icon={dropdownOpen ? faChevronUp : faChevronDown} className="hidden fill-current sm:block" width="12" height="8" />
                </a>

                {/* Dropdown Start */}
                <div className={`absolute right-0 mt-4 flex w-62.5 flex-col rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark ${dropdownOpen ? 'block' : 'hidden'}`}>
                  <button className="flex items-center gap-3.5 px-6 py-4 text-sm font-medium duration-300 ease-in-out hover:text-primary lg:text-base">
                    <FontAwesomeIcon icon={faSignOutAlt} />
                    <span>Log Out</span>
                  </button>
                </div>
                {/* Dropdown End */}
              </div>
            </li>
          </ul>
        </div>
      </div>
    </header>
  );
};

export default HeaderAdmin;
