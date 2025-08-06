import React from 'react';
import { useTranslation } from 'react-i18next';
import EduNetImage from '../assets/EduNet.png'; // For desktop/tablet
import EduNet2 from "../assets/EduNet(2).jpeg"; // For mobile devices

function Hero() {
    const { t } = useTranslation();

    return (
        <section className="pt-20 bg-gray-50 sm:pt-22">
            <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
                <div className="max-w-2xl mx-auto text-center">
                    <h1 className="px-6 text-lg text-gray-600 font-sans">
                        {t('Learn together, for college and school students')}
                    </h1>
                    <div className="mt-5 text-4xl font-bold leading-tight text-gray-900 sm:leading-tight sm:text-5xl lg:text-6xl lg:leading-tight font-bold">
                        <span className="flex flex-col sm:inline">
                            {t('hero.title_collaborative')}&nbsp;
                            <span className="w-full text-center sm:w-auto sm:text-left">
                                <span className="relative inline-flex sm:inline">
                                    <span className="bg-gradient-to-r from-[#44BCFF] via-[#FF44EC] to-[#FF675E] blur-lg opacity-30 w-full h-full absolute inset-0"></span>
                                    <span className="relative"> {t('hero.title_learning')}</span>
                                </span>
                            </span>
                        </span>
                    </div>

                    <div className="px-8 sm:items-center sm:justify-center sm:px-0 sm:space-x-5 sm:flex mt-9">
                        <a
                            href="#auth"
                            className="inline-flex items-center justify-center w-full px-10 py-3 text-lg font-bold text-white transition-all duration-200 bg-gray-900 border-2 border-transparent sm:w-auto rounded-xl hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-900"
                            role="button"
                        >
                            {t('navbar.sign_in')}
                        </a>
                    </div>

                    <p className="mt-8 text-base text-gray-500 font-sans mb-8">
                        {t('hero.free')}
                    </p>
                </div>
            </div>

            <div className="pb-12 bg-white">
                <div className="relative">
                    <div className="absolute inset-0 h-2/3 bg-gray-50"></div>
                    <div className="relative mx-auto">
                        <div className="max-w-full sm:max-w-4xl lg:max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                            {/* Mobile image - shows only on screens smaller than sm (640px) */}
                            <img
                                className="block sm:hidden w-full h-auto object-contain shadow-lg border border-gray-200 rounded-lg"
                                src={EduNet2}
                                alt="EduNet platform screenshot"
                            />
                            {/* Desktop/tablet image - shows on sm and larger screens */}
                            <img
                                className="hidden sm:block w-full h-auto object-contain shadow-lg border border-gray-200 rounded-lg"
                                src={EduNetImage}
                                alt="EduNet platform screenshot"
                            />
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}

export default Hero;