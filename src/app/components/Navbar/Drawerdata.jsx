import React from "react";
import Link from "next/link";
import Signindialog from './Signindialog';

const navigation = [
    { name: 'Home', href: '#home-section', current: false },
    { name: 'About us', href: '#about-section', current: false },
    { name: 'Recipe', href: '#cook-section', current: false },
    { name: 'Gallery', href: '#gallery-section', current: false },
];

function classNames(...classes) {
    return classes.filter(Boolean).join(' ');
}

const Data = () => {
    return (
        <div className="rounded-md max-w-sm w-full mx-auto">
            <div className="flex-1 space-y-4 py-1">
                <div className="sm:block">
                    <div className="space-y-1 px-5 pt-2 pb-3">
                        {navigation.map((item) => (
                            <Link
                                key={item.name}
                                href={item.href}
                                className={classNames(
                                    item.current ? 'bg-gray-900 text-purple' : 'text-black hover:bg-gray-700 hover:text-purple',
                                    'block py-2 rounded-md text-base font-medium'
                                )}
                                aria-current={item.current ? 'page' : undefined}
                            >
                                {item.name}
                            </Link>
                        ))}
                        <div className="mt-4"></div>
                     
                             <Signindialog/>
                       
                      

                        {/* <Contactusform /> */}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Data;