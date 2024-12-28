const Footer = () => {
    return (
        <footer className="bg-gray-800">
            <div className="max-w-8xl mx-auto py-12 px-4 sm:px-6 lg:py-16 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    <div>
                        <img className="h-8" src="/logo.png" alt="CertiMeet" />
                        <p className="mt-4 text-gray-300 text-base">
                            Streamline your certificate generation and meeting management with CertiMeet.
                        </p>
                        <div className="mt-4 flex space-x-6">
                            <a href="#" className="text-gray-400 hover:text-gray-300">
                                <i className="fab fa-twitter text-xl"></i>
                            </a>
                            <a href="#" className="text-gray-400 hover:text-gray-300">
                                <i className="fab fa-linkedin text-xl"></i>
                            </a>
                            <a href="#" className="text-gray-400 hover:text-gray-300">
                                <i className="fab fa-github text-xl"></i>
                            </a>
                            <a href="#" className="text-gray-400 hover:text-gray-300">
                                <i className="fab fa-instagram text-xl"></i>
                            </a>
                        </div>
                    </div>
                    <div>
                        <h3 className="text-sm font-semibold text-gray-400 tracking-wider uppercase">Contact</h3>
                        <div className="mt-4">
                            <p className="text-base text-gray-300">123 Business Street</p>
                            <p className="text-base text-gray-300">Suite 100</p>
                            <p className="text-base text-gray-300">New York, NY 10001</p>
                            <p className="text-base text-gray-300">info@certimeet.com</p>
                        </div>
                    </div>
                    <div>
                        <div className="h-64 w-full rounded-lg overflow-hidden">
                            <img src="/map-placeholder.png" alt="Map" className="w-full h-full object-cover" />
                        </div>
                    </div>
                </div>
                <div className="mt-8 border-t border-gray-700 pt-8">
                    <p className="text-base text-gray-400 text-center">
                        © 2024 CertiMeet. All rights reserved. Powered by mdrana.com
                    </p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;