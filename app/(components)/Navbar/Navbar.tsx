"use client"
import {useState} from 'react'
import logo from '../../../public/elqasr-logo.png'
import { motion } from 'framer-motion';
import Image from 'next/image'
interface NavMenuProps {
    id:number,
    title:string,
    link:string
}
const NavMenu:NavMenuProps[] =[
    {
        id:1,
        title:"Home",
        link:"/"
    },
    {
        id:2,
        title:"Projects",
        link:"#"
    },
    {
        id:3,
        title:"About",
        link:"#"
    },
    {
        id:4,
        title:"Contact",
        link:"#"
    },
    {
        id:5,
        title:"Admin",
        link:"#"
    }
]
export default function Navbar(){
    const [isOpen, setIsOpen] = useState<boolean>(false);

    const navbarVariant  = {
        hidden: { opacity: 0, y: -20 },
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                duration: 0.6,
                ease: "easeOut",
                when: "beforeChildren",
                staggerChildren: 0.1,
            },
        },
    };

    return (
        <>
            <motion.div
                className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 "
                variants={navbarVariant}
                initial="hidden"
                animate="visible"
            >
                <div className=" w-full max-w-screen-xl flex justify-between items-center py-4 px-4 md:px-8 mx-auto gap-8">
                    <div >
                        <Image
                            src={logo}
                            alt="company logo"
                            className="w-20 h-auto"
                        />
                    </div>
                    <ul className="hidden md:flex justify-center gap-6">
                        {NavMenu.map((item :NavMenuProps) => (
                            <motion.li
                                key={item.id}
                                whileHover={{scale: 1.05, y: -2}}
                                className="relative cursor-pointer"
                            >
                                <a
                                    href={item.link}
                                    className="text-gray-700 hover:text-blue-500 transition-colors duration-300
          after:absolute after:left-0 after:bottom-0 after:h-[2px] after:w-0
          after:bg-blue-500 after:transition-all after:duration-300
          hover:after:w-full"

                                >
                                    {item.title}
                                </a>
                            </motion.li>
                        ))}
                    </ul>
                    {/* Mobile Toggle Button */}
                    <button onClick={() => setIsOpen(!isOpen)} className="md:hidden text-gray-500 mr-3">
                        ☰
                    </button>

                </div>
            </motion.div>
            <motion.div
                initial={{ x: "-100%" }}
                animate={{ x: isOpen ? 0 : "-100%" }}
                transition={{ type: "tween", duration: 0.3 }}
                className="fixed top-0 left-0 w-64 h-full bg-gray-800 text-white p-6 z-50 md:hidden"
            >
                <button onClick={() => setIsOpen(false)} className="mb-4 text-right text-xl">×</button>
                <ul className="flex flex-col gap-4">
                    {NavMenu.map((item:NavMenuProps) => (
                        <li key={item.id}>
                            <a href={item.link} onClick={() => setIsOpen(false)}>{item.title}</a>
                        </li>
                    ))}
                </ul>
            </motion.div>

        </>
    )
}
