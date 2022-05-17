import Button from './button'
import {MdSearch} from 'react-icons/md'
// import styles from '../styles/navbar.module.css'

export default function Navbar(){
    return (
        <nav className="flex flex-row w-full h-12 items-center px-2 border-b-2 fixed top-0 z-30 bg-white">
            <div className="" id="navbar-left">
                <div>
                    <p className="text-blue-600 font-extrabold tracking-tighter text-xl">ProblemBank</p>
                </div>
            </div>
            <div className="flex-grow p-1 flex justify-center" id="navbar-mid">
                <div className="border-2 w-11/12 px-1 rounded-lg flex flex-row items-center">
                    <MdSearch className="text-gray-200"/>
                    <input placeholder="Search" className="w-11/12"></input>
                </div>
            </div>
            <div className="flex flex-row" id="navbar-right">
                <Button variant="" className="text-blue-700">Log In</Button>
                <span className="border-l-2 mx-2"></span>
                <Button>Sign Up</Button>
            </div>
        </nav>
    );
}