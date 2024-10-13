import { NavLink } from 'react-router-dom';
import SidebarNavigationButton from '../components/SidebarNavigationButton.jsx';
import Logo from '../components/Logo.jsx';
import { BiBell, BiHome, BiSearch, BiSolidCog, BiUser } from 'react-icons/bi';
import ProfileCard from '../components/ProfileCard.jsx';

export default function Sidebar() {
  return (
    <div className='sticky top-0 hidden md:block'>
      <div className='flex flex-col w-12 lg:w-[90%] gap-2'>
        <div className='ml-2'>
          <Logo />
        </div>

        <SidebarNavigationButton
          destination='/'
          text='Home'
          icon={<BiHome />}
        />
        <SidebarNavigationButton
          destination='/explore'
          text='Explore'
          icon={<BiSearch />}
        />
        <SidebarNavigationButton
          destination='/notifications'
          text='Notifications'
          icon={<BiBell />}
        />
        <SidebarNavigationButton
          destination='/profile'
          text='Profile'
          icon={<BiUser />}
        />
        <SidebarNavigationButton
          destination='/settings'
          text='Settings'
          icon={<BiSolidCog />}
        />

        <ProfileCard
          username='warko'
          handleName='Randy Orton'
          pfpUrl='https://e1.pxfuel.com/desktop-wallpaper/708/299/desktop-wallpaper-wwe-randy-orton-weneedfun-randy-orton-2019-thumbnail.jpg'
        />
      </div>
    </div>
  );
}
