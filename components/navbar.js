import Link from 'next/link'
// import styles from '../styles/navbar.module.css'

export default function Navbar(){
    return (
        <nav className="flex flex-row w-screen h-12 bg-blue-200 items-center">
            <div className="" id="navbar-left">
                <div>
                    ProblemBank
                </div>
            </div>
            <div className="md:flex-grow" id="navbar-mid">
                
            </div>
            <div className="flex flex-row" id="navbar-right">

            </div>
        </nav>
    );
}